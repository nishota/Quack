import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() sidebarSwitch = new EventEmitter();
  constructor() {
  }
  ngOnInit() {

  }

  call_sidebar_switch() {
    this.sidebarSwitch.emit(null);
  }
}
