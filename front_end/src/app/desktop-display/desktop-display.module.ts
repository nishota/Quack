import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesktopDisplayRoutingModule } from './desktop-display-routing.module';
import { DesktopDisplayComponent } from './desktop-display.component';
import { TweetCardComponent } from '../tweet-card/tweet-card.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DisplayComponent } from '../display/display.component';
import { LoadingComponent } from '../loading/loading.component';
import { InfomationComponent } from '../infomation/infomation.component';
import {
  MatToolbarModule,
  MatCardModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import { CommunicationService } from '../communication.service';
import { WindowStateService } from '../window-state.service';
import { InfomationService } from '../infomation.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PcTrendComponent } from './components/pc-trend/pc-trend.component';
import { PcButtonComponent } from './components/pc-button/pc-button.component';

@NgModule({
  declarations: [
    DesktopDisplayComponent,
    TweetCardComponent,
    ToolbarComponent,
    DisplayComponent,
    LoadingComponent,
    InfomationComponent,
    SidebarComponent,
    PcTrendComponent,
    PcButtonComponent,

  ],
  imports: [
    CommonModule,
    DesktopDisplayRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  providers: [
    CommunicationService,
    WindowStateService,
    InfomationService
  ]
})
export class DesktopDisplayModule { }
