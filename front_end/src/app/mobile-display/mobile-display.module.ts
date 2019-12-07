import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileDisplayRoutingModule } from './mobile-display-routing.module';
import { MobileDisplayComponent } from './mobile-display.component';


@NgModule({
  declarations: [MobileDisplayComponent],
  imports: [
    CommonModule,
    MobileDisplayRoutingModule
  ]
})
export class MobileDisplayModule { }
