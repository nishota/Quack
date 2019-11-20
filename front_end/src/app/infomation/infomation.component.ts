import { Component, OnInit } from '@angular/core';
import { Infomation } from '../model/infomation.model';
import { Count } from 'src/environments/const.environment';
import { InfomationService } from '../infomation.service';

@Component({
  selector: 'app-infomation',
  templateUrl: './infomation.component.html',
  styleUrls: ['./infomation.component.css']
})
export class InfomationComponent implements OnInit {

  private infos: Infomation[] = [];

  constructor(private is: InfomationService) { }

  ngOnInit() {
    this.is.getInfomation().subscribe(
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

