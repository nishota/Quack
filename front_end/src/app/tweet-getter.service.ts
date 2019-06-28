import { Injectable } from '@angular/core';
import { Observable, Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';

import { Tweet, TweetRes } from './model/tweet.model';
import { StateStraight } from './model/card-state.model';
import * as anime from 'animejs';

@Injectable({
  providedIn: 'root'
})
export class TweetGetterService {

  /**
   * ツイートIDの最大値
   */
  maxId = '';
  /**
   * 縦に何枚表示するか
   */
  indexHeight = 5;

  count = 0;
  CARD_NUM = 50;

  animeSetting;
  state = new StateStraight();

  trendSource = new Subject<string>();
  trend$ = this.trendSource.asObservable();

  contentSource = new Subject<{ id: number, tweet: Tweet }>();
  content$ = this.contentSource.asObservable();

  dismissSource = new Subject<{ id: number, tweet: Tweet }>();
  dismiss$ = this.dismissSource.asObservable();

  constructor(private http: HttpClient) {
  }

  getTweetData(): void {
    this.getTweetFromServer(this.maxId, this.indexHeight).subscribe(
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
            }
          );
        }
      }
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

  startAnime(data: { id: number, tweet: Tweet, display: string }) {
    const width = window.innerWidth + 900;
    this.indexHeight = Math.round(window.innerHeight / 100);
    this.state.setCoordLikeNico(width, data.id % this.indexHeight);
    this.animeSetting = {
      targets: '#target' + String(data.id),
      translateX: [this.state.coordBefore.x, this.state.coord.x],
      translateY: [this.state.coordBefore.y, this.state.coord.y],
      easing: 'linear',
      duration: 25000,
      delay: (data.id % this.indexHeight) * 800,
      begin: () => data.display = 'block',
      complete: () => {
        data.display = 'none';
        this.dismissSource.next(data);
      }
    };
    anime(this.animeSetting);
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
