import { Component, OnInit } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';
import { Infomation } from '../model/infomation.model';

@Component({
  selector: 'app-infomation',
  templateUrl: './infomation.component.html',
  styleUrls: ['./infomation.component.css']
})
export class InfomationComponent implements OnInit {

  infos: Infomation[] = [];
  /**
   * お知らせの数
   */
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

