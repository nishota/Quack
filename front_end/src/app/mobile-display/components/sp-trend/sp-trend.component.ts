import { Component, OnInit, Input, DoCheck } from '@angular/core';

@Component({
  selector: 'app-sp-trend',
  templateUrl: './sp-trend.component.html',
  styleUrls: ['./sp-trend.component.css', '../../../design/trend.css']
})
export class SpTrendComponent implements OnInit, DoCheck {
  @Input() IsShown: boolean;
  @Input() trend: string;
  @Input() linkTrend: string;
  trendLeft: string;
  fontSize = '14px';
  trendBefore: string;

  constructor() { }

  ngOnInit() {
    this.trendLeft = String((window.innerWidth - 282) / 2) + 'px';
  }

  ngDoCheck() {
    if (this.trendBefore !== this.trend) {
      this.fontSize = this.trend.length > 18 ? '12px' : '14px';
      this.trendBefore = this.trend;
    }
  }

}
