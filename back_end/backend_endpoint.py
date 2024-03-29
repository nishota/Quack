"""socketioのエンドポイントを提供します。
    バックグラウンドタスクとして、定期的にTwitterAPIから取得したデータを各クライアントに送信します。
"""

from flask import Flask, render_template, session, request      
from flask_socketio import SocketIO, emit, join_room, leave_room, \
      close_room, rooms, disconnect    
from datetime import datetime, timedelta, timezone
import twitter_model
import logging

# loggerの設定
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.debug('debug')

# Flaskオブジェクトを生成し、セッション情報暗号化のキーを指定
app = Flask(__name__)
app.config['SECRET_KEY'] = 'payloadx2'

# 非同期処理に使用するライブラリの指定
# `threading`, `eventlet`, `gevent`から選択可能
async_mode = None

# nginxのlocation設定と揃えること。
# Flaskのルーティング設定は @app.route(WEBAPP_CONTEXT_ROOT + '/test) のように
# 必ず当定数を付加すること。
WEBAPP_CONTEXT_ROOT = '/backend/quack'

# Flaskオブジェクト、async_modeを指定して、SocketIOサーバオブジェクトを生成
socketio = SocketIO(
    app,
    async_mode=async_mode,
    path=WEBAPP_CONTEXT_ROOT + '/socket.io',
    cors_allowed_origins=['http://localhost:4200','http://quack-teal.com','https://quack-teal.com'],
    pingInterval = 10000,
    pingTimeout = 5000
    )

# スレッドを格納するためのグローバル変数
thread_trend = None
thread_tweet = None
thread_promote = None

# バックグラウンドタスク関連設定値
SCHEDULE_TREND = 7*60 # トレンド検索実行間隔(second)
SCHEDULE_TWEET = 7 # ツイート検索実行間隔(second)
SCHEDULE_PROMOTION = 1*60 # プロモーションツイート用トレンド変更監視間隔(second)

# twitter_modelクラスの初期化
trends = twitter_model.Trends_place_res()
tweets = twitter_model.Search_tweets_res()
promotion_tweet = twitter_model.Statuses_update_res()

@socketio.on('connect')
def connect():
    """Socket通信確立時の処理を行います。
    """
    logger.debug('server connected')
    global thread_trend
    global thread_tweet
    global thread_promote
    if thread_trend is None:
        thread_trend = socketio.start_background_task(target=background_fetch_trend)
    if thread_tweet is None:
        socketio.sleep(5)
        thread_tweet = socketio.start_background_task(target=background_fetch_tweet_and_emit)
    if thread_promote is None:
        thread_promote = socketio.start_background_task(target=background_promotion_tweet)


def background_fetch_trend():
    """バックグラウンドでTrend検索を行います。
    """     
    while True:
        global trends

        try:
            # Trend検索
            trends.fetch_from_twitter()
        except Exception as e:
            logger.error(e)
        else:
            logger.debug('fetched trend')

        socketio.sleep(SCHEDULE_TREND)


def background_fetch_tweet_and_emit():
    """バックグラウンドでTweet検索を行い、結果をクライアントに一斉送信します。
    """     
    while True:
        global trends
        global tweets
        send_data = {}
        send_data['trend'] = trends.active_trend

        try:
            # Tweet検索
            send_data['tweets'] = tweets.fetch_from_twitter(trends.active_trend)
        except Exception as e:
            logger.error(e)
        else:
            logger.debug('fetched tweet')

            # クライアント送信
            socketio.emit('quack-getTweetData', send_data, broadcast=True)

            logging.debug('emitted tweet')

        socketio.sleep(SCHEDULE_TWEET)


def background_promotion_tweet():
    """バックグラウンドでプロモーションTweetを発行します
    """     
    while True:        
        global trends
        global promotion_tweet
        try:
            # Tweet発行
            promotion_tweet.promote(trends.active_trend)
        except Exception as e:
            logger.error(e)
        else:
            logger.debug('promoted quack')

        socketio.sleep(SCHEDULE_PROMOTION)

@socketio.on_error()
def error_handler(e):
    print('An socketio error has occurred: ' + str(e))


# @app.route(WEBAPP_CONTEXT_ROOT + '/test_socket')
# def hello():
#     return 'Hello World!'

# @socketio.on('push')
# def push(send_data):
#     # send_data['time'] = datetime.datetime.now().strftime('%H:%M:%S')
#     send_data['time'] = datetime.now(timezone.utc).isoformat()
#     emit('receive', send_data, broadcast=True, include_self=False)

# @socketio.on('join')
# def push(send_data):
#     emit('join', send_data, broadcast=True, include_self=True)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port='5001')
