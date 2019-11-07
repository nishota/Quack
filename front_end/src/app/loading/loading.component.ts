import { Component, OnInit } from '@angular/core';
import { WindowStateService } from '../window-state.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  constructor() {
  }
  ngOnInit(): void {
  }
}
