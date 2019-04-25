import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuestionsRoutes } from './questions.routing';
import { QuestionsPendingComponent } from './questions-pending/questions-pending.component';
import { QuestionsPublishedComponent } from './questions-published/questions-published.component';
import { StoriesViewComponent } from './questions-view/stories-view.component';

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
    RouterModule.forChild(QuestionsRoutes),
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
    QuestionsPendingComponent,
    QuestionsPublishedComponent,
    StoriesViewComponent,
  ],
  providers: [
    AuthGuard
  ]
})

export class QuestionsModule {}
