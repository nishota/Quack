import { Component, OnInit,ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidenav_height:String;
  sampleElement: HTMLElement;

  constructor(el: ElementRef) { 
    this.sidenav_height=window.innerHeight - 64 +'px';
    this.sampleElement = el.nativeElement;
  }

  ngOnInit() {

  }

  sampleFunc(){
    console.log('testttttt');
    this.sampleElement.querySelector('.sidebar').remove;
  }

}
