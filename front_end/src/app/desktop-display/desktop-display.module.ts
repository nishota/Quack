import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesktopDisplayRoutingModule } from './desktop-display-routing.module';
import { DesktopDisplayComponent } from './desktop-display.component';


@NgModule({
  declarations: [DesktopDisplayComponent],
  imports: [
    CommonModule,
    DesktopDisplayRoutingModule
  ]
})
export class DesktopDisplayModule { }
