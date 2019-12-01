import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sp-button',
  templateUrl: './sp-button.component.html',
  styleUrls: ['./sp-button.component.css']
})
export class SpButtonComponent {
  @Output() ToggleSidebar = new EventEmitter();
  @Output() ShowTrend = new EventEmitter();

  toggleSidebar() {
    this.ToggleSidebar.emit(null);
  }

  showTrend() {
    this.ShowTrend.emit(null);
  }
}
