import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesktopDisplayComponent } from './desktop-display.component';

const routes: Routes = [
  { path: '', component: DesktopDisplayComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesktopDisplayRoutingModule { }
