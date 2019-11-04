import { Injectable } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { TweetData } from './model/tweet.model';

@Injectable({
  providedIn: 'root'
})
export class WindowStateService {
  /**
   * ツイートIDの最大値
   */
  maxId = '';
  maxIdNum: number;
  /**
   * 縦に何枚表示するか
   */
  indexHeight: number;
  /**
   * カード内のテキストが3行のときの高さ
   */
  cardMaxHeight = 112;
  /**
   * 全カード枚数
   */
  CARD_NUM = 30;
  /**
   * ロード中かどうか
   */
  isLoading = true;
  /**
   * 初回ロードが終了したか
   */
  Loaded = false;
  isLoadingSource = new Subject<boolean>();
  isLoading$ = this.isLoadingSource.asObservable();

  dismissSource = new Subject<TweetData>();
  dismiss$ = this.dismissSource.asObservable();

  // windowForcus$ = fromEvent(window, 'focus');
  // windowBlur$ = fromEvent(window, 'blur');
  windowResize$ = fromEvent(window, 'resize');
}
