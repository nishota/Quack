import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Description } from './model/description.model';
import { environment } from 'src/environments/environment';
import { WindowStateService } from './window-state.service';
import { Subscription } from 'rxjs';
import { ScreenType } from './model/screen-type.enum';
import { QuackSystem } from './model/quack-system.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
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

  constructor(private router: Router, private meta: Meta, private ws: WindowStateService) {
  }

  ngOnInit(): void {
    // デバッグモードでは、リサイズしたら、リロードしない
    if (environment.production) {
      this.subscriptions.push(this.ws.windowResize$.subscribe(
        () => window.location.reload()
      ));
    }
    const ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
      this.router.navigate(['/mobile']);
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      this.router.navigate(['/desktop']);
    } else {
      this.router.navigate(['/desktop']);
    }
    this.ws.meta$.subscribe(
      (res: Description) => {
        this.meta.addTag({
          name: 'discription',
          content: res.description
        });
        // this.meta.addTag({
        //   property: 'twitter:card',
        //   content: res.twitterCard
        // });
        // this.meta.addTag({
        //   property: 'twitter:site',
        //   content: res.twitterSite
        // });
        // this.meta.addTag({
        //   property: 'og:url',
        //   content: res.ogUrl
        // });
        // this.meta.addTag({
        //   property: 'og:title',
        //   content: res.ogTitle
        // });
        // this.meta.addTag({
        //   property: 'og:description',
        //   content: res.ogDescription
        // });
        // this.meta.addTag({
        //   property: 'og:image',
        //   content: environment.frontUrl + res.ogImage
        // });
        // this.meta.addTag({
        //   property: 'og:type',
        //   content: res.ogType
        // });
      });
    this.IsShown = false;
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
            this.showTrend();
            this.linkTrend = environment.twitterTrendUrl + this.trend.slice(1);
          }
        }
      ));
    this.subscriptions.push(
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
  showTrend() {
    if (this.trend && !this.IsShown) {
      this.IsShown = true;
      setTimeout(() => {
        this.IsShown = false;
      }, 5000);
    }
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
