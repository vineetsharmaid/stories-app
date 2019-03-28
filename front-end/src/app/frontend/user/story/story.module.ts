import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { StoryRoutes } from './story.routing';

import { StoryListComponent } from './story-list/story-list.component';
import { StoryNewComponent } from './story-new/story-new.component';

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
    RouterModule.forChild(StoryRoutes),
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
    StoryListComponent,
    StoryNewComponent,
  ],
  providers: [
    
  ]
})

export class StoryModule {}
