import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TopicsRoutes } from './topics.routing';
import { TopicsListComponent } from './topics-list/topics-list.component';
import { TopicsAddComponent } from './topics-add/topics-add.component';
import { TopicsEditComponent } from './topics-edit/topics-edit.component';

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
    RouterModule.forChild(TopicsRoutes),
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
    TopicsListComponent,
    TopicsAddComponent,
    TopicsEditComponent,
  ],
  providers: [
    AuthGuard
  ]
})

export class TopicsModule {}
