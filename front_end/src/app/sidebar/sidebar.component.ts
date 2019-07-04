import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidenav_height:String;
  constructor() { 
    this.sidenav_height=window.innerHeight - 64 +'px';
  }

  ngOnInit() {

  }

}
