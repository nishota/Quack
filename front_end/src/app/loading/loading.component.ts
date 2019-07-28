import { Component, OnInit } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  initalized: boolean;

  constructor(private tg: TweetGetterService) {
  }

  ngOnInit() {
    this.initalized = this.tg.Loaded;
  }
}
