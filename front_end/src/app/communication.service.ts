// 参考サイト: https://qiita.com/cilly/items/833bc20784b0a7d56d03
// npm install socket.io-client --save
// npm install @types/socket.io-client --save-dev

import { Injectable } from '@angular/core';
import { Observable, Subscription, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WindowStateService } from './window-state.service';
import { TweetRes, TweetData } from './model/tweet.model';
import { ConnectionMode, Count, Message} from '../environments/const.environment';
import { DateTime } from './util/datetime.util';

import { Socket } from './util/socket-io.util';

@Injectable()
export class CommunicationService {
  count = 0;
  getTweetSubscription: Subscription;

  constructor(private state: WindowStateService) {
  }

  /**
   * ツイート取得処理
   */
  getTweetData(): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./web-worker/tweet.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        this.state.contentSource.next(data as TweetData[]);
      };
      worker.onerror = () => {
        console.error('web worker error');
      };
      Socket.connect('');
      this.getTweetSubscription = this.getTweetFromSocketIO().subscribe(
        (res: TweetRes) => {
          this.state.trendSource.next(res.trend);
          if (res.tweets && res.tweets.length > 0) {
            worker.postMessage(res.tweets);
            this.state.isLoadingSource.next({ flag: false, message: Message.empty });
          }
        },
        () => {
          this.state.isLoadingSource.next({flag: true, message: Message.connectionFailed});
          Socket.Connection.close();
        });
    } else {
      // TODO Web Workerが未サポートの場合
      // TODO とりあえず従来のコードをコピーしている
      // この環境では Web Worker はサポートされていません。
      // プログラムが引き続き正しく実行されるように、フォールバックを追加する必要があります。
      console.warn('web-worker undifined');
      Socket.connect('');
      this.getTweetSubscription = this.getTweetFromSocketIO().subscribe(
        (res: TweetRes) => {
          this.state.trendSource.next(res.trend);
          if (res.tweets && res.tweets.length > 0) {
            const tweetDatas: TweetData[] = [];
            res.tweets.forEach(
              (tweet) => {
                const tweetData = new TweetData(
                  this.count % Count.Card,
                  tweet.text,
                  tweet.screen_name,
                  environment.twitterUrl + tweet.screen_name,
                  DateTime.setDateString(tweet.created_at),
                  0,
                  false,
                  true,
                  0);
                tweetDatas.push(tweetData);
                this.count++;
              });
            this.state.contentSource.next(tweetDatas);
            this.state.isLoadingSource.next({ flag: false, message: Message.empty });
          }
        },
        () => {
          this.state.isLoadingSource.next({ flag: true, message: Message.connectionFailed });
          Socket.Connection.close();
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
    const obs = Socket.on(ConnectionMode.ClientGetData);
    return obs.pipe(
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
}
