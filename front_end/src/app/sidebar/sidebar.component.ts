import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScreenType } from '../model/screen-type.enum';
import { environment } from 'src/environments/environment';
import { WindowStateService } from '../window-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  trend: string;
  linkTrend: string;
  isOpened = false;
  threshold = 767; // iPad: 768px
  screenType: ScreenType;
  screenWidth: number;
  sideNavWidth: string;
  topPosition: string;
  sidebarCSS: string;

  subscriptions: Subscription[] = [];
  constructor(private ws: WindowStateService) {
  }

  ngOnInit(): void {
    this.setScreenType();
    this.setToolBarHeight();
    this.subscriptions.push(
      this.ws.windowResize$.subscribe(
        () => {
          this.setScreenType();
          this.setToolBarHeight();
        }
      ));
    this.subscriptions.push(
      this.ws.trend$.subscribe(
        value => {
          this.trend = value;
          this.linkTrend = environment.twitterTrendUrl + this.trend.slice(1);
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

　/*
   * 画面の横幅からPCかスマホか判別
   */
  setScreenType() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > this.threshold) {
      this.screenType = ScreenType.PC;
    } else {
      this.screenType = ScreenType.SP;
    }
  }

  /*
   * 「ツールバーの高さ」「サイドバーの横幅・CSS」設定
   */
  setToolBarHeight() {
    switch (this.screenType) {
      case ScreenType.SP: // SP
        this.sideNavWidth = window.innerWidth + 'px';
        this.topPosition = '56px';
        this.sidebarCSS = 'sidebar_SP';
        break;
      case ScreenType.PC: // PC
      default:
        this.sideNavWidth = '300px';
        this.topPosition = '64px';
        this.sidebarCSS = 'sidebar_PC';
        break;
    }
  }
}
