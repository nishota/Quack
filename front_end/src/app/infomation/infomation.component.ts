import { Component, OnInit } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';

@Component({
  selector: 'app-infomation',
  templateUrl: './infomation.component.html',
  styleUrls: ['./infomation.component.css']
})
export class InfomationComponent implements OnInit {

  infos: Infomation[] = [];
  infoNum = 3;

  constructor(private tg: TweetGetterService) { }

  ngOnInit() {
    this.tg.getInfoFromAsset().subscribe(
      (res: Infomation[]) => {
        let count = 0;
        res.forEach(content => {
          if (count < this.infoNum) {
            this.infos.push(content);
          }
          count++;
        });
      }
    );
  }
}

export class Infomation {
  date: string;
  content: string;
  url: string;
  hasUrl: boolean;
}
