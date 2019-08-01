import { Component, OnInit, OnDestroy } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';
import { Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy{
  sideNavWidth: string;
  isOpened = true;
  // pcとspの判別
  @Input() Screen_Type: string;
  trend: string;
  subscriptions: Subscription[] = [];
  toolbarHeight: string;

  constructor(private tg: TweetGetterService) {
  }

  ngOnInit(): void {
    this.setToolBarHeight();
    this.subscriptions.push(
      this.tg.windowResize$.subscribe(
        () => this.setToolBarHeight()
      ));
    this.subscriptions.push(
      this.tg.trend$.subscribe(
        value => this.trend = value
      ));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      sub => sub.unsubscribe()
    );
  }
  sidebar_switch() {
    this.isOpened = !this.isOpened;
  }

  setToolBarHeight() {
    switch (this.Screen_Type) {
      case 'SP':
        this.toolbarHeight = '0';
        this.sideNavWidth = window.innerWidth + 'px';
        break;
      case 'PC':
      default:
        this.toolbarHeight = '64px';
        this.sideNavWidth = '300px';
        break;
    }
  }
}
