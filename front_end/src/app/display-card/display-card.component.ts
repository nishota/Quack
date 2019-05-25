import { Component, OnInit } from '@angular/core';
import { DisplayService } from '../service/display.service';
import { TweetData } from '../model/tweet.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-display-card',
  templateUrl: './display-card.component.html',
  styleUrls: ['./display-card.component.css']
})
export class DisplayCardComponent implements OnInit {

  tweet: TweetData;

  constructor(private modal: NgbActiveModal) { }

  ngOnInit() {
  }

  onClick() {
    this.modal.close();
    this.modal.dismiss();
  }

}
