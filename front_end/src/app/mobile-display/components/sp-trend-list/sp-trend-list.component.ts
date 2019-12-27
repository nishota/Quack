import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-sp-trend-list',
  templateUrl: './sp-trend-list.component.html',
  styleUrls: ['./sp-trend-list.component.css']
})
export class SpTrendListComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<SpTrendListComponent>) {}

  ngOnInit() {
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
