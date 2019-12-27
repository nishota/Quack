import { Component, Output, EventEmitter } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { SpTrendListComponent } from '../sp-trend-list/sp-trend-list.component';

@Component({
  selector: 'app-sp-button',
  templateUrl: './sp-button.component.html',
  styleUrls: ['./sp-button.component.css']
})
export class SpButtonComponent {
  @Output() ToggleSidebar = new EventEmitter();
  @Output() ShowTrend = new EventEmitter();
  constructor(private bottomSheet: MatBottomSheet) {}
  
  toggleSidebar() {
    this.ToggleSidebar.emit(null);
  }

  showTrend() {
    this.bottomSheet.open(SpTrendListComponent);
  }
}
