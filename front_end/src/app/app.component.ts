import { Component, OnInit } from '@angular/core';
import { TweetGetterService } from './tweet-getter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // スマホとPCの判別 (800px)
  screen_width: number;
  screen_type: string;

  constructor(private tg: TweetGetterService) {

  }
  
  ngOnInit(): void {
    this.setScreenType();
    this.tg.windowResize$.subscribe(
      () => this.setScreenType()
    );
  }

  setScreenType() {
    this.screen_width = window.innerWidth;
    if (this.screen_width > 800) {
      this.screen_type = 'PC';
    } else {
      this.screen_type = 'SP';
    }
  }
}
