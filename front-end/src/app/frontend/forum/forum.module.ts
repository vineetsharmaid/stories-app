import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { ForumRoutes } from './forum.routing';
import { QuillModule } from 'ngx-quill'

import { ForumListComponent } from './forum-list/forum-list.component';
import { QuestionsComponent } from './questions/questions.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatIconModule,
  MatChipsModule,
  MatCardModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ForumRoutes),
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
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    InfiniteScrollModule,
    ContentLoaderModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    QuillModule.forRoot(),
  ],
  declarations: [
    ForumListComponent,
    QuestionsComponent,    
  ],
  providers: [
  ]
})

export class ForumModule {}
