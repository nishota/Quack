import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ScreenType } from '../model/screen-type.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() screenType: ScreenType;
  @Output() ToggleSidebar = new EventEmitter();

  logoSrc = environment.frontUrl + 'assets/Quack.png';
  imgSrc = environment.frontUrl + 'assets/kamo_colorful_logo.png';

  constructor() {
  }

  toggleSidebar() {
    this.ToggleSidebar.emit(null);
  }
}
