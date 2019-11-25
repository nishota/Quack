import { Component, OnInit, Input } from '@angular/core';
import { WindowStateService } from '../window-state.service';

@Component({
  selector: 'app-sp-trend',
  templateUrl: './sp-trend.component.html',
  styleUrls: ['./sp-trend.component.css']
})
export class SpTrendComponent implements OnInit {
  @Input() IsShown: boolean;
  @Input() trend: string;
  trendLeft: string;

  constructor(private ws: WindowStateService) { }

  ngOnInit() {
    this.trendLeft = String((this.ws.innerWidth - 282) / 2) + 'px';
  }

}
