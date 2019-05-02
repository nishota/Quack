# -*- coding: utf-8 -*-
# TODO 機能毎のファイル分け
# TODO docstringの見直し
# TODO 全般的なエラーハンドラの作成
# TODO Twitter-バックエンド連携のスケジュール実行機能の作成
# TODO フロントエンド-バックエンド連携機能の作成
from flask import Flask, request, abort, jsonify, make_response, request as req
from flask_cors import CORS
from urllib import request
from bs4 import BeautifulSoup
import json
import os
from requests_oauthlib import OAuth1Session
import datetime

"""
    app config
"""

app = Flask(__name__)
CORS(app, resources=r'*')
app.config['JSON_AS_ASCII'] = False

"""
    app rooting
"""

@app.route('/')
def output_test():
    return scraping_yomiuri()[0]


@app.route('/json/news', methods=['GET'])
def output_jsonNewsGet():
    return make_response(jsonify(shapeNews(scraping_yomiuri())))


@app.route('/json/news', methods=['POST'])
def output_jsonNewsPost():
    return make_response(jsonify(shapeNews(scraping_yomiuri())))


@app.route('/json/twitter/account', methods=['GET'])
def output_jsonTweetWithAccountGet():
    print(req)
    account = req.args.get('account')
    if account is None:
        account = 'McDonaldsJapan'
    print(account)
    return make_response(jsonify(json.loads(fetchTweetWithAccount(account).text)))


@app.route('/json/twitter/account', methods=['POST'])
def output_jsonTweetWithAccountPost():
    return make_response(jsonify(json.loads(fetchTweetWithAccount('McDonaldsJapan').text)))


@app.route('/json/twitter/keyword', methods=['GET'])
def output_jsonTweetWithKeywordGet():
    print(req)
    keyword = req.args.get('keyword')
    if keyword is None:
        keyword = '令和'
    print(keyword)
    return make_response(jsonify(json.loads(fetchTweetWithKeyword(keyword).text)['statuses']))


@app.route('/json/twitter/keyword', methods=['POST'])
def output_jsonTweetWithKeywordPost():
    return make_response(jsonify(json.loads(fetchTweetWithKeyword('ビッグマック').text)['statuses']))


@app.route('/json/twitter/trend', methods=['GET'])
def output_jsonTweetTrendGet():
    return make_response(jsonify(json.loads(fetchTwitterTrend().text)))


@app.route('/json/twitter/trend', methods=['POST'])
def output_jsonTweetTrendPost():
    return make_response(jsonify(json.loads(fetchTwitterTrend().text)))


"""
    save db
"""

def save_twitter():
    # DB保存前処理
    # TODO 古いデータの削除

    # トレンド取得
    trends = fetchTwitterTrend()

    # トレンド取得結果整形
    rec_twitter_sysid, recs_twitter_trends = shapeTwitterTrend(trends)
    # --Debug--
    print(rec_twitter_sysid)
    print(recs_twitter_trends)

    # DB保存(トレンド取得結果)
    # TODO 保存処理
    # TODO torendセットのID(シーケンス)取得

    # 検索キーワード決定
    # TODO torendの順序付け(tweet_volumeを指標または前回検索データ利用)による検索キーワードの決定 
    keywords = ['令和','GACKT']

    # tweet取得
    tweetsList = []
    for keyword in keywords:
        tweetsList.append(fetchTweetWithKeyword(keyword))

    # tweet取得結果整形
    recs_twitter_api = []
    for tweets in tweetsList:
        recs_twitter_api.append(shapeTweetWithKeyword(tweets))
    # --Debug--
    print(recs_twitter_api)

    # DB保存(検索結果)
    # TODO 保存処理


"""
    Auth to twitter API
"""

def twitterAuth():
    # OAuth
    # TODO 認証キーの設定ファイル化の検討
    '''
        開発
    '''
    TWITTER_API_KEY = ''
    TWITTER_API_SECRET_KEY = ''
    TWITTER_ACCESS_TOKEN = ''
    TWITTER_ACCESS_TOKEN_SECRET = ''
    '''
        本番
    '''
    # TWITTER_API_KEY = os.environ["TWITTER_API_KEY"]
    # TWITTER_API_SECRET_KEY = os.environ["TWITTER_API_SECRET_KEY"]
    # TWITTER_ACCESS_TOKEN = os.environ["TWITTER_ACCESS_TOKEN"]
    # TWITTER_ACCESS_TOKEN_SECRET = os.environ["TWITTER_ACCESS_TOKEN_SECRET"]
    twitter = OAuth1Session(TWITTER_API_KEY, TWITTER_API_SECRET_KEY, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET)
    return twitter

"""
    fetch from twitter API
"""

def fetchTwitterTrend():
    # OAuth
    twitter = twitterAuth()

    # get-request to twitter api
    url = 'https://api.twitter.com/1.1/trends/place.json'
    params = {             
        'id' : 1118550    # WOEID (Yokohama)
    }
    req = twitter.get(url,params = params)
    if req.status_code == 200:
        print("Suceed-fetchTwitterTrend: %d" % req.status_code)
    else:
        print("Failed-fetchTwitterTrend: %d" % req.status_code)
    
    return req


