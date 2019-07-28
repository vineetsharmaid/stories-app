import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GoTopButtonModule } from 'ng2-go-top-button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    GoTopButtonModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
  ]
})
export class FrontendSectionsModule { }