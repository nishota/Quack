import { Component, OnInit } from '@angular/core';
import { TweetGetterService } from './tweet-getter.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private meta: Meta) {
  }

  ngOnInit(): void {
    this.meta.addTag(
      {
        name: 'discription',
        content: 'QuackでリアルタイムなTwitterトレンドを流れるカードでフォローしよう!'
      }
    );
  }
}
