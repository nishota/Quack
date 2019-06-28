import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Tweet } from '../model/tweet.model';
import { TweetGetterService } from '../tweet-getter.service';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, AfterViewInit {

  interval;
  tweetDatas: { id: number, tweet: Tweet, display: 'none' }[] = [];
  subscriptions: Subscription[] = [];
  initTweet = new Tweet('', '', '', '');

  windowForcus$ = fromEvent(window, 'focus');
  windowBlur$ = fromEvent(window, 'blur');

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
          this.tweetDatas[tweetData.id].tweet = tweetData.tweet;
          this.tg.startAnime(this.tweetDatas[tweetData.id]);
        }
      )
    );

    // tweetを削除
    this.subscriptions.push(
      this.tg.dismiss$.subscribe(
        tweetData => this.tweetDatas[tweetData.id].tweet = this.initTweet
      )
    );

    this.subscriptions.push(
      this.windowForcus$.subscribe(
        () => {
          this.interval = setInterval(() => this.tg.getTweetData(), 5500);
          console.log('start');
        }
      ));

    this.subscriptions.push(
      this.windowBlur$.subscribe(
        () => {
          clearInterval(this.interval);
          console.log('stop');
        }
      ));
  }

  ngAfterViewInit(): void {
    this.tg.getTweetData();
    this.interval = setInterval(
      () => {
        this.tg.getTweetData();
      }, 5500
    );
  }

}
