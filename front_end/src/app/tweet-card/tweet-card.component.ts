import { Component, OnInit, Input } from '@angular/core';
import { TweetData } from '../model/tweet.model';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements OnInit {
  @Input() data: TweetData;
  id: string;
  class: string;

  constructor() {
  }

  ngOnInit() {
    this.id = 'target' + String(this.data.id);
    this.class = 'center target' + String(this.data.id);
  }
}
