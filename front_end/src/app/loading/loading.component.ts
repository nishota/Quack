import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';
import { WindowStateService } from '../window-state.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  loaded: boolean;
  constructor(private tg: TweetGetterService, private ws: WindowStateService) {
  }

  ngOnInit(): void {
    this.loaded = this.ws.Loaded;
    this.ws.isLoading$.subscribe(
      () => this.loaded = true
    );
  }
}
