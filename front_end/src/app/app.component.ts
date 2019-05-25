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
  keyWord = new FormControl('');
  private MAX_CARD_NUMBER = 20;
  cards: TweetData[] = [];

  constructor(private ts: TwitterService) {
    this.keyWord.setValue('草'); // ここをトレンドから持ってくる？
  }

  ngOnInit() {
    setInterval(() => {
      this.ts.getTweetWithKeyword(this.keyWord.value).subscribe(
        (data: any) => {
          data.forEach(tweet => {
            if (this.checkTweetId(tweet)) {
              this.cards.push(
                new TweetData(
                  tweet.id_str,
                  tweet.user.screen_name,
                  tweet.created_at,
                  tweet.text
                )
              );
            }
          });
        },
        () => console.log('error'),
        () => {
          // 表示カードが多くなったら、消す
          for (; this.cards.length > this.MAX_CARD_NUMBER;) {
            this.cards.shift();
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
      this.cards.filter(
        c => c.TweetId === tweet.id_str
      );
    return sameTweets.length === 0;
  }
}
