import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ForumCommentsRoutes } from './forum-comments.routing';
import { ForumCommentsPendingComponent } from './forum-comments-pending/forum-comments-pending.component';
import { ForumCommentsPublishedComponent } from './forum-comments-published/forum-comments-published.component';

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
    RouterModule.forChild(ForumCommentsRoutes),
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
    ForumCommentsPendingComponent,
    ForumCommentsPublishedComponent,
    
  ],
  providers: [
    AuthGuard
  ]
})

export class ForumCommentsModule {}
