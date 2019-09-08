import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TweetGetterService } from '../tweet-getter.service';
import { ScreenType } from '../model/screen-type.enum';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() screenType: ScreenType;
  @Input() trend: string;
  @Input() linkTrend: string;
  @Output() tbToggleSidebar = new EventEmitter();

  constructor(private tg: TweetGetterService) {
  }

  toggleSidebar() {
    this.tbToggleSidebar.emit(null);
  }
}
