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
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SpButtonComponent } from './sp-button/sp-button.component';
import { InfomationComponent } from './infomation/infomation.component';
import { CommunicationService } from './communication.service';

@NgModule({
  declarations: [
    AppComponent,
    TweetCardComponent,
    SidebarComponent,
    ToolbarComponent,
    DisplayComponent,
    TweetCardComponent,
    SpButtonComponent,
    LoadingComponent,
    InfomationComponent
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
  providers: [CommunicationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
