import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WindowStateService } from '../window-state.service';
import { Subscription } from 'rxjs';
import { ScreenType } from '../model/screen-type.enum';

@Component({
  selector: 'app-mobile-display',
  templateUrl: './mobile-display.component.html',
  styleUrls: ['./mobile-display.component.css']
})
export class MobileDisplayComponent implements OnInit, OnDestroy {
  trend: string;
  linkTrend: string;
  isOpened = false;
  screenWidth: number;
  sideNavWidth = window.innerWidth + 'px';
  topPosition = '56px';
  sidebarCSS = 'sidebar_SP';
  screenType = ScreenType.SP;

  IsShown: boolean;

  subscriptions: Subscription[] = [];

  constructor(private ws: WindowStateService) {
  }

  ngOnInit(): void {
    // デバッグモードでは、リサイズしたら、リロードしない
    if (environment.production) {
      this.subscriptions.push(this.ws.windowResize$.subscribe(
        () => window.location.reload()
      ));
    }
    this.IsShown = false;
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
}
