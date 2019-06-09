import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Tweet } from '../model/tweet.model';
import { environment } from '../../environments/environment';
import { StateStraight } from '../model/state-straight.model';
import * as anime from 'animejs';
import { TweetGeneratorService } from '../tweet-generator.service';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements OnInit, AfterViewInit {
  @Input() text: Tweet;
  display = 'none';
  zIndex: string;
  seqCount: number;

  id: string;
  className: string;
  userPage: string;

  state = new StateStraight();
  time = 10000;
  setting;

  index;

  constructor(
    private tg: TweetGeneratorService
  ) {
  }

  ngOnInit() {
    const tweetNum = this.text.TweetId.slice(-5);
    this.id = 'target' + tweetNum;
    this.className = 'center target' + tweetNum;
    this.zIndex = tweetNum;

    this.userPage = environment.twitterUrl + this.text.User;
    // const height = window.innerHeight;
    const indexHeight = Math.round(window.innerHeight / 100);
    this.index = this.text.id % indexHeight;
    const width = window.innerWidth + 400; // カードの大きさ
    this.state.setCoordLikeNico(width, null, this.index);
  }

  ngAfterViewInit(): void {
    this.setting = {
      targets: '.' + this.id,
      translateX: [this.state.coordBefore.x, this.state.coord.x],
      translateY: [this.state.coordBefore.y, this.state.coord.y],
      scale: this.state.scale,
      opacity: 0.75,
      easing: 'linear',
      duration: this.time,
      delay: this.index * 800,
      begin: () => this.display = 'block',
      complete: () => {
        this.display = 'none';
        this.tg.dismissSource.next(this.text);
      }
    };
    anime(this.setting);
  }

}
