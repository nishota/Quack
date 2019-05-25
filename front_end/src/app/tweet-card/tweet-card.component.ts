import { Component, OnInit, Input } from '@angular/core';
import { TwitterService } from '../service/twitter.service';
import { TweetData } from '../model/tweet.model';
import * as anime from 'animejs';
import { Card } from '../model/card.model';
import { environment } from 'src/environments/environment';
import { DisplayService } from '../service/display.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisplayCardComponent } from '../display-card/display-card.component';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css'],
})
export class TweetCardComponent implements OnInit {
  @Input() tweet: TweetData;
  tweetCardId = 'target';
  tweetCardCN = 'center target';
  userPage = environment.twitterURL;
  card = new Card();
  display = 'none';
  zIndex = 0;

  interval;

  private TIME = 10000;


  constructor(private ds: DisplayService, private modal: NgbModal) {
    this.card.init();
  }

  ngOnInit() {
    if (this.tweet) {
      const tweetNum = this.tweet.TweetId.slice(-3);
      this.tweetCardId += tweetNum;
      this.tweetCardCN += tweetNum;
      this.userPage += this.tweet.User;
      const id = Number(tweetNum);
      if (Number.isInteger(id)) {
        this.zIndex = id;
      }
      this.start();
    }
  }

  start() {
    this.interval = setInterval(() => {
      // ランダムに動かす
      // this.TIME = 3000;
      // this.card.setCoordRandom();
      // this.card.setScaleAndOpacityRandom();
      // const setting = {
      //   targets: '.' + this.tweetCardId,
      //   translateX: [this.card.coordBefore.x, this.card.coord.x],
      //   translateY: [this.card.coordBefore.y, this.card.coord.y],
      //   scale: this.card.scale,
      //   opacity: this.card.opacity,
      //   easing: 'easeOutCubic'
      // };

      // 右から左へ流す
      this.TIME = 10000;
      this.card.setCoordLikeNico();
      this.card.scale = 1;
      this.card.opacity = 0.75;
      const setting = {
        targets: '.' + this.tweetCardId,
        translateX: [this.card.coordBefore.x, this.card.coord.x],
        translateY: [this.card.coordBefore.y, this.card.coord.y],
        scale: this.card.scale,
        opacity: this.card.opacity,
        easing: 'linear',
        duration: this.TIME,
        delay: Math.random() * (this.TIME / 2)
      };

      anime(setting);

      this.display = 'block';
    }, this.TIME * 3 / 2);
  }

  stop() {
    this.card.setCoord(0, 0);
    this.card.setScale(0);
    this.card.setOpacity(0);
    clearInterval(this.interval);
    this.zIndex = 10000;
  }

  onClick() {
    const setting = {
      targets: '.' + this.tweetCardCN,
      translateX: [this.card.coordBefore.x, this.card.coord.x],
      translateY: [this.card.coordBefore.y, this.card.coord.y],
      scale: 0,
      opacity: 0,
      easing: 'easeOutCubic'
    };

    anime(setting);
    this.ds.Tweet = this.tweet;
    const modalRef = this.modal.open(
      DisplayCardComponent,
      { size: 'lg', backdrop: 'static', centered: true, windowClass: 'display-card' }
    );
    modalRef.componentInstance.tweet = this.tweet;
  }
}
