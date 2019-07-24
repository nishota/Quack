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
  sidenav_height: string;
  sideNavWidth: string;
  isOpened = true;
  // pcとspの判別
  @Input() Screen_Type: string;
  trend: string;
  subscriptions: Subscription[] = [];

  constructor(private tg: TweetGetterService) {
  }

  ngOnInit(): void {
    this.setSidebarHeight();
    this.subscriptions.push(
      this.tg.windowResize$.subscribe(
        () => this.setSidebarHeight()
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

  setSidebarHeight() {
    // サイドバーの高さ
    switch (this.Screen_Type) {
      case 'PC':
        this.sidenav_height = window.innerHeight - 64 + 'px';
        this.sideNavWidth = '300px';
        break;
      case 'SP':
        this.sidenav_height = window.innerHeight + 'px';
        this.sideNavWidth = window.innerWidth + 'px';
        break;
      default:
        break;
    }
  }
}
