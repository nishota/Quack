import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pc-trend',
  templateUrl: './pc-trend.component.html',
  styleUrls: ['./pc-trend.component.css', '../../../design/trend.css']
})
export class PcTrendComponent {
  @Input() trend: string;
  @Input() linkTrend: string;
}
