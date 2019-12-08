import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { WindowStateService } from './window-state.service';
import { InfomationService } from './infomation.service';
import { CommunicationService } from './communication.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    WindowStateService,
    InfomationService,
    CommunicationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
