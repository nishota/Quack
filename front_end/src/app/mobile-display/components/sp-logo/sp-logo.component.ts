import { Component, Input, OnInit } from '@angular/core';
import { WindowStateService } from 'src/app/window-state.service';
import { QuackSystem } from 'src/app/model/quack-system.model';

@Component({
  selector: 'app-sp-logo',
  templateUrl: './sp-logo.component.html',
  styleUrls: ['./sp-logo.component.css']
})
export class SpLogoComponent implements OnInit {
  @Input() IsShown: boolean;
  teamName: string;
  constructor(private ws: WindowStateService) {}
  ngOnInit(): void {
    this.ws.quack$.subscribe(
      (res: QuackSystem) => {
        this.teamName = res.copyright;
      }
    );
  }
}
