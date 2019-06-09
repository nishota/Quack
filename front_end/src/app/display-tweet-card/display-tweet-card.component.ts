import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TweetGeneratorService } from '../tweet-generator.service';
import { Subscription, fromEvent } from 'rxjs';
import { Tweet } from '../model/tweet.model';

@Component({
  selector: 'app-display-tweet-card',
  templateUrl: './display-tweet-card.component.html',
  styleUrls: ['./display-tweet-card.component.css']
})
export class DisplayTweetCardComponent implements OnInit, AfterViewInit, OnDestroy {
  tweets: Tweet[] = [];

  subscriptions: Subscription[] = [];

  interval;

  windowForcus$ = fromEvent(window, 'focus');
  windowBlur$ = fromEvent(window, 'blur');

  constructor(private tg: TweetGeneratorService) { }

  ngOnInit() {
    // tweetを格納
    this.subscriptions.push(
      this.tg.content$.subscribe(
        tweet => {
          if (this.tweets.length < 30) {
            this.tweets.push(tweet);
          }
        }
      )
    );

    // tweetを削除
    this.subscriptions.push(
      this.tg.dismiss$.subscribe(
        value => {
          const index = this.tweets.findIndex(
            tw => tw === value
          );
          if (index >= 0) {
            this.tweets.splice(index, 1);
          }
        }
      )
    );
  }

  ngAfterViewInit(): void {
    this.tg.getTweetData();
    this.subscriptions.push(
      this.windowForcus$.subscribe(
      () => {
        this.interval = setInterval(
          () => {
            this.tg.getTweetData();
          }, 5500
        );
      }
    ));

    this.subscriptions.push(
      this.windowBlur$.subscribe(
      () => {
        clearInterval(this.interval);
        console.log('!!!stop!!!');
      }
    ));
  }

  ngOnDestroy(): void {
    this.tweets = [];
    this.subscriptions.forEach(
      sub => sub.unsubscribe()
    );
  }

}
