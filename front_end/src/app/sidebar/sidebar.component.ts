import { Component, OnInit } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidenav_height: string;
  isOpened = true;
  //pcとspの判別
  @Input() Screen_Type: string;

  constructor(private tg: TweetGetterService) {
  }

  ngOnInit(): void {
    this.setSidebarHeight();
    this.tg.windowResize$.subscribe(
      () => this.setSidebarHeight()
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
        break;
      case 'SP':
        this.sidenav_height = window.innerHeight + 'px';
        break;
      default:
        break;
    }
  }

}
