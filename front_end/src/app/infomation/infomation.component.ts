import { Component, OnInit } from '@angular/core';
import { Infomation } from '../model/infomation.model';
import { CommunicationService } from '../communication.service';
import { Count } from 'src/environments/const.environment';

@Component({
  selector: 'app-infomation',
  templateUrl: './infomation.component.html',
  styleUrls: ['./infomation.component.css']
})
export class InfomationComponent implements OnInit {

  private infos: Infomation[] = [];

  constructor(private tg: CommunicationService) { }

  ngOnInit() {
    this.tg.getInfoFromAsset().subscribe(
      (res: Infomation[]) => {
        let count = 0;
        res.forEach(content => {
          if (count < Count.Info) {
            this.infos.push(content);
          }
          count++;
        });
      }
    );
  }
}

