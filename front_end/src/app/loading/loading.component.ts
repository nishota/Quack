import { Component, OnInit } from '@angular/core';
import { WindowStateService } from '../window-state.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  loaded: boolean;
  constructor(private ws: WindowStateService) {
  }

  ngOnInit(): void {
    this.loaded = this.ws.Loaded;
    this.ws.isLoading$.subscribe(
      () => this.loaded = true
    );
  }
}
