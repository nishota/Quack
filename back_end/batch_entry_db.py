# -*- coding: utf-8 -*-
import json
import os
import datetime
import time,calendar
import schedule
import db_utils
import twitter_util as tu
from payload_pack_01 import p_debug_01
import config


# 環境情報
app_config = config.DevelopmentConfig
# app_config = config.ProductionConfig
# TODO 複数キーワード指定の際は、異なるキーワード間でid(tweet)重複する場合はあるので考慮すること
# 対応例　DBのid,trendを複合主キーとする等（insertのレスポンスは落ちてしまう)

# twitter取得オプション
KEYWORDS_MAX = 1 # キーワード数
SCHEDULE_TREND = 7 # トレンド保存実行間隔(min)
SCHEDULE_TWEET = 5 # ツイート保存実行間隔(second)

# Twitter認証
TWITTER = tu.TwitterUtil(app_config)

# グローバル変数
g_keywords = [] # キーワードリスト

# defaultトレンド
# default値有の場合、twitter apiによるトレンド取得を行わず、defalut値にて
# ツイート検索を行います。
try:
    g_default_trend = os.environ["DEFAULT_TREND"]
except Exception as identifier:
    g_default_trend = ''

"""
    save db
"""

def save_twitter_trend():
    """twitterのトレンドワードをDB保存する
    
    Parameters
    ----------

    Returns
    -------
    keywords :
        トレンド上位のキーワードリスト

    """
    if not g_default_trend:
        # トレンド自動取得モード
        # トレンド取得
        trends = TWITTER.fetch_twitter_trend()
        # トレンド取得結果整形
        rec_twitter_sysid, recs_twitter_trends = shape_twitter_trend(trends)
    else:
        # トレンド手動設定モード
        rec_twitter_sysid, recs_twitter_trends = shape_default_trend([g_default_trend])


    # DB保存(トレンド取得結果)
    # twitter_sysid_tbl
    entities_twitter_sysid_Tbl = db_utils.TwitterSysidTbl.populate_entity([rec_twitter_sysid])
    db_utils.saveEntities(entities_twitter_sysid_Tbl)

    # 重複防止方式変更
    # ツイート前回以前全論理削除方式から、since_id方式に変更
    # twitter_trends_tbl
    # entitiesTwitterTrendsTbl = db_utils.TwitterTrendsTbl.populate_entity(recs_twitter_trends, entities_twitter_sysid_Tbl[0].sys_id)
    # DB保存前処理
    db_utils.TwitterTrendsTbl.delete_all_logical()
    # DB保存
    entitiesTwitterTrendsTbl = db_utils.TwitterTrendsTbl.populate_entity([recs_twitter_trends[0]], entities_twitter_sysid_Tbl[0].sys_id)
    db_utils.saveEntities(entitiesTwitterTrendsTbl)

    # 検索キーワード決定 
    keywords = get_trend_word_from_above(recs_twitter_trends,KEYWORDS_MAX)

    return keywords


def save_twitter_tweet(keywords):
    """twitterのキーワード検索結果ツイートをDB保存する
    
    Parameters
    ----------
    keywords :
        検索ワードのリスト

    Returns
    -------

    """
    # tweet取得
    # 取得するツイートのsince_idを取得
    since_id = db_utils.TwitterApiTbl.get_max_id()  
    tweets_keyword_list = [(TWITTER.fetch_tweet_with_keyword(keyword,since_id), keyword) for keyword in keywords]

    # tweet取得結果整形
    recs_twitter_api = []
    for tweets,keyword in tweets_keyword_list:
        recs_twitter_api.extend(shape_tweet_with_keyword(tweets, keyword))

    # 重複防止方式変更
    # ツイート前回以前全論理削除方式から、since_id方式に変更
    # DB保存前処理
    # db_utils.TwitterApiTbl.delete_all_logical()

    # DB保存(検索結果)
    db_utils.saveEntities(db_utils.TwitterApiTbl.populate_entity(recs_twitter_api))

"""
    shape fetched twitter API result
"""

def shape_twitter_trend(trends):
    """twitter api(trends/place)のトレンド取得結果を、db保存用に整形する
    
    Parameters
    ----------
    trends :
        twitter api(trends/place)からのレスポンスオブジェクト

    Returns
    -------
    rec_twitter_sysid :
        twitter_sysid_tblに保存する単一レコード(辞書型)
    recs_twitter_trends_sorted :
        twitter_trends_tblに保存する複数レコード(辞書型のリスト)
    """
    json_trends = json.loads(trends.text)

    '''
        twitter_sysid_tbl
    '''
    rec_twitter_sysid = {}
    # rec_twitter_sysid['sys_id'] = ''

    # 時刻整形(utc)
    time_utc = time.strptime(json_trends[0]['created_at'], '%Y-%m-%dT%H:%M:%SZ')
    time_utc_str = time.strftime("%Y-%m-%d %H:%M:%S", time_utc)
    rec_twitter_sysid['created_at'] = time_utc_str

    rec_twitter_sysid['as_of'] = json_trends[0]['as_of']    
    # rec_twitter_sysid['delete_flag'] = ''

    '''
        twitter_trends_tbl
    '''
    # 人気キーワード判定仕様検討
    # recs_twitter_trends_exist = []
    # recs_twitter_trends_none = []
    recs_twitter_trends_sorted = []
    for json_trend in json_trends[0]['trends']:
        # twitterハッシュタグのみ取り扱う場合はコメントアウト解除
        if not json_trend['name'].startswith('#'):
            continue

        rec_twitter_trends = {}
        # rec_twitter_trends['sys_id'] = ''
        rec_twitter_trends['tweet_volume'] = json_trend['tweet_volume']
        rec_twitter_trends['name'] = json_trend['name']
        rec_twitter_trends['query'] = json_trend['query']
        # rec_twitter_trends['delete_flag'] = ''

        # 人気キーワード判定仕様検討
        recs_twitter_trends_sorted.append(rec_twitter_trends)
        # if rec_twitter_trends['tweet_volume'] is not None:
        #     recs_twitter_trends_exist.append(rec_twitter_trends)
        # else:
        #     recs_twitter_trends_none.append(rec_twitter_trends)

    # 人気キーワード判定仕様検討
    # ソート(tweet_volumeの降順　nullは末尾)
    # recs_twitter_trends_sorted = sorted(recs_twitter_trends_exist, key=lambda x:x['tweet_volume'], reverse = True)
    # recs_twitter_trends_sorted.extend(recs_twitter_trends_none)

    return rec_twitter_sysid, recs_twitter_trends_sorted


def shape_default_trend(trends):
    """トレンドをdb保存用に整形する
    
    Parameters
    ----------
    trends :
        トレンドワード群

    Returns
    -------
    rec_twitter_sysid :
        twitter_sysid_tblに保存する単一レコード(辞書型)
    recs_twitter_trends_sorted :
        twitter_trends_tblに保存する複数レコード(tweet_volumuで降順ソートされたリスト)
    """

    '''
        twitter_sysid_tbl
    '''
    rec_twitter_sysid = {}

    # 現在時刻設定(UTC)
    now = datetime.datetime.utcnow()
    time_local_str = now.strftime("%Y-%m-%d %H:%M:%S")
    rec_twitter_sysid['created_at'] = time_local_str

    rec_twitter_sysid['as_of'] = ''    
    # rec_twitter_sysid['delete_flag'] = ''

    '''
        twitter_trends_tbl
    '''
    recs_twitter_trends_sorted = []
    for trend in trends:
        rec_twitter_trends = {}
        # rec_twitter_trends['sys_id'] = ''
        rec_twitter_trends['tweet_volume'] = None
        rec_twitter_trends['name'] = trend
        rec_twitter_trends['query'] = ''
        # rec_twitter_trends['delete_flag'] = ''

        # 人気キーワード判定仕様検討
        recs_twitter_trends_sorted.append(rec_twitter_trends)

    return rec_twitter_sysid, recs_twitter_trends_sorted