def fetchTweetWithKeyword(keyword):
    # OAuth
    twitter = twitterAuth()

    # get-request to twitter api
    url = 'https://api.twitter.com/1.1/search/tweets.json'

    # 取得するツイートの最古時刻を計算
    now = datetime.datetime.now()
    sinceTime = now - datetime.timedelta(seconds=60)    

    query = keyword + ' exclude:retweets' + ' lang:ja' + ' since:' + sinceTime.strftime("%Y-%m-%d_%H:%M:%S_JST")
    params = {
        'count'       : 100,              # 取得するtweet数
        'q'           : query             # 検索クエリ
        # TODO 重複なしで取得するためのリクエストパラメタ設定
        # 'since_id'    :                 # since_idから取得 
    }
    req = twitter.get(url,params = params)

    if req.status_code == 200:
        print("Succeed-fetchTweetWithKeyword")
    else:
        print("Failed-fetchTweetWithKeyword: %d" % req.status_code)

    return req


def fetchTweetWithAccount(accountName):

    # OAuth
    twitter = twitterAuth()

    # get-request to twitter api
    url = 'https://api.twitter.com/1.1/statuses/user_timeline.json'
    params = {
        'count'       : 5,             # 取得するtweet数
        'screen_name' : accountName    # twitterアカウント名
    }
    req = twitter.get(url,params = params)

    if req.status_code == 200:
        print("Succeed-fetchTweetWithAccount")
    else:
        print("Failed-: %d" % req.status_code)
    
    return req


"""
    shape fetched result
"""

def shapeTwitterTrend(trends):
    # TODO DBの型とpythonの型との整合性見直し
    jTrends = json.loads(trends.text)

    '''
        twitter_sysid_tbl
    '''
    rec_twitter_sysid = {}
    # rec_twitter_sysid['sys_id'] = ''
    rec_twitter_sysid['created_at'] = jTrends[0]['created_at']
    rec_twitter_sysid['as_of'] = jTrends[0]['as_of']    
    # rec_twitter_sysid['delete_flag'] = ''

    '''
        twitter_trends_tbl
    '''
    recs_twitter_trends = []
    for trend in jTrends[0]['trends']:
        rec_twitter_trends = {}
        # rec_twitter_trends['sys_id'] = ''
        rec_twitter_trends['tweet_volume'] = trend['tweet_volume']
        rec_twitter_trends['name'] = trend['name']
        rec_twitter_trends['query'] = trend['query']
        # rec_twitter_trends['delete_flag'] = ''
        
        recs_twitter_trends.append(rec_twitter_trends)

    return rec_twitter_sysid, recs_twitter_trends


def shapeTweetWithKeyword(tweets):
    # TODO DBの型とpythonの型との整合性見直し
    jTweets = json.loads(tweets.text)

    '''
        twitter_api_tbl
    '''
    recs_twitter_api = []
    for tweet in jTweets['statuses']:
        rec_twitter_api = {}
        rec_twitter_api['id'] = tweet['id']
        rec_twitter_api['id_str'] = tweet['id_str']
        rec_twitter_api['screen_name'] = tweet['user']['screen_name']
        rec_twitter_api['created_at'] = tweet['created_at']
        # rec_twitter_api['create_time'] = ''
        rec_twitter_api['text'] = tweet['text']
        # rec_twitter_api['trend'] = ''
        rec_twitter_api['user_id'] = tweet['user']['id']
        rec_twitter_api['user_id_str'] = tweet['user']['id_str']
        rec_twitter_api['use_name'] = tweet['user']['name']
        # rec_twitter_api['sys_create_date'] = ''
        # rec_twitter_api['hidden_flag'] = ''
        # rec_twitter_api['delete_flag'] = ''

        recs_twitter_api.append(rec_twitter_api)

    return recs_twitter_api        


"""

    others

"""

def scraping_yomiuri():
    """

    http://www.yomiuri.co.jp/
    :return:スクレイピング結果のリスト

    """

    # url
    url = "http://www.yomiuri.co.jp/"

    # get html
    html = request.urlopen(url)

    # set BueatifulSoup
    soup = BeautifulSoup(html, "html.parser")

    # get headlines
    main_news_index = soup.find_all("h3", attrs={"class", "c-list-title--small"})

    # print headlines
    returnList = []
    for headline in main_news_index:
        returnList.append(headline.find("a").string)

    return returnList


def shapeNews(articleList):
    articleJsonItems = []
    for i,article in enumerate(articleList):
        articleJsonItem = {
                "id": i, 
                "article": article 
        }
        articleJsonItems.append(articleJsonItem)

    jsonData = {
        "status": "OK", 
        "articles": articleJsonItems
    }

    return jsonData


"""
    main
"""

if __name__ == "__main__":
    '''
        開発
    '''
    # --Debug--
    save_twitter()
    app.run(debug=True)
    '''
        本番
    '''
    # port = int(os.getenv("PORT"))
    # app.run(host="0.0.0.0", port=port)

