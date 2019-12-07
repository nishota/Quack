import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { WindowStateService } from '../window-state.service';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements OnInit, DoCheck {
  @Input() Text: string;
  @Input() Url: string;
  @Input() User: string;
  @Input() Date: string;
  @Input() IsShown: boolean;
  @Input() Changed: boolean;
  @Input() Delay: number;

  class: string;

  formTop: string; // TODO もう少しいい方法で決めたい
  animation: string;
  duration: string;
  delay: string;

  constructor(private ws: WindowStateService) { }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.Changed) {
      this.duration = String(this.ws.cardDuration) + 's';
      this.delay = String(this.Delay) + 's';
      this.formTop = String(Math.random() * (this.ws.innerHeight)) + 'px';
      this.animation = 'animation' + String(this.ws.windowIndex);
      this.Changed = false;
    }
  }
}
