from flask import Flask, request, abort, jsonify, make_response, request as req
from flask_cors import CORS
from urllib import request
from bs4 import BeautifulSoup
import json
import os
from requests_oauthlib import OAuth1Session
import datetime
import time
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
def output_news_get():
    return make_response(jsonify(shape_news(scraping_yomiuri())))


@app.route('/json/news', methods=['POST'])
def output_news_post():
    return make_response(jsonify(shape_news(scraping_yomiuri())))


@app.route('/json/twitter/account', methods=['GET'])
def output_tweet_with_account_get():
    account = req.args.get('account')
    if account is None:
        account = 'McDonaldsJapan'
    print(account)
    return make_response(jsonify(json.loads(fetch_tweet_with_account(account).text)))


@app.route('/json/twitter/account', methods=['POST'])
def output_tweet_with_account_post():
    return make_response(jsonify(json.loads(fetch_tweet_with_account('McDonaldsJapan').text)))


@app.route('/json/twitter/keyword', methods=['GET'])
def output_tweet_with_keyword_get():
    print(req)
    keyword = req.args.get('keyword')
    if keyword is None:
        keyword = '令和'
    print(keyword)
    return make_response(jsonify(json.loads(fetch_tweet_with_keyword(keyword).text)['statuses']))


@app.route('/json/twitter/keyword', methods=['POST'])
def output_tweet_with_keyword_post():
    return make_response(jsonify(json.loads(fetch_tweet_with_keyword('ビッグマック').text)['statuses']))


@app.route('/json/twitter/trend', methods=['GET'])
def output_twitter_trend_Get():
    return make_response(jsonify(json.loads(fetch_twitter_trend().text)))


@app.route('/json/twitter/trend', methods=['POST'])
def output__twitter_trend_post():
    return make_response(jsonify(json.loads(fetch_twitter_trend().text)))


"""
    Auth to twitter API
"""

def twitter_auth():
    """
    twitter apiの認証を行う
    
    Parameters
    ----------

    Returns
    ----------
    twitter :
        認証済みのtwitter apiオブジェクト
    """
    # OAuth
    # TODO 認証キーの設定ファイル化の検討
    # TODO require to rewrite
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
def fetch_twitter_trend():
    """
    twitter api(trends/place)を用いてトレンドワードを取得する
    
    Parameters
    ----------

    Returns
    -------
    res :
        twitter api(trends/place)からのレスポンスオブジェクト
    """
    # OAuth
    twitter = twitter_auth()

    # get-request to twitter api
    url = 'https://api.twitter.com/1.1/trends/place.json'
    params = {             
        'id' : 1118550    # WOEID (Yokohama)
    }
    res = twitter.get(url,params = params)
    if res.status_code == 200:
        print("Suceed-fetchTwitterTrend: %d" % res.status_code)
    else:
        print("Failed-fetchTwitterTrend: %d" % res.status_code)
    
    return res


def fetch_tweet_with_keyword(keyword):
    """
    twitter api(search/tweets)を用いてツイートをキーワード検索する
    
    Parameters
    ----------
    keyword:
        検索キーワード

    Returns
    -------
    res :
        twitter api(search/tweets)からのレスポンスオブジェクト
    """
    # OAuth
    twitter = twitter_auth()

    # get-request to twitter api
    url = 'https://api.twitter.com/1.1/search/tweets.json'  

    # 取得するツイートの最古時刻を計算
    now = datetime.datetime.now()
    sinceTime = now - datetime.timedelta(seconds=300)    

    query = keyword + ' exclude:retweets' + ' lang:ja' + ' since:' + sinceTime.strftime("%Y-%m-%d_%H:%M:%S_JST")
    params = {
        'count'       : 100,              # 取得するtweet数
        'q'           : query 
    }
    res = twitter.get(url,params = params)

    if res.status_code == 200:
        print("Succeed-fetchTweetWithKeyword")
    else:
        print("Failed-fetchTweetWithKeyword: %d" % res.status_code)

    return res


def fetch_tweet_with_account(accountName):
    """
    twitter apistatuses/user_timelineを用いて特定アカウントのツイートを取得する
    
    Parameters
    ----------
    accountName:
        twitterアカウント名

    Returns
    -------
    res :
        twitter api(statuses/user_timeline)からのレスポンスオブジェクト
    """

    # OAuth
    twitter = twitter_auth()

    # get-request to twitter api
    url = 'https://api.twitter.com/1.1/statuses/user_timeline.json'
    params = {
        'count'       : 5,             # 取得するtweet数
        'screen_name' : accountName    # twitterアカウント名
    }
    res = twitter.get(url,params = params)

    if res.status_code == 200:
        print("Succeed-fetchTweetWithAccount")
    else:
        print("Failed-: %d" % res.status_code)
    
    return res


"""

    scraping

"""

def scraping_yomiuri():
    """
    http://www.yomiuri.co.jp/ からニュース見出しを取得する
    
    Parameters
    ----------

    Returns
    -------
    returnList:
        ニュース見出しのリスト
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


def shape_news(article_list):
    """
    http://www.yomiuri.co.jp/ から取得したニュース見出しを
    json形式に整形する
    
    Parameters
    ----------

    Returns
    -------
    returnList:
        ニュース見出しのリスト
    """
    json_articles = []
    for i,article in enumerate(article_list):
        json_article = {
                "id": i, 
                "article": article 
        }
        json_articles.append(json_article)

    json_data = {
        "status": "OK", 
        "articles": json_articles
    }

    return json_data


"""
    main
"""

if __name__ == "__main__":
    # TODO require to rewrite
    '''
        開発
    '''
    app.run(debug=True)

    '''
        本番
    '''
    # port = int(os.getenv("PORT"))
    # app.run(host="0.0.0.0", port=port)

