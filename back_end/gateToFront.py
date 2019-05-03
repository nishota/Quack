# -*- coding: utf-8 -*-
# TODO 機能毎のファイル分け
# TODO フロントエンド-バックエンド連携機能の作成
from flask import Flask, request, abort, jsonify, make_response, request as req
from flask_cors import CORS
from urllib import request
from bs4 import BeautifulSoup
import json
import os
from requests_oauthlib import OAuth1Session
import datetime
import connectToDB as db


"""
    app config
"""

app = Flask(__name__)
CORS(app, resources=r'*')
app.config['JSON_AS_ASCII'] = False

"""
    app rooting
"""

@app.route('/json/twitre/api', methods=['GET'])
def GetTweetText():
    return make_response(jsonify(shapeNews(scraping_yomiuri())))

"""
    others
"""

def scraping_yomiuri():
    """

    http://www.yomiuri.co.jp/
    :return:スクレイピング結果のリスト

    """
    data = db.TwitterApiTbl.getAll()

    # print headlines
    returnList = []
    for item in data:
        print(item.text)
        returnList.append(item.text)

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
    app.run(debug=True)
    '''
        本番
    '''
    # port = int(os.getenv("PORT"))
    # app.run(host="0.0.0.0", port=port)

