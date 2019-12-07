import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MobileDisplayComponent } from './mobile-display.component';

const routes: Routes = [{ path: '', component: MobileDisplayComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileDisplayRoutingModule { }
