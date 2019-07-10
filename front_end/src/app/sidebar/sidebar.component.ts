import { Component, OnInit } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidenav_height: string;
  isOpened = true;
  trend: string;
  //pcとspの判別
  @Input()　 Screen_Type: String;  

  constructor(private tg: TweetGetterService) {
  }

  ngOnInit(): void {
    // サイドバーの高さ
    if(this.Screen_Type=='PC'){
      this.sidenav_height = window.innerHeight - 64 + 'px'; 
    }else if(this.Screen_Type=='SP'){
      this.sidenav_height = window.innerHeight + 'px';
    }

    this.tg.trend$.subscribe(
      value => this.trend = value
    );
  }

  sidebar_switch() {
    this.isOpened = !this.isOpened;
  }

}
