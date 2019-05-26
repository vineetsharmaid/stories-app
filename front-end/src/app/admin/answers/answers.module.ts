import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AnswersRoutes } from './answers.routing';
import { AnswersPendingComponent } from './answers-pending/answers-pending.component';
import { AnswersPublishedComponent } from './answers-published/answers-published.component';
import { AnswersFlaggedComponent } from './answers-flagged/answers-flagged.component';

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
    RouterModule.forChild(AnswersRoutes),
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
    AnswersPendingComponent,
    AnswersPublishedComponent,
    AnswersFlaggedComponent,
  ],
  providers: [
    AuthGuard
  ]
})

export class AnswersModule {}
