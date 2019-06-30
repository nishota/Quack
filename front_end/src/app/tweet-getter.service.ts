import { Injectable } from '@angular/core';
import { Observable, Subject, fromEvent, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Tweet, TweetRes } from './model/tweet.model';

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
  indexHeight = 5;

  count = 0;
  CARD_NUM = 100;

  trendSource = new Subject<string>();
  trend$ = this.trendSource.asObservable();

  isLoading = true;
  Loaded = false;
  isLoadingSource = new Subject<boolean>();
  isLoading$ = this.isLoadingSource.asObservable();

  contentSource = new Subject<{ id: number, tweet: Tweet }>();
  content$ = this.contentSource.asObservable();

  dismissSource = new Subject<{ id: number, tweet: Tweet }>();
  dismiss$ = this.dismissSource.asObservable();

  windowForcus$ = fromEvent(window, 'focus');
  windowBlur$ = fromEvent(window, 'blur');

  getTweetSubscription: Subscription;

  constructor(private http: HttpClient) {
  }

  getTweetData(): void {
    this.getTweetSubscription = this.getTweetFromServer(this.maxId, this.indexHeight).subscribe(
      (res: TweetRes) => {
        this.trendSource.next(res.trend);
        this.maxId = res.maxid;
        if (res.tweets && res.tweets.length > 0) {
          res.tweets.forEach(
            tweet => {
              const day = moment(tweet.created_at);
              const createdTime = new Date(day.utc().format());
              this.contentSource.next({
                id: this.count % this.CARD_NUM,
                tweet: new Tweet(
                  tweet.id_str,
                  tweet.screen_name,
                  this.setDateString(createdTime),
                  tweet.text
                )
              });
              this.count++;
            });
        }
      },
      () => this.isLoadingSource.next(false)
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

  setDateString(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

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
