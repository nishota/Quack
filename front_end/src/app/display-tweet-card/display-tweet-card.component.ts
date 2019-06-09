import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TweetGeneratorService } from '../tweet-generator.service';
import { Subscription } from 'rxjs';
import { Tweet } from '../model/tweet.model';

@Component({
  selector: 'app-display-tweet-card',
  templateUrl: './display-tweet-card.component.html',
  styleUrls: ['./display-tweet-card.component.css']
})
export class DisplayTweetCardComponent implements OnInit, AfterViewInit, OnDestroy {
  tweets: Tweet[] = [];

  subscriptions: Subscription[] = [];

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
          console.log(value);
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
    setInterval(
      () => {
        this.tg.getTweetData();
      }, 6000
    );
  }

  ngOnDestroy(): void {
    this.tweets = [];
    this.subscriptions.forEach(
      sub => sub.unsubscribe()
    );
  }

}
