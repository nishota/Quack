// 参考サイト: https://qiita.com/cilly/items/833bc20784b0a7d56d03
// npm install socket.io-client --save
// npm install @types/socket.io-client --save-dev

import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject, throwError, timer } from 'rxjs';
import { retry, retryWhen, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WindowStateService } from './window-state.service';
import { TweetRes, TweetData, Tweet } from './model/tweet.model';
import { ConnectionMode } from './model/connection-mode.model';
import { HttpClient } from '@angular/common/http';
import { DateTime } from './util/datetime.util';

import * as io from 'socket.io-client';

@Injectable()
export class WebSocketService {
  private url = environment.socketUrl;
  private socket;

  contentSource = new Subject<TweetData>();
  content$ = this.contentSource.asObservable();

  trendSource = new Subject<string>();
  trend$ = this.trendSource.asObservable();

  count = 0;
  getTweetSubscription: Subscription;

  constructor(private http: HttpClient, private state: WindowStateService) {
    this.connect('conect=QuackQuack');
  }

  // TODO: rxjsで全て記述したい
  private connect(queryString: string) {
    this.socket = io(this.url, { query: queryString });
  }

  private emit(emitName: string, data?: any) {
    this.socket.emit(emitName, data);
  }

  private on(onName: string): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on(onName, (data) => {
        observer.next(data);
      });
      this.socket.on('connect_error', (err) => {
        const errMsg = 'Connection Error...';
        observer.error(errMsg);
      });
      this.socket.on('connect_timeout', (err) => {
        const errMsg = 'Connection Timeout...';
        observer.error(errMsg);
      });
    });
    return observable;
  }

  disconnect() {
    this.emit(ConnectionMode.Disconnect);
  }

  /**
   * ツイート取得処理
   */
  getTweetData(): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./web-worker/tweet.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        const tweetData = new TweetData(
          this.count % this.state.CARD_NUM,
          Tweet.Clone(data)
        );
        this.count++;
        this.contentSource.next(tweetData);
      };
      worker.onerror = ({ error }) => {
        console.error(error.message);
      };

      this.state.indexHeight = Math.round(window.innerHeight / this.state.cardMaxHeight);
      this.getTweetSubscription = this.getTweetFromSocketIO().subscribe(
        (res: TweetRes) => {
          this.state.indexHeight = Math.round(window.innerHeight / this.state.cardMaxHeight);
          this.trendSource.next(res.trend);
          if (res.tweets && res.tweets.length > 0) {
            res.tweets.forEach((tweet) => {
              worker.postMessage(tweet);
            });
            this.state.isLoadingSource.next({ flag: false, message: '' });
          }
        },
        (err) => {
          this.state.isLoadingSource.next({ flag: true, message: 'Please access later...' });
          this.socket.close();
        });
    } else {
      // TODO Web Workerが未サポートの場合
      // TODO とりあえず従来のコードをコピーしている
      // この環境では Web Worker はサポートされていません。
      // プログラムが引き続き正しく実行されるように、フォールバックを追加する必要があります。
      console.warn('web-worker undifined');
      this.state.indexHeight = Math.round(window.innerHeight / this.state.cardMaxHeight);
      this.getTweetSubscription = this.getTweetFromSocketIO().subscribe(
        (res: TweetRes) => {
          this.state.indexHeight = Math.round(window.innerHeight / this.state.cardMaxHeight);
          this.trendSource.next(res.trend);
          if (res.tweets && res.tweets.length > 0) {
            res.tweets.forEach(
              (tweet) => {
                this.contentSource.next(
                  new TweetData(
                    this.count % this.state.CARD_NUM,
                    new Tweet(
                      tweet.id_str,
                      tweet.screen_name,
                      DateTime.setDateString(tweet.created_at),
                      tweet.text)
                  ));
                this.count++;
              });
            this.state.isLoadingSource.next({ flag: false, message: '' });
          }
        },
        (err) => {
          this.state.isLoadingSource.next({ flag: true, message: 'Please access later...' });
          this.socket.close();
        });
    }
  }

  /**
   * TODO: サーバにツイートを取りに行く。
   * maxidなどは一旦廃止
   */
  getTweetFromSocketIO(): Observable<TweetRes> {
    const sec = 1000;
    const retryCount = 5;
    return this.on(ConnectionMode.ClientGetData).pipe(
      retryWhen((errors) => {
        return errors.pipe(
          mergeMap((e, index) => {
            this.state.isLoadingSource.next({ flag: true, message: e });
            if (index > retryCount) {
              return throwError(e);
            }
            return timer((index + 1) * sec);
          })
        );
      })
    );
  }
  /**
   * アセットをフロント側を配置しているサーバから取りに行く。
   */
  getInfoFromAsset(): Observable<any> {
    return this.http.get<any[]>(environment.infoUrl);
  }
}
