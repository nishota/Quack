from flask import Flask, request, abort, jsonify, make_response, request as req
from flask_cors import CORS
import json
import db_utils


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
    return 'success'


@app.route('/json/twitredb/keyword', methods=['GET'])
def output_twitredb_tweet_get():
    recs = get_twitredb()
    return make_response(jsonify(recs))


def get_twitredb():
    # 非削除状態のデータを全件取得
    entities = db_utils.TwitterApiTbl.get_all()
    return(db_utils.TwitterApiTbl.populate_dict(entities))


"""
    main
"""
if __name__ == "__main__":
    # TODO require to rewrite
    '''
        開発
    '''
    # フロントエンド連携モード
    app.run(debug=True)

    '''
        本番
    '''
    # port = int(os.getenv("PORT"))
    # app.run(host="0.0.0.0", port=port)
