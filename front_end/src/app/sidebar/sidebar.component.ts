import { Component, OnInit} from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidenav_height:String;
  open_close:String='true';
  trend: string;
  constructor(private tg:TweetGetterService) { 
    this.sidenav_height=window.innerHeight - 64 +'px';
  }
 
  ngOnInit() :void {
    this.tg.trend$.subscribe(
      value => this.trend = value
    );
  }

  sidebar_switch(){
    if (this.open_close=='true') {
    this.open_close='false';
    }
    else {
      this.open_close='true';
      }
  }

}
