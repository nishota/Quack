import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScreenType } from '../model/screen-type.enum';
import { environment } from 'src/environments/environment';
import { WindowStateService } from '../window-state.service';
import { QuackSystem } from '../model/quack-system.model';
import { Anime } from '../util/anime.util';

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

  version: string;
  year: string;
  teamName: string;
  licenceUrl: string;

  buyMeCoffee: string;
  youTube: string;
  twitter: string;

  trendLeft: string;
  IsShown: boolean;

  subscriptions: Subscription[] = [];
  constructor(private ws: WindowStateService) {
  }

  ngOnInit(): void {
    this.IsShown = false;
    this.trendLeft = String((this.ws.innerWidth - 250) / 2) + 'px';
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
          if (this.trend !== value) {
            this.trend = value;
            this.IsShown = true;
            setTimeout(() => {
              this.IsShown = false;
            }, 2000);
            this.linkTrend = environment.twitterTrendUrl + this.trend.slice(1);
          }
        }
      ));
    this.ws.quack$.subscribe(
      (res: QuackSystem) => {
        this.version = res.version;
        this.year = res.year;
        this.teamName = res.copyright;
        this.licenceUrl = res.licence;
        this.buyMeCoffee = res.buyMeCoffee;
        this.youTube = res.youTube;
        this.twitter = res.twitter;
      }
    );
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
