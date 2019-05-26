import { Component, OnInit } from '@angular/core';
import { TwitterService } from './service/twitter.service';
import { TweetData } from './model/tweet.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private MAX_CARD_NUMBER = 20;
  cards: TweetData[] = [];
  savedCards: any[] = [];
  trend: string;

  constructor(private ts: TwitterService) {
  }

  ngOnInit() {
    setInterval(() => {
      this.ts.getTweetFomDevServer().subscribe(
        (data: any[]) => data.forEach(item => {
          if (this.checkTweetId(item)) {
            this.savedCards.push(item);
          }
        }),
        () => console.log('error')
      );
    }, 5000);

    setInterval(() => {
      for (; this.cards.length > this.MAX_CARD_NUMBER - 3;) {
        this.cards.shift();
        this.savedCards.shift();
      }
      this.savedCards.forEach(
        tweet => {
          this.trend = tweet.trend;
          if (this.cards.length < this.MAX_CARD_NUMBER) {
            this.cards.push(
              new TweetData(
                tweet.id_str,
                tweet.screen_name,
                tweet.created_at,
                tweet.text
              )
            );
          }
        }
      );
    }, 10000);
  }
  /**
   * TweetIdを調べて
   * 重複がない場合、Trueを返す
   * 重複がある場合、Falseを返す
   */
  checkTweetId(tweet: any): boolean {
    const sameTweets =
      this.savedCards.filter(
        c => c.id_str === tweet.id_str
      );
    console.log(sameTweets.length)
    return sameTweets.length === 0;
  }
}
