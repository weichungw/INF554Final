import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material
import { MaterialModule } from './material';

// My components
import { HomeComponent } from './home/home.component';
import { PageMapComponent } from './page-map/page-map.component';
import { InjuredLevelComponent } from './injured-level/injured-level.component';
import { HitNRunComponent } from './hit-n-run/hit-n-run.component';
import { MembersComponent } from './members/members.component';

@NgModule({
  declarations: [
    AppComponent,
    PageMapComponent,
    InjuredLevelComponent,
    HitNRunComponent,
    HomeComponent,
    MembersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
