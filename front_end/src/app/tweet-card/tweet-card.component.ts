import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { WindowStateService } from '../window-state.service';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements DoCheck {
  static num = 0;
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

  ngDoCheck() {
    if (this.Changed) {
      this.duration = String(this.ws.cardDuration) + 's';
      this.delay = String(this.Delay) + 's';
      this.formTop = String(this.normRand((TweetCardComponent.num % Math.ceil(this.ws.innerHeight - 200)), 100) + 64) + 'px';
      this.animation = 'animation' + String(this.ws.windowIndex);
      this.Changed = false;
      if (TweetCardComponent.num < 10000000000) {
        TweetCardComponent.num += 200;
      } else {
        TweetCardComponent.num = 0;
      }
    }
  }

  /**
   * ガウス確率分布を返す関数
   * @param m 平均
   * @param s 分散
   */
  normRand(m: number, s: number): number {
    const a = 1 - Math.random();
    const b = 1 - Math.random();
    const c = Math.sqrt(-2 * Math.log(a));
    if (0.5 - Math.random() > 0) {
      return c * Math.sin(Math.PI * 2 * b) * s + m;
    } else {
      return c * Math.cos(Math.PI * 2 * b) * s + m;
    }
  }
}