def shape_tweet_with_keyword(tweets,keyword):
    """twitter api(search/tweets)の検索結果を、db保存用に整形する
    
    Parameters
    ----------
    tweets :
        twitter api(search/tweets)からのレスポンスオブジェクト
    keyword :
        検索に使用したキーワード

    Returns
    -------
    recs_twitter_api_sorted :
        twitter_api_tblに保存する複数レコード(idで昇順ソートされたリスト)
    """
    json_tweets = json.loads(tweets.text)

    '''
        twitter_api_tbl
    '''
    recs_twitter_api = []
    for json_tweet in json_tweets['statuses']:
        rec_twitter_api = {}
        rec_twitter_api['id'] = json_tweet['id']
        rec_twitter_api['id_str'] = json_tweet['id_str']
        rec_twitter_api['screen_name'] = json_tweet['user']['screen_name']

        # 現在時刻設定(utc)
        time_utc = time.strptime(json_tweet['created_at'], '%a %b %d %H:%M:%S +0000 %Y')
        time_utc_str = time.strftime("%Y-%m-%d %H:%M:%S", time_utc)
        rec_twitter_api['created_at'] = time_utc_str

        # rec_twitter_api['create_time'] = ''

        # 最大文字数60以上を切り捨て
        text = json_tweet['text']
        if len(text) <= 60:
            rec_twitter_api['text'] = text
        else: 
            rec_twitter_api['text'] = text[:59] + '...'

        rec_twitter_api['trend'] = keyword # 検索キーワード
        rec_twitter_api['user_id'] = json_tweet['user']['id']
        rec_twitter_api['user_id_str'] = json_tweet['user']['id_str']
        rec_twitter_api['use_name'] = json_tweet['user']['name']
        # rec_twitter_api['sys_create_date'] = ''
        # rec_twitter_api['hidden_flag'] = ''
        # rec_twitter_api['delete_flag'] = ''

        recs_twitter_api.append(rec_twitter_api)
    
    # ソート(idの降順)
    recs_twitter_api_sorted = sorted(recs_twitter_api, key=lambda x:x['id'])

    return recs_twitter_api_sorted        


"""

    others

"""


def get_trend_word_from_above(trends,keywords_max):
    """トレンドのリストから、最大[keywords_max]アイテムのトレンドワードを取得
    ※ホットトレンドワード取得に利用する場合は、[tweet_volume]で降順ソート済のリストを渡すこと
    
    Parameters
    ----------
    trends : 
        トレンドリスト
    keywords_max :
        トレンドワード取得数

    Returns
    -------
    keywords :
        トレンドワードリスト
    """
    keywords = []
    loop_count =  keywords_max if len(trends) > keywords_max else len(trends) 
    for i in range(loop_count):
        keywords.append(trends[i]['name'])
    return keywords


"""
    schedule
"""

def job_save_trend():
    """twitterのトレンドDB保存ジョブ
    
    Parameters
    ----------

    Returns
    -------

    """
    print("job_save_trend is working...")
    print(datetime.datetime.utcnow().strftime("%Y-%m-%d_%H:%M:%S_JST"))
    global g_keywords
    g_keywords = save_twitter_trend()


def job_save_tweet():
    """twitterのトレンドに基づくツイート検索結果DB保存ジョブ
    
    Parameters
    ----------

    Returns
    -------

    """
    print("job_save_tweet is working...")
    print(datetime.datetime.utcnow().strftime("%Y-%m-%d_%H:%M:%S_JST"))
    save_twitter_tweet(g_keywords)

def schedule_execute():
    if not g_default_trend:
        schedule.every(SCHEDULE_TREND).minutes.do(job_save_trend)
    schedule.every(SCHEDULE_TWEET).seconds.do(job_save_tweet)
    # schedule.every().hour.do(job)
    # schedule.every().day.at("10:30").do(job)
    # schedule.every(5).to(10).minutes.do(job)
    # schedule.every().monday.do(job)
    # schedule.every().wednesday.at("13:15").do(job)

    while True:
        schedule.run_pending()
        time.sleep(1)

"""
    main
"""

if __name__ == "__main__":
    if not TWITTER:
        TWITTER = tu.TwitterUtil(app_config)
    g_keywords = save_twitter_trend()
    save_twitter_tweet(g_keywords)
    schedule_execute()
    