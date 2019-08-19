import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Tweet } from '../model/tweet.model';
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
  intervalAnime: Subscription;
  intervalTime = 3000; // ms

  trend: string;
  tweetDatas: { id: number, tweet: Tweet, display: 'none' }[] = [];
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
      this.tweetDatas.push({ id: i, tweet: this.initTweet, display: 'none' });
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

    this.subscriptions.push(
      this.tg.windowForcus$.subscribe(
        () => location.reload()
      ));
    this.subscriptions.push(
      this.tg.windowBlur$.subscribe(
        () => {
          if (!this.isLoading) {
            this.tg.getTweetSubscription.unsubscribe();
          }
          this.intervalTweet.unsubscribe();
          this.tweetDatas.forEach(td => td.display = 'none');
          this.tg.isLoadingSource.next(true);
        }
      ));
    this.subscriptions.push(
      this.tg.isLoading$.subscribe(
        value => {
          if (this.isLoading !== value) {
            this.isLoading = value;
          }
          this.tg.isLoading = value;
        }
      ));
    this.subscriptions.push(
      this.tg.trend$.subscribe(
        value => this.trend = value
      ));
  }

  ngAfterViewInit(): void {
    this.intervalTweet = interval(this.intervalTime).subscribe(
      () => {
        this.tg.getTweetData();
        this.tg.isLoadingSource.next(false);
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

  startAnime(data: { id: number, tweet: Tweet, display: string }) {
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
    this.tg.indexHeight = Math.round(window.innerHeight / 100) - 1;
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
