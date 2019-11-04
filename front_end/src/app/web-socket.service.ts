// 参考サイト: https://qiita.com/cilly/items/833bc20784b0a7d56d03
// npm install socket.io-client --save
// npm install @types/socket.io-client --save-dev

import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WindowStateService } from './window-state.service';
import { TweetRes, TweetData, Tweet } from './model/tweet.model';
import { ConnectionMode } from './model/connection-mode.model';
import { HttpClient } from '@angular/common/http';

import * as io from 'socket.io-client';
import * as moment from 'moment';

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
    this.state.indexHeight = Math.round(window.innerHeight / this.state.cardMaxHeight);
    this.getTweetSubscription = this.getTweetFromSocketIO().subscribe(
      (res: TweetRes) => {
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
    return this.on(ConnectionMode.ClientGetData);
  }
  /**
   * アセットをフロント側を配置しているサーバから取りに行く。
   */
  getInfoFromAsset(): Observable<any> {
    return this.http.get<any[]>(environment.infoUrl);
  }

  /**
   * 日時をブラウザが認識しているタイムゾーンの時間に変更する。
   * @param createdAt 日時(サーバからの生データ)
   */
  setDateString(createdAt: string): string {
    const date = moment(createdAt);
    const createdTime = new Date(date.utc().format());
    const year = createdTime.getFullYear();
    const month = createdTime.getMonth() + 1;
    const day = createdTime.getDate();
    const hours = createdTime.getHours();
    const min = createdTime.getMinutes();
    const sec = createdTime.getSeconds();

    let stMonth = String(month);
    let stDay = String(day);
    let stHours = String(hours);
    let stMin = String(min);
    let stSec = String(sec);

    if (month < 10) {
      stMonth = '0' + stMonth;
    }
    if (day < 10) {
      stDay = '0' + stDay;
    }
    if (hours < 10) {
      stHours = '0' + stHours;
    }
    if (min < 10) {
      stMin = '0' + stMin;
    }
    if (sec < 10) {
      stSec = '0' + stSec;
    }
    return year + '/' + stMonth + '/' + stDay + ' ' + stHours + ':' + stMin + ':' + stSec;
  }
}
