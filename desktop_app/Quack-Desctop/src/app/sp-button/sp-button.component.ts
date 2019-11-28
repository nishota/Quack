import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sp-button',
  templateUrl: './sp-button.component.html',
  styleUrls: ['./sp-button.component.css']
})
export class SpButtonComponent {
  @Output() spToggleSidebar = new EventEmitter();

  toggleSidebar() {
    this.spToggleSidebar.emit(null);
  }
}
