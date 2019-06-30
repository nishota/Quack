import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DisplayComponent } from './display/display.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TweetCardComponent } from './tweet-card/tweet-card.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule, MatToolbarModule } from '@angular/material';
import { LoadingComponent } from './loading/loading.component';
import { ImgCardComponent } from './img-card/img-card.component';
import { AdCardComponent } from './ad-card/ad-card.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    TweetCardComponent,
    LoadingComponent,
    ImgCardComponent,
    AdCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
