import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() sidebarSwitch = new EventEmitter();
  trend: string;

  constructor(private tg: TweetGetterService) {
  }
  ngOnInit() {
    this.tg.trend$.subscribe(
      value => this.trend = value
    );
  }

  call_sidebar_switch() {
    this.sidebarSwitch.emit(null);
  }
}
