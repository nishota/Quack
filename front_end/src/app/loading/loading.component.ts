import { Component, OnInit, Input } from '@angular/core';
import { WindowStateService } from '../window-state.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  @Input() message: string;
}
