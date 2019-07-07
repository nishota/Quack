import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // スマホとPCの判別 (800px)
  screen_width: number;
  screen_type: string;

  constructor() {
    this.screen_width = window.innerWidth;
    if (this.screen_width > 800) {
      this.screen_type = 'PC';
    } else {
      this.screen_type = 'SP';
    }
  }
}

