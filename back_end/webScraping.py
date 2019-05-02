# -*- coding: utf-8 -*-
from flask import Flask, request, abort, jsonify, make_response, request as req
from flask_cors import CORS
from urllib import request
from bs4 import BeautifulSoup
import json
import os
from requests_oauthlib import OAuth1Session


app = Flask(__name__)
CORS(app, resources=r'*')
app.config['JSON_AS_ASCII'] = False


@app.route('/')
def output_test():
    return scraping_yomiuri()[0]


@app.route('/json/news', methods=['GET'])
def output_jsonNewsGet():
    return make_response(jsonify(createJsonNews(scraping_yomiuri())))


@app.route('/json/news', methods=['POST'])
def output_jsonNewsPost():
    return make_response(jsonify(createJsonNews(scraping_yomiuri())))


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
        keyword = 'ビッグマック'
    print(keyword)
    # memo:フロント側で扱いやすいように、[statuses]のみ返却
    return make_response(jsonify(json.loads(fetchTweetWithKeyword(keyword).text)['statuses']))


@app.route('/json/twitter/keyword', methods=['POST'])
def output_jsonTweetWithKeywordPost():
    # memo:フロント側で扱いやすいように、[statuses]のみ返却
    return make_response(jsonify(json.loads(fetchTweetWithKeyword('ビッグマック').text)['statuses']))


def createJsonNews(articleList):
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


def scraping_yomiuri():
    """

    https://qiita.com/U-MA/items/896c49d46585e32ff7b1
    Beautiful Soup での スクレイピング基礎まとめ [初学者向け]
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

def twitterAuth():
    # OAuth
    # 開発
    TWITTER_API_KEY = ''
    TWITTER_API_SECRET_KEY = ''
    TWITTER_ACCESS_TOKEN = ''
    TWITTER_ACCESS_TOKEN_SECRET = ''
    # 本番
    # TWITTER_API_KEY = os.environ["TWITTER_API_KEY"]
    # TWITTER_API_SECRET_KEY = os.environ["TWITTER_API_SECRET_KEY"]
    # TWITTER_ACCESS_TOKEN = os.environ["TWITTER_ACCESS_TOKEN"]
    # TWITTER_ACCESS_TOKEN_SECRET = os.environ["TWITTER_ACCESS_TOKEN_SECRET"]
    twitter = OAuth1Session(TWITTER_API_KEY, TWITTER_API_SECRET_KEY, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET)
    return twitter


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
        res = json.loads(req.text)
        for tweet in res:
            print(tweet['user']['name']+'::'+tweet['text'])
            print(tweet['created_at'])
            print('*******************************************')
    else:
        print("Failed: %d" % req.status_code)
    
    return req

def fetchTweetWithKeyword(keyword):

    # OAuth
    twitter = twitterAuth()

    # get-request to twitter api
    url = 'https://api.twitter.com/1.1/search/tweets.json'
    params = {
        'count'       : 5,             # 取得するtweet数
        'q'           : keyword        # 検索クエリ
    }
    req = twitter.get(url,params = params)

    if req.status_code == 200:
        res = json.loads(req.text)
        for tweet in res['statuses']:
            print(tweet['user']['name']+'::'+tweet['text'])
            print(tweet['created_at'])
            print('*******************************************')
    else:
        print("Failed: %d" % req.status_code)
    
    return req


if __name__ == "__main__":
    # 開発
    app.run(debug=True)
    # 本番
    # port = int(os.getenv("PORT"))
    # app.run(host="0.0.0.0", port=port)

