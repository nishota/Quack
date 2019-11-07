import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Tweet, TweetData } from '../model/tweet.model';
import { Subscription, interval } from 'rxjs';
import * as anime from 'animejs';
import { StateStraight } from '../model/card-state.model';
import { WindowStateService } from '../window-state.service';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, AfterViewInit, OnDestroy {

  trend: string;
  tweetDatas: TweetData[] = [];
  subscriptions: Subscription[] = [];
  initTweet = new Tweet('', '', '', '');
  isLoading = true;
  state = new StateStraight();
  count = 0;
  displayWidth: string;
  num = -1;
  message = 'Loading Now!';

  arr = [];

  constructor(private tg: WebSocketService, private ws: WindowStateService) {
    for (let i = 0; i < this.ws.CARD_NUM; i++) {
      this.tweetDatas.push(new TweetData(i, this.initTweet));
    }
  }

  ngOnInit() {
    // tweetを格納
    this.subscriptions.push(
      this.tg.content$.subscribe(
        tweetData => {
          if (!this.isLoading) {
            this.tweetDatas[tweetData.id].tweet = tweetData.tweet;
            this.startAnime(this.tweetDatas[tweetData.id]);
          }
        }
      ));

    // tweetを削除
    this.subscriptions.push(
      this.ws.dismiss$.subscribe(
        tweetData => this.tweetDatas[tweetData.id].tweet = this.initTweet
      ));
    // ロード画面表示
    this.subscriptions.push(
      this.ws.isLoading$.subscribe(
        value => {
          this.message = value.message;
          if (this.isLoading !== value.flag) {
            this.isLoading = value.flag;
          }
        }
      ));
    // トレンド取得
    this.subscriptions.push(
      this.tg.trend$.subscribe(
        value => this.trend = value
      ));
  }

  ngAfterViewInit(): void {
    this.tg.getTweetData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      subscription => subscription.unsubscribe()
    );
  }

  /**
   * それぞれのカードのアニメーションを設定する
   * @param data カードのデータ
   */
  startAnime(data: TweetData) {
    if (!this.isLoading) {
      data.display = 'block';
    } else {
      data.display = 'none';
    }
    const width = window.innerWidth * 2;
    let newNum = Math.round(Math.random() * this.ws.indexHeight);
    if (this.num === newNum) {
      newNum++;
    }
    this.num = newNum;
    this.displayWidth = String(window.innerWidth) + 'px';
    this.count++;
    const animeSetting = {
      targets: '#target' + String(data.id),
      translateX: -(window.innerWidth + 332),
      easing: 'linear',
      duration: 10 * window.innerWidth,
      delay: newNum * 800,
      complete: () => {
        data.display = 'none';
        this.ws.dismissSource.next(data);
      }
    };
    anime(animeSetting);
  }
}
