import { Injectable } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { TweetData2 } from './model/tweet.model';

@Injectable({
  providedIn: 'root'
})
export class WindowStateService {
  /**
   * カード内のテキストが3行のときの高さ
   */
  cardMaxHeight = 112;
  /**
   * ロード状態
   */
  isLoadingSource = new Subject<{ flag: boolean, message: string }>();
  isLoading$ = this.isLoadingSource.asObservable();

  contentSource = new Subject<TweetData2[]>();
  content$ = this.contentSource.asObservable();
  trendSource = new Subject<string>();
  trend$ = this.trendSource.asObservable();

  // TODO Resizeイベント
  windowResize$ = fromEvent(window, 'resize');
}
