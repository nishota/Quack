import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Tweet } from '../model/tweet.model';

import { TweetGetterService } from '../tweet-getter.service';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements OnInit, AfterViewInit {
  @Input() data: { id: number, tweet: Tweet, display: string };
  id: string;
  class: string;
 
  constructor(private tg: TweetGetterService) {
  }

  ngOnInit() {
    this.id = 'target' + String(this.data.id);
    this.class = 'center target' + String(this.data.id);
  }

  ngAfterViewInit(): void {

  }
}
