import { Component, OnInit } from '@angular/core';
import { TweetGetterService } from './tweet-getter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  trend: string;
  constructor(private tg:TweetGetterService){
  }
  ngOnInit(): void {
    this.tg.trend$.subscribe(
      value => this.trend = value
    );
  }
}
