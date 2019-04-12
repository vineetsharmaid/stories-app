import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TagsRoutes } from './tags.routing';
import { TagsListComponent } from './tags-list/tags-list.component';
import { TagsAddComponent } from './tags-add/tags-add.component';
import { TagsEditComponent } from './tags-edit/tags-edit.component';

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
    RouterModule.forChild(TagsRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule, 
    MatRadioModule   
  ],
  declarations: [
    TagsListComponent,
    TagsAddComponent,
    TagsEditComponent,
  ],
  providers: [
    AuthGuard
  ]
})

export class TagsModule {}
