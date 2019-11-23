import { Injectable } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { TweetData2 } from './model/tweet.model';
import { InfomationService } from './infomation.service';

@Injectable({
  providedIn: 'root'
})
export class WindowStateService {

  constructor(private is: InfomationService) { }

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

  meta$ = this.is.getDescription();

  infomation$ = this.is.getInfomation();

  quack$ = this.is.getQuackSystem();

  // TODO Resizeイベント
  windowResize$ = fromEvent(window, 'resize');
}
