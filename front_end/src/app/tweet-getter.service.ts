import { Injectable } from '@angular/core';
import { Observable, Subject, fromEvent, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Tweet, TweetRes, TweetData } from './model/tweet.model';

import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class TweetGetterService {

  /**
   * ツイートIDの最大値
   */
  maxId = '';
  maxIdNum: number;
  /**
   * 縦に何枚表示するか
   */
  indexHeight: number;
  /**
   * カード内のテキストが3行のときの高さ
   */
  cardMaxHeight = 112;

  count = 0;

  /**
   * 全カード枚数
   */
  CARD_NUM = 30;

  trendSource = new Subject<string>();
  trend$ = this.trendSource.asObservable();

  /**
   * ロード中かどうか
   */
  isLoading = true;
  /**
   * 初回ロードが終了したか
   */
  Loaded = false;
  isLoadingSource = new Subject<boolean>();
  isLoading$ = this.isLoadingSource.asObservable();

  contentSource = new Subject<TweetData>();
  content$ = this.contentSource.asObservable();

  dismissSource = new Subject<TweetData>();
  dismiss$ = this.dismissSource.asObservable();

  // windowForcus$ = fromEvent(window, 'focus');
  // windowBlur$ = fromEvent(window, 'blur');
  windowResize$ = fromEvent(window, 'resize');

  getTweetSubscription: Subscription;

  constructor(private http: HttpClient) {
  }

  /**
   * ツイート取得処理
   */
  getTweetData(): void {
    this.indexHeight = Math.round(window.innerHeight / this.cardMaxHeight);
    this.getTweetSubscription = this.getTweetFromServer(this.maxId, this.indexHeight).subscribe(
      (res: TweetRes) => {
        this.indexHeight = Math.round(window.innerHeight / this.cardMaxHeight);
        if (res.trend !== '') {
          this.trendSource.next(res.trend);
          this.maxId = res.maxid;
          if (res.tweets && res.tweets.length > 0) {
            res.tweets.forEach(
              (tweet) => {
                this.contentSource.next(
                  new TweetData(
                    this.count % this.CARD_NUM,
                    new Tweet(
                      tweet.id_str,
                      tweet.screen_name,
                      this.setDateString(tweet.created_at),
                      tweet.text)
                  ));
                this.count++;
              });
          }
          this.isLoadingSource.next(false);
        } else {
          this.isLoadingSource.next(true);
        }
      },
      () => this.isLoadingSource.next(true)
    );
  }

  /**
   * サーバにツイートを取りに行く。
   * @param maxId フロント側で持っているツイートの最大値
   * @param indexHeight 縦方向の枚数
   */
  getTweetFromServer(maxId: string, indexHeight: number): Observable<any> {
    const reqMaxId = maxId ? maxId : '';
    const options = { params: new HttpParams().set('maxid', reqMaxId).set('count', String(indexHeight)) };
    return this.http.get<any[]>(environment.devUrl, options);
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
