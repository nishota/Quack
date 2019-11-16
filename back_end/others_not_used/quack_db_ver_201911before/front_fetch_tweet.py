from flask import Flask, request, abort, jsonify, make_response, request as req
from flask_cors import CORS
import json
import db_utils
import config
import os


"""
    app config
"""
app = Flask(__name__)
# CORS(app, resources=r'*')
# CORSのOrigin(リクエスト元)を限定
CORS(app, resources=r'*', origins=['http://localhost:4200','https://quack-teal.com'])
app.config['JSON_AS_ASCII'] = False

# 環境情報読み込み
app_config = config.DevelopmentConfig
# app_config = config.ProductionConfig


"""
    app rooting
"""
@app.route('/')
def output_test():
    return 'success'


@app.route('/json/twitredb/keyword', methods=['GET'])
def output_twitredb_tweet_get():
    # リクエストパラメタ取得
    # max_id = req.args.get('maxid')
    # fetch_count = req.args.get('count')
    # リクエストパラメタの制限を追加
    max_id = req.args.get('maxid') if (req.args.get('maxid') is not None) and req.args.get('maxid').isdecimal() else '' 
    fetch_count = req.args.get('count') if (req.args.get('count') is not None) and req.args.get('count').isdecimal() else ''

    # ツイートDB取得
    recs, latest_trend, latest_max_id = get_twitredb(max_id, fetch_count)

    # json整形
    json_res = {}
    json_res['trend'] = latest_trend
    json_res['maxid'] = str(latest_max_id)
    # 古い順に並び替え
    recs_reversed = [rec for rec in reversed(recs)]
    json_res['tweets'] = recs_reversed 
    return make_response(jsonify(json_res))


def get_twitredb(since_id, fetch_count):
    # トレンド取得
    trend_entity = db_utils.TwitterTrendsTbl.get_first()
    trend_keyword = db_utils.TwitterTrendsTbl.populate_dict([trend_entity])[0]['name']

    # 非削除状態のデータを全件取得
    # 重複防止方式変更
    # ツイート前回以前全論理削除方式から、since_id方式に変更
    # entities = db_utils.TwitterApiTbl.get_all()
    entities = db_utils.TwitterApiTbl.get_latest(since_id, trend_keyword, fetch_count)
    tweets = db_utils.TwitterApiTbl.populate_dict(entities)
    # maxidの設定
    if not entities:
        max_id = since_id
    else:
        # DB取得時にorder by id descを指定しているため、0番目要素のidが最大となる
        max_id = tweets[0]['id']
    
    return(db_utils.TwitterApiTbl.populate_dict(entities) , trend_keyword, max_id)


"""
    main
"""
if __name__ == "__main__":
    if not app_config.PRODUCTION:
        '''
            開発
        '''
        # フロントエンド連携モード
        app.run(debug=True)
    else:
        '''
            本番
        '''
        port = int(os.getenv("PORT"))
        app.run(host="0.0.0.0", port=port)
