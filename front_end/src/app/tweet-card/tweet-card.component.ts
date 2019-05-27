import { Component, OnInit, Input } from '@angular/core';
import { TwitterService } from '../service/twitter.service';
import { TweetData } from '../model/tweet.model';
import * as anime from 'animejs';
import { Card } from '../model/card.model';
import { environment } from 'src/environments/environment';
import { DisplayService } from '../service/display.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisplayCardComponent } from '../display-card/display-card.component';
import { AnimeMode, AnimeSetting } from '../model/anime-setting.model';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css'],
})
export class TweetCardComponent implements OnInit {
  @Input() tweet: TweetData;
  card = new Card();
  animeSetting: AnimeSetting;
  display = 'none';

  interval;

  private TIME = 10000;


  constructor(private ds: DisplayService, private modal: NgbModal) {
    this.card.init();
  }

  ngOnInit() {
    if (this.tweet) {
      this.animeSetting = new AnimeSetting(this.card, this.tweet, this.TIME);
      this.start();
    }
  }

  start() {
    this.interval = setInterval(() => {
      const setting = this.animeSetting.set(AnimeMode.straight) as anime.AnimeAnimParams;
      anime(setting);
      this.display = 'block';
    }, this.TIME * 3 / 2);
  }

  stop() {
    this.card.setCoord(0, 0);
    this.card.setScale(0);
    this.card.setOpacity(0);
    clearInterval(this.interval);
  }

  onClick() {
    this.ds.Tweet = this.tweet;
    const modalRef = this.modal.open(
      DisplayCardComponent,
      { size: 'lg', backdrop: 'static', centered: true, windowClass: 'display-card' }
    );
    modalRef.componentInstance.tweet = this.tweet;
  }
}
