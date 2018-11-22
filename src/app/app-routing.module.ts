import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageMapComponent } from './page-map/page-map.component';
import { InjuredLevelComponent } from './injured-level/injured-level.component';
import { HitNRunComponent } from './hit-n-run/hit-n-run.component';
import { MembersComponent } from './members/members.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'page-map', component: PageMapComponent },
  { path: 'injured', component: InjuredLevelComponent },
  { path: 'hitnrun', component: HitNRunComponent },
  { path: 'members', component: MembersComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
