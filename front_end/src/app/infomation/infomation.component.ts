import { Component, OnInit } from '@angular/core';
import { Infomation } from '../model/infomation.model';
import { WebSocketService } from '../web-socket.service';

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

  constructor(private tg: WebSocketService) { }

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

