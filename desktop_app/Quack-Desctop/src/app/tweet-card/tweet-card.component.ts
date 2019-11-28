import { Component, OnInit, Input } from '@angular/core';
import { WindowStateService } from '../window-state.service';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements OnInit {
  @Input() Text: string;
  @Input() Url: string;
  @Input() User: string;
  @Input() Date: string;
  @Input() Id: string;
  @Input() IsShown: boolean;

  id: string;
  class: string;

  formTop: string; // TODO もう少しいい方法で決めたい
  animation: string;
  duration: string;
  delay: string;

  constructor(private ws: WindowStateService) { }

  ngOnInit() {
    this.id = 'target' + String(this.Id);
    this.formTop = String(Math.random() * (this.ws.innerHeight)) + 'px';
    this.animation = 'animation' + String(this.ws.windowIndex);
    this.duration = String(this.ws.cardDuration) + 's';
    this.delay = String(5 * Math.random()) + 's';
  }
}
