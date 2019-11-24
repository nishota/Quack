import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DisplayComponent } from './display/display.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TweetCardComponent } from './tweet-card/tweet-card.component';
import { HttpClientModule } from '@angular/common/http';
import {
  MatToolbarModule,
  MatCardModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import { LoadingComponent } from './loading/loading.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SpButtonComponent } from './sp-button/sp-button.component';
import { InfomationComponent } from './infomation/infomation.component';
import { CommunicationService } from './communication.service';
import { InfomationService } from './infomation.service';
import { TealComponent } from './teal/teal.component';
import { SpTrendComponent } from './sp-trend/sp-trend.component';

@NgModule({
  declarations: [
    AppComponent,
    TweetCardComponent,
    ToolbarComponent,
    DisplayComponent,
    TweetCardComponent,
    SpButtonComponent,
    LoadingComponent,
    InfomationComponent,
    TealComponent,
    SpTrendComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  providers: [
    CommunicationService,
    InfomationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
