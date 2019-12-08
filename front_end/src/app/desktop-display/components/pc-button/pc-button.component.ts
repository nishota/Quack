import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pc-button',
  templateUrl: './pc-button.component.html',
  styleUrls: ['./pc-button.component.css']
})
export class PcButtonComponent {
  @Output() ToggleSidebar = new EventEmitter();

  toggleSidebar() {
    this.ToggleSidebar.emit(null);
  }
}
