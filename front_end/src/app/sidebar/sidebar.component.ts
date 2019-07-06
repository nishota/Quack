import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidenav_height:String;
  open_close:String='true';
  constructor() { 
    this.sidenav_height=window.innerHeight - 64 +'px';
  }

  ngOnInit() {

  }

  sampleFunc(){
    console.log('testttttt');
    this.open_close='false';
    console.log(this.open_close);
  }

}
