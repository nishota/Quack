import { Component, OnInit } from '@angular/core';
import { WindowStateService } from '../window-state.service';
import { QuackSystem } from '../model/quack-system.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  version: string;
  year: string;
  teamName: string;
  licenceUrl: string;

  buyMeCoffee: string;
  youTube: string;
  twitter: string;

  constructor(private ws: WindowStateService) { }

  ngOnInit() {
    this.ws.quack$.subscribe(
      (res: QuackSystem) => {
        this.version = res.version;
        this.year = res.year;
        this.teamName = res.copyright;
        this.licenceUrl = res.licence;
        this.buyMeCoffee = res.buyMeCoffee;
        this.youTube = res.youTube;
        this.twitter = res.twitter;
      }
    );
  }

}
