import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageMapComponent } from './page-map/page-map.component';
import { DailyRiskComponent } from './daily-risk/daily-risk.component';
import { DangerRatioComponent } from './danger-ratio/danger-ratio.component';
import { HitNRunComponent } from './hit-n-run/hit-n-run.component';
import { MembersComponent } from './members/members.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'page-map', component: PageMapComponent },
  { path: 'daily-risk', component: DailyRiskComponent },
  { path: 'danger-ratio', component: DangerRatioComponent },
  { path: 'hitnrun', component: HitNRunComponent },
  { path: 'members', component: MembersComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
