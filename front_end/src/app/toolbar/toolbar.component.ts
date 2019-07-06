import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  trend: string;
  @Output() myEvent = new EventEmitter();
  constructor(private tg:TweetGetterService){
  }
  ngOnInit(): void {
    this.tg.trend$.subscribe(
      value => this.trend = value
    );
  }

  sampleToolFunc(){
    this.myEvent.emit(null);
  }
}
