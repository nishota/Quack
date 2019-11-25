"""TwitterAPIのレスポンスデータのモデルクラスです。

TwitterAPIから取得できるレスポンスデータ(トレンドやツイート)のモデルクラスです。
当モデルクラスは、自身でTwitterAPIからのデータ取得処理を行い、各フィールドに設定します。
"""

from twitter_util import TwitterUtil
import config
import json
import time
import textwrap
import datetime

# 環境情報を設定(開発/本番)
app_config = config.DevelopmentConfig
# app_config = config.ProductionConfig

# Twitter認証オブジェクト
twitter = TwitterUtil(app_config)

class Trends_place_res:
    """TWitterAPI trends/placeエンドポイントレスポンスのモデルクラスです。

    Attributes
    ----------
    raw_response : Response
        TwitterAPIから取得したレスポンス
    trends : list of dict
        TwitterAPIから取得したトレンド情報
    active_trend_full : dict
        TwitterAPIから取得した最も人気のあるトレンド情報(付随情報含む)
    active_trend : str
        TwitterAPIから取得した最も人気のあるトレンド情報

    """

    
    # 除外対象のトレンドを定義するフィールド
    exclusive_trends = [
        '#sindanmaker'
        ]

    def __init__(self):
        """
        コンストラクタ
        """
        self.raw_response = None
        self.trends = []
        self.active_trend_full = {}
        self.active_trend = ''


    def fetch_from_twitter(self):
        """TwitterAPIからtrendを取得してモデルに設定します。

        Returns
        -------
        dict
            TwitterAPIから取得した最も人気のあるトレンド情報
        """
        
        # データ取得
        self.raw_response = twitter.fetch_twitter_trend()

        # 取得データの整形
        json_trends = json.loads(self.raw_response.text)
        self.trends = []
        for json_trend in json_trends[0]['trends']:

            # ハッシュタグでないものを除外
            if not json_trend['name'].startswith('#'):
                continue

            # 除外対象(診断メーカー等)トレンドを除外
            for exclusive_trend in Trends_place_res.exclusive_trends:
                if exclusive_trend.lower() == json_trend['name'].lower():
                    continue

            trend = {}
            trend['tweet_volume'] = json_trend['tweet_volume']
            trend['name'] = json_trend['name']
            trend['query'] = json_trend['query']

            self.trends.append(trend)
        
        # アクティブトレンド設定
        self.active_trend_full = self.trends[0]
        self.active_trend = self.active_trend_full['name']

        return self.active_trend


class Search_tweets_res:
    """TWitterAPI search/tweetsエンドポイントレスポンスのモデルクラスです。

    Attributes
    ----------
    raw_response : Response
        TwitterAPIから取得したレスポンス
    tweets : list of dict
        TwitterAPIから取得したツイート情報
    since_id : str
        TwitterAPIから取得したツイート情報のid最大値
    keyword : str
        TwitterAPI検索に利用した最新のキーワード
    """

    # 特殊文字変換辞書
    char_conversion_dict = {
        '&gt;':'>',
        '&lt;':'<',
        '&amp;':'&',
        '&quot;':'"'
    }

    # 検索結果最大数
    MAX_RESULT_COUNT = 6

    def __init__(self):
        """コンストラクタ
        """
        self.raw_response = None
        self.tweets = []
        self.since_id = ''
        self.keyword = ''

    def fetch_from_twitter(self,keyword):
        """TwitterAPIからtweetを取得してモデルに設定します。

        Attributes
        ----------
        keyword : str
            TwitterAPIへの検索キーワード

        Returns
        -------
        list of dict
            TwitterAPIから取得したツイート情報

        """
        # 最新キーワードの保存
        self.keyword = keyword

        # データ取得
        self.raw_response = twitter.fetch_tweet_with_keyword(keyword,self.since_id)

        # 取得データの整形
        json_tweets = json.loads(self.raw_response.text)
        self.tweets = []
        for json_tweet in json_tweets['statuses']:
            tweet = {}
            tweet['id'] = json_tweet['id']
            tweet['id_str'] = json_tweet['id_str']
            tweet['screen_name'] = json_tweet['user']['screen_name']

            # クライアントが解釈可能な形式に時刻を変換
            time_utc = time.strptime(json_tweet['created_at'], '%a %b %d %H:%M:%S +0000 %Y')
            tweet['created_at'] = time.strftime("%Y-%m-%dT%H:%M:%S+0000", time_utc)

            # 特殊文字変換/ハッシュタグ削除
            for key,value in Search_tweets_res.char_conversion_dict.items():
                text = json_tweet['text'].replace(key, value).replace(keyword, '')

            # 最大文字数60以上を切り捨て
            if len(text) <= 60:
                tweet['text'] = text
            else: 
                tweet['text'] = (text[:59] + '...')

            tweet['trend'] = keyword # 検索キーワード
            tweet['user_id'] = json_tweet['user']['id']
            tweet['user_id_str'] = json_tweet['user']['id_str']
            tweet['use_name'] = json_tweet['user']['name']

            self.tweets.append(tweet)
        
        # ソート(idの降順)
        self.tweets.sort(key=lambda x:x['id'], reverse=True)
        
        # id最大値の保存
        if not len(self.tweets) == 0:
            self.max_id = self.tweets[0]['id_str']

        # 検索結果数最大値を超えている場合は切り捨て
        if len(self.tweets) > Search_tweets_res.MAX_RESULT_COUNT:
            self.tweets = self.tweets[0:Search_tweets_res.MAX_RESULT_COUNT]

        return self.tweets

class Statuses_update_res():
    """TWitterAPI statuses/updateエンドポイントレスポンスのモデルクラスです。

    Attributes
    ----------
    raw_response : Response
        TwitterAPIから取得したレスポンス
    promoted_trend : str
        プロモーションに利用したトレンド
    promoted_time : datetime
        プロモーション時刻
        
    """

    # 同一プロモーション再発行間隔
    SAME_TREND_PROMOTE_INTERVAL = 15 * 60

    def __init__(self):
        """コンストラクタ
        """
        self.raw_response = None
        self.promoted_trend = ''
        self.promoted_time = None
    
    def promote(self,target_trend):
        """TwitterAPIよりプロモーションtweetを発行します。

        Attributes
        ----------
        target_trend : str
            プロモーションtweetに含めるtrend
        
        """
        # トレンド空白チェック
        if not target_trend:
            return

        # 前回トレンドとの比較及び前回プロモーションからの経過時間チェック
        if self.promoted_time:
            td = datetime.datetime.now() - self.promoted_time
            if self.promoted_trend == target_trend and td.seconds < Statuses_update_res.SAME_TREND_PROMOTE_INTERVAL:
                return

        # プロモーションtweetの作成
        promotion = textwrap.dedent('''
            Quackで人気トレンドに関するつぶやきを確認しましょう。
            現在の人気トレンドは「''') \
            + target_trend\
            + textwrap.dedent('''\
            」です。
            リンクはこちら→ http://quack-teal.com''')

        # プロモーションtweetの発行
        self.raw_response = twitter.send_twitter_tweet(promotion)

        # プロモーション情報の更新
        self.promoted_trend = target_trend
        self.promoted_time = datetime.datetime.now()


if __name__ == '__main__':
    trends = Trends_place_res()
    trends.fetch_from_twitter()
    print(trends.active_trend)
    tweets = Search_tweets_res()
    tweets.fetch_from_twitter(trends.active_trend)
    tweets.fetch_from_twitter(trends.active_trend)
    print(tweets.tweets[0])
    promote = Statuses_update_res()
