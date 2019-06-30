import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ad-card',
  templateUrl: './ad-card.component.html',
  styleUrls: ['./ad-card.component.css']
})
export class AdCardComponent implements OnInit {
  // TODO
  // adクラス作成
  @Input() data: { id: number, ad: any, display: string };

  id: string;
  class: string;

  constructor() { }

  ngOnInit() {
    this.id = 'target' + String(this.data.id);
    this.class = 'center target' + String(this.data.id);
  }

}
