import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sp-button',
  templateUrl: './sp-button.component.html',
  styleUrls: ['./sp-button.component.css']
})
export class SpButtonComponent implements OnInit {

  @Output() spSidebarSwitch = new EventEmitter();

  constructor() {

  }
  ngOnInit() {

  }

  call_sp_sidebar_switch() {
    this.spSidebarSwitch.emit(null);
  }
}
