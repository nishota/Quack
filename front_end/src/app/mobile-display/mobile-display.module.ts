import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
      MatToolbarModule,
      MatCardModule,
      MatSidenavModule,
      MatButtonModule,
      MatIconModule,
      MatListModule
} from '@angular/material';
import { MobileDisplayRoutingModule } from './mobile-display-routing.module';
import { MobileDisplayComponent } from './mobile-display.component';
import { TweetCardComponent } from '../tweet-card/tweet-card.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DisplayComponent } from '../display/display.component';
import { LoadingComponent } from '../loading/loading.component';
import { InfomationComponent } from '../infomation/infomation.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommunicationService } from '../communication.service';
import { WindowStateService } from '../window-state.service';
import { InfomationService } from '../infomation.service';
import { SpButtonComponent } from './components/sp-button/sp-button.component';
import { SpTrendComponent } from './components/sp-trend/sp-trend.component';
import { SpLogoComponent } from './components/sp-logo/sp-logo.component';

@NgModule({
  declarations: [
    MobileDisplayComponent,
    TweetCardComponent,
    ToolbarComponent,
    DisplayComponent,
    SpButtonComponent,
    LoadingComponent,
    InfomationComponent,
    SpTrendComponent,
    SidebarComponent,
    SpLogoComponent,
  ],
  imports: [
    CommonModule,
    MobileDisplayRoutingModule,
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
export class MobileDisplayModule { }
