import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { PagesRoutes } from './pages.routing';
import { PagesListComponent } from './pages-list/pages-list.component';
import { PagesEditComponent } from './pages-edit/pages-edit.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatRadioModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule, 
    MatRadioModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
  ],
  declarations: [
    PagesListComponent,
    PagesEditComponent,
  ],
  providers: [
    AuthGuard
  ]
})

export class PagesModule {}
