import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoriesRoutes } from './stories.routing';
import { StoriesPendingComponent } from './stories-pending/stories-pending.component';
import { StoriesPublishedComponent } from './stories-published/stories-published.component';
import { StoriesViewComponent } from './stories-view/stories-view.component';
import { StoriesFlaggedComponent } from './stories-flagged/stories-flagged.component';

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
    RouterModule.forChild(StoriesRoutes),
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
    StoriesPendingComponent,
    StoriesPublishedComponent,
    StoriesViewComponent,
    StoriesFlaggedComponent,
  ],
  providers: [
    AuthGuard
  ]
})

export class StoriesModule {}
