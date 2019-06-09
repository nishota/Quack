import { Component, OnInit } from '@angular/core';
import { TweetGeneratorService } from './tweet-generator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  trend = 'Loading now';

  constructor(private tg: TweetGeneratorService) {

  }

  ngOnInit(): void {
    this.tg.trend$.subscribe(
      value => this.trend = 'Trend: '+ value
    );
  }
}
