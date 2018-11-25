import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// material
import { MaterialModule } from './material';

// My components
import { HomeComponent } from './home/home.component';
import { PageMapComponent } from './page-map/page-map.component';
import { HitNRunComponent } from './hit-n-run/hit-n-run.component';
import { MembersComponent } from './members/members.component';
import { DailyRiskComponent } from './daily-risk/daily-risk.component';
import { DangerRatioComponent } from './danger-ratio/danger-ratio.component';

@NgModule({
  declarations: [
    AppComponent,
    PageMapComponent,
    HitNRunComponent,
    HomeComponent,
    MembersComponent,
    DailyRiskComponent,
    DangerRatioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
