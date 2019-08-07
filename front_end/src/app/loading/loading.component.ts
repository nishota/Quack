import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  loaded: boolean;
  constructor(private tg: TweetGetterService) {
  }

  ngOnInit(): void {
    this.loaded = this.tg.Loaded;
    this.tg.isLoading$.subscribe(
      () => this.loaded = true
    );
  }
}
