import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WindowStateService } from '../window-state.service';
import { Subscription } from 'rxjs';
import { ScreenType } from '../model/screen-type.enum';

@Component({
  selector: 'app-desktop-display',
  templateUrl: './desktop-display.component.html',
  styleUrls: ['../design/container.css', './desktop-display.component.css']
})
export class DesktopDisplayComponent implements OnInit, OnDestroy {
  trend: string;
  linkTrend: string;
  isOpened = false;
  sideNavWidth = '300px';
  screenType = ScreenType.PC;

  IsShown: boolean;

  innerWidth: string;
  innerHeight: string;

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
    this.innerHeight = String(window.innerHeight) + 'px';
    this.innerWidth = String(window.innerWidth) + 'px';
    this.IsShown = false;
    this.subscriptions.push(
      this.ws.trend$.subscribe(
        value => {
          if (this.trend !== value) {
            this.trend = value;
            this.linkTrend = environment.twitterTrendUrl + this.trend.slice(0);
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
}
