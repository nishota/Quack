import { Component, OnInit, Input} from '@angular/core';
import { Tweet } from '../model/tweet.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements OnInit {
  @Input() data: { id: number, tweet: Tweet, display: string };
  id: string;
  class: string;
  userPage: string;

  constructor() {
  }

  ngOnInit() {
    this.id = 'target' + String(this.data.id);
    this.class = 'center target' + String(this.data.id);
    this.userPage = environment.twitterUrl + this.data.tweet.User;
  }
}
