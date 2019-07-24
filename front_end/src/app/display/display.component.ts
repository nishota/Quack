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
  intervalTime = 2500; // ms

  trend: string;
  tweetDatas: { id: number, tweet: Tweet, display: 'none' }[] = [];
  // adData = { id: 20, ad: null, display: 'none' };
  subscriptions: Subscription[] = [];
  initTweet = new Tweet('', '', '', '');
  isLoading = true;
  state = new StateStraight();
  count = 0;

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
        () => {
          this.tweetDatas.forEach(td => td.display = 'none');
          this.tg.isLoadingSource.next({ state: false, loaded: true });
          this.intervalTweet = interval(this.intervalTime).subscribe(
            () => {
              this.tg.getTweetData();
            }
          );
        }
      ));
    this.subscriptions.push(
      this.tg.windowBlur$.subscribe(
        () => {
          this.intervalTweet.unsubscribe();
          if (this.tg.getTweetSubscription) {
            this.tg.getTweetSubscription.unsubscribe();
          }
          this.tweetDatas.forEach(td => td.display = 'none');
          this.tg.isLoadingSource.next({ state: true, loaded: true });
        }
      ));
    this.subscriptions.push(
      this.tg.isLoading$.subscribe(
        value => {
          if (this.isLoading !== value.state) {
            this.isLoading = value.state;
          }
          this.tg.isLoading = value.state;
          this.tg.Loaded = value.loaded;
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
        this.tg.isLoadingSource.next({ state: false, loaded: true });
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
    this.tg.indexHeight = Math.round(window.innerHeight / 100) - 1;
    if (this.tg.indexHeight !== this.arr.length) {
      this.arr = [];
      for (let index = 0; index < this.tg.indexHeight; index++) {
        this.arr.push(Math.round(Math.random() * this.tg.indexHeight));
      }
    }
    this.state.setCoordLikeNico(width, this.count % this.tg.indexHeight);
    this.count++;
    const animeSetting = {
      targets: '#target' + String(data.id),
      translateX: [this.state.coordBefore.x, this.state.coord.x],
      translateY: [this.state.coordBefore.y, this.state.coord.y],
      easing: 'linear',
      duration: 15000,
      delay: this.arr[data.id % this.tg.indexHeight] * 800,
      complete: () => {
        data.display = 'none';
        this.tg.dismissSource.next(data);
      }
    };
    anime(animeSetting);
  }
}
