// 参考サイト: https://qiita.com/cilly/items/833bc20784b0a7d56d03
// npm install socket.io-client --save
// npm install @types/socket.io-client --save-dev

import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WindowStateService } from './window-state.service';
import { TweetRes, TweetData, Tweet } from './model/tweet.model';
import { ConectionMode } from './model/conection-mode.model';
import { HttpClient } from '@angular/common/http';

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

  connect(queryString: string) {
    console.log(this.url);
    this.socket = io(this.url, { query: queryString });
  }

  emit(emitName: string, data?: any) {
    this.socket.emit(emitName, data);
  }

  on(onName: string): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on(onName, (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  /**
   * ツイート取得処理
   */
  getTweetData(): void {
    this.state.indexHeight = Math.round(window.innerHeight / this.state.cardMaxHeight);
    this.getTweetSubscription = this.getTweetFromSocketIO().subscribe(
      (res: TweetRes) => {
        console.log('受け取りました');
        this.state.indexHeight = Math.round(window.innerHeight / this.state.cardMaxHeight);
        if (res.trend !== '') {
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
                      this.setDateString(tweet.created_at),
                      tweet.text)
                  ));
                this.count++;
              });
          }
          this.state.isLoadingSource.next(false);
        } else {
          this.state.isLoadingSource.next(true);
        }
      },
      () => this.state.isLoadingSource.next(true)
    );
  }

  /**
   * TODO: サーバにツイートを取りに行く。
   * maxidなどは一旦廃止
   */
  getTweetFromSocketIO(): Observable<TweetRes> {
    return this.on(ConectionMode.ClientGetData);
  }
  /**
   * アセットをフロント側を配置しているサーバから取りに行く。
   */
  getInfoFromAsset(): Observable<any> {
    return this.http.get<any[]>(environment.infoUrl);
  }

  /**
   * TODO: 日時をブラウザが認識しているタイムゾーンの時間に変更する。
   * @param createdAt 日時(サーバからの生データ)
   */
  setDateString(createdAt: string): string {
    return 'hogehoge';
  }

}
