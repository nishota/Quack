import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'desktop', loadChildren: () => import('./desktop-display/desktop-display.module').then(m => m.DesktopDisplayModule) },
  { path: 'mobile', loadChildren: () => import('./mobile-display/mobile-display.module').then(m => m.MobileDisplayModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
