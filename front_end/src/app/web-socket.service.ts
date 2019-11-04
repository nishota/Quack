// 参考サイト: https://qiita.com/cilly/items/833bc20784b0a7d56d03
// npm install socket.io-client --save
// npm install @types/socket.io-client --save-dev

import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable()
export class WebSocketService {

  constructor() {
    this.connect('conect=Hi,ServerSide!');
  }

  private url = 'http://localhost:5000';
  private socket;

  connect(queryString: string) {
    this.socket = io(this.url, { query: queryString });
  }

  emit(emitName: string, data?: any) {
    this.socket.emit(emitName, data);
  }

  on(onName: string) {
    const observable = new Observable(observer => {
      this.socket.on(onName, (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  /**
   * TODO: ツイート取得処理
   */
  getTweetData(): void {
  //   this.indexHeight = Math.round(window.innerHeight / this.cardMaxHeight);
  //   this.getTweetSubscription = this.getTweetFromServer(this.maxId, this.indexHeight).subscribe(
  //     (res: TweetRes) => {
  //       this.indexHeight = Math.round(window.innerHeight / this.cardMaxHeight);
  //       if (res.trend !== '') {
  //         this.trendSource.next(res.trend);
  //         this.maxId = res.maxid;
  //         if (res.tweets && res.tweets.length > 0) {
  //           res.tweets.forEach(
  //             (tweet) => {
  //               this.contentSource.next(
  //                 new TweetData(
  //                   this.count % this.CARD_NUM,
  //                   new Tweet(
  //                     tweet.id_str,
  //                     tweet.screen_name,
  //                     this.setDateString(tweet.created_at),
  //                     tweet.text)
  //                 ));
  //               this.count++;
  //             });
  //         }
  //         this.state.isLoadingSource.next(false);
  //       } else {
  //         this.state.isLoadingSource.next(true);
  //       }
  //     },
  //     () => this.state.isLoadingSource.next(true)
  //   );
  }

}
