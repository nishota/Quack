import { Component, OnInit, Input } from '@angular/core';
import { WindowStateService } from '../window-state.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  @Input() message: string;
  imgSrc = environment.frontUrl + 'assets/kamo_colorful_logo.png';
}
