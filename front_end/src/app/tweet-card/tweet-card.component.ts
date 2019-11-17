import { Component, OnInit, Input } from '@angular/core';

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

  ngOnInit() {
    this.id = 'target' + String(this.Id);
    this.class = 'center target' + String(this.Id);
    this.formTop = String(Math.random() * (window.innerHeight) + 30) + 'px';
  }
}
