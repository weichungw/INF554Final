import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';

@NgModule({
  imports:[ MatToolbarModule,
          MatIconModule,
          MatButtonModule ],
  exports:[ MatToolbarModule,
          MatIconModule,
          MatButtonModule],
})

export class MaterialModule{}
