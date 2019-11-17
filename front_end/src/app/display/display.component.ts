import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TweetData2 } from '../model/tweet.model';
import { Subscription } from 'rxjs';
import { WindowStateService } from '../window-state.service';
import { CommunicationService } from '../communication.service';
import { Anime } from '../util/anime.util';
import { Count, Message } from 'src/environments/const.environment';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, AfterViewInit, OnDestroy {

  trend: string;
  tweetDatas: TweetData2[] = [];

  subscriptions: Subscription[] = [];
  isLoading = true;
  displayWidth: string;
  message = Message.Loading;
  arr = [];

  constructor(
    private tg: CommunicationService,
    private ws: WindowStateService,
  ) {
    for (let i = 0; i < Count.Card; i++) {
      this.tweetDatas.push(new TweetData2(i, '', '', '', '', false));
    }
  }

  ngOnInit() {
    // tweetを格納
    this.subscriptions.push(
      this.ws.content$.subscribe(
        (tweetDatas: TweetData2[]) => {
          if (!this.isLoading) {
            tweetDatas.forEach(
              (data: TweetData2) => {
                const id = data.id;
                this.tweetDatas[id].Text = data.Text;
                this.tweetDatas[id].Date = data.Date;
                this.tweetDatas[id].User = data.User;
                this.tweetDatas[id].Url = data.Url;
                setTimeout(
                  // TODO: 実行場所をtweet-card内にした方が良さそう?
                  // TODO: Viewの更新後終了後にstartAnimeしたい
                  () => {
                    Anime.startAnime(
                      this.tweetDatas[id],
                      this.isLoading,
                      (endData: TweetData2) => {
                        endData.isShown = false;
                      });
                  }, 500);
              });
          }
        }
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
      this.ws.trend$.subscribe(
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
}
