import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommentsRoutes } from './comments.routing';
import { CommentsPendingComponent } from './comments-pending/comments-pending.component';
import { CommentsPublishedComponent } from './comments-published/comments-published.component';
import { CommentsViewComponent } from './comments-view/comments-view.component';

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
  MatRadioModule,
  MatCheckboxModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CommentsRoutes),
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
    MatCheckboxModule,   
  ],
  declarations: [
    CommentsPendingComponent,
    CommentsPublishedComponent,
    CommentsViewComponent,
  ],
  providers: [
    AuthGuard
  ]
})

export class CommentsModule {}
