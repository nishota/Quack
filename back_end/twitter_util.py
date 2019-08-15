import json
import os
import datetime
from requests_oauthlib import OAuth1Session as OAuth
from payload_pack_01 import p_debug_01

class TwitterUtil:
    """
    Twitter関連の処理

    Attributes
    ----------
    auth : OAuth1Session
        Twitter認証情報
    """
    def __init__( self, app_config) :
        """
        twitter apiの認証を行う
        
        Parameters
        ----------
        app_config: DevelopmentConfig or ProductionConfig
            開発モード、本番モードを切り分ける
        Returns
        ----------
        auth :
            認証済みのtwitter apiオブジェクト
        """
        # OAuth
        if not app_config.PRODUCTION:
            '''
                開発
            '''
            KEY_PATH = os.path.dirname(os.path.abspath(__file__))+'/key.json'
            with open(KEY_PATH) as f:
                df = json.load(f)
                TWITTER_API_KEY = df['twitrekey']['TWITTER_API_KEY']
                TWITTER_API_SECRET_KEY = df['twitrekey']['TWITTER_API_SECRET_KEY']
                TWITTER_ACCESS_TOKEN = df['twitrekey']['TWITTER_ACCESS_TOKEN']
                TWITTER_ACCESS_TOKEN_SECRET = df['twitrekey']['TWITTER_ACCESS_TOKEN_SECRET']
        else:
            '''
                本番
            '''
            TWITTER_API_KEY = os.environ["TWITTER_API_KEY"]
            TWITTER_API_SECRET_KEY = os.environ["TWITTER_API_SECRET_KEY"]
            TWITTER_ACCESS_TOKEN = os.environ["TWITTER_ACCESS_TOKEN"]
            TWITTER_ACCESS_TOKEN_SECRET = os.environ["TWITTER_ACCESS_TOKEN_SECRET"]
            
        self.auth = OAuth(TWITTER_API_KEY, TWITTER_API_SECRET_KEY, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET)

    """
    fetch from twitter API
    """
    @p_debug_01.stop_watch
    def fetch_twitter_trend(self):
        """twitter api(trends/place)を用いてトレンドワードを取得する
        
        Parameters
        ----------

        Returns
        -------
        res :
            twitter api(trends/place)からのレスポンスオブジェクト
        """

        # get-request to twitter api
        url = 'https://api.twitter.com/1.1/trends/place.json'
        params = {             
            'id' : 23424856    # WOEID (Japan)
        }
        return self.get_res(url,params) 

    @p_debug_01.stop_watch
    def fetch_tweet_with_keyword(self,keyword, since_id):
        """twitter api(search/tweets)を用いてツイートをキーワード検索する
        
        Parameters
        ----------
        keyword:
            検索キーワード
        since_id:
            id
        Returns
        -------
        res :
            twitter api(search/tweets)からのレスポンスオブジェクト
        """
        # get-request to twitter api
        url = 'https://api.twitter.com/1.1/search/tweets.json'

        # 取得するツイートの最古時刻を計算
        now = datetime.datetime.utcnow()
        sinceTime = now - datetime.timedelta(seconds=60)
        query = keyword + ' exclude:retweets' + ' exclude:replies' + ' lang:ja' + ' since:' + sinceTime.strftime("%Y-%m-%d_%H:%M:%S_UTC")
        params = {
            'count'       : 100,              # 取得するtweet数
            'q'           : query,             # 検索クエリ
            'since_id'    : since_id,        # since_idから取得 
            'result_type' : 'recent',
            #'tweet_mode'  : 'extended'
        }
        return self.get_res(url,params)

    def get_res(self, url, params):
        """twitterのgetメソッドラッパー

        Parameters
        ----------
        url : string
            twitter APIのURL
        param :
            リクエストパラメタ

        Returns
        -------
        res :
            レスポンスオブジェクト
        """
        res = self.auth.get(url,params = params)
        if res.status_code == 200:
            print("Suceed: %d" % res.status_code)
        else:
            print("Failed: %d" % res.status_code)
        return res