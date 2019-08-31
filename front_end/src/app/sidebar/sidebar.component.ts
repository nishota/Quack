import { Component, OnInit, OnDestroy } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';
import { Subscription, Subject } from 'rxjs';
import { ScreenType } from '../model/screen-type.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  trend: string;
  link_trend: string;
  isOpened = true;
  threshold = 767; // iPad: 768px
  screenType: ScreenType;
  screenWidth: number;
  sideNavWidth: string;
  topPosition: string;

  subscriptions: Subscription[] = [];

  constructor(private tg: TweetGetterService) {
  }

  ngOnInit(): void {
    this.setScreenType();
    this.setToolBarHeight();
    this.subscriptions.push(
      this.tg.windowResize$.subscribe(
        () => {
          this.setScreenType();
          this.setToolBarHeight();
        }
      ));
    this.subscriptions.push(
      this.tg.trend$.subscribe(
        value => {
          this.trend = value;
          this.link_trend = 'http://twitter.com/search?q=%23' + this.trend.slice(1);
        }
      ));

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      sub => sub.unsubscribe()
    );
  }
  toggleSidebar() {
    this.isOpened = !this.isOpened;
  }

  setScreenType() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > this.threshold) {
      this.screenType = ScreenType.PC;
    } else {
      this.screenType = ScreenType.SP;
    }
  }

  setToolBarHeight() {
    switch (this.screenType) {
      case ScreenType.SP: // SP
        this.sideNavWidth = window.innerWidth + 'px';
        this.topPosition = '56px';
        break;
      case ScreenType.PC: // PC
      default:
        this.sideNavWidth = '300px';
        this.topPosition = '64px';
        break;
    }
  }
}
