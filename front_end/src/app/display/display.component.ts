import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Tweet, TweetData } from '../model/tweet.model';
import { TweetGetterService } from '../tweet-getter.service';
import { Subscription, interval } from 'rxjs';
import * as anime from 'animejs';
import { StateStraight } from '../model/card-state.model';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, AfterViewInit, OnDestroy {

  intervalTweet: Subscription;
  intervalTime = 3000; // ms

  trend: string;
  tweetDatas: TweetData[] = [];
  subscriptions: Subscription[] = [];
  initTweet = new Tweet('', '', '', '');
  isLoading = true;
  state = new StateStraight();
  count = 0;
  displayWidth: string;
  num = -1;

  arr = [];

  constructor(private tg: TweetGetterService) {
    for (let i = 0; i < this.tg.CARD_NUM; i++) {
      this.tweetDatas.push(new TweetData( i, this.initTweet));
    }
  }

  ngOnInit() {
    // tweetを格納
    this.subscriptions.push(
      this.tg.content$.subscribe(
        tweetData => {
          if (!this.tg.isLoading) {
            this.tweetDatas[tweetData.id].tweet = tweetData.tweet;
            this.startAnime(this.tweetDatas[tweetData.id]);
          }
        }
      ));

    // tweetを削除
    this.subscriptions.push(
      this.tg.dismiss$.subscribe(
        tweetData => this.tweetDatas[tweetData.id].tweet = this.initTweet
      ));
    // // フォーカスが戻ったとき
    // this.subscriptions.push(
    //   this.tg.windowForcus$.subscribe(
    //     () => location.reload()
    //   ));
    // // フォーカスが外れたとき
    // this.subscriptions.push(
    //   this.tg.windowBlur$.subscribe(
    //     () => {
    //       if (!this.isLoading) {
    //         this.tg.getTweetSubscription.unsubscribe();
    //       }
    //       this.intervalTweet.unsubscribe();
    //       this.tweetDatas.forEach(td => td.display = 'none');
    //       this.tg.isLoadingSource.next(true);
    //     }
    //   ));
    // ロード画面表示
    this.subscriptions.push(
      this.tg.isLoading$.subscribe(
        value => {
          if (this.isLoading !== value) {
            this.isLoading = value;
          }
          this.tg.isLoading = value;
        }
      ));
    // トレンド取得
    this.subscriptions.push(
      this.tg.trend$.subscribe(
        value => this.trend = value
      ));
  }

  ngAfterViewInit(): void {
    this.intervalTweet = interval(this.intervalTime).subscribe(
      () => {
        this.tg.getTweetData();
      }
    );
    this.tg.Loaded = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      subscription => subscription.unsubscribe()
    );
    this.intervalTweet.unsubscribe();
  }

　/**
  * それぞれのカードのアニメーションを設定する
  * @param data カードのデータ
  */
  startAnime(data: TweetData) {
    if (!this.tg.isLoading) {
      data.display = 'block';
    } else {
      data.display = 'none';
    }
    const width = window.innerWidth * 2;
    let newNum = Math.round(Math.random() * this.tg.indexHeight);
    if (this.num === newNum) {
      newNum++;
    }
    this.num = newNum;
    this.displayWidth = String(window.innerWidth) + 'px';
    this.state.setCoordRightToLeft(width, this.count % this.tg.indexHeight);
    this.count++;
    const animeSetting = {
      targets: '#target' + String(data.id),
      translateX: [this.state.coordBefore.x, this.state.coord.x],
      translateY: [this.state.coordBefore.y, this.state.coord.y],
      easing: 'linear',
      duration: 10 * window.innerWidth,
      delay: newNum * 800,
      complete: () => {
        data.display = 'none';
        this.tg.dismissSource.next(data);
      }
    };
    anime(animeSetting);
  }
}
