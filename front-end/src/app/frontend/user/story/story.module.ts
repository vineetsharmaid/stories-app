import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { StoryRoutes } from './story.routing';

import { StoryListComponent } from './story-list/story-list.component';
import { StoryNewComponent } from './story-new/story-new.component';
import { StoryEditComponent } from './story-edit/story-edit.component';
import { StoryStatsComponent } from './story-stats/story-stats.component';

import { StoryService } from '../../services/story.service';

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
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    ContentLoaderModule,
  ],
  declarations: [
    StoryListComponent,
    StoryNewComponent,
    StoryEditComponent,
    StoryStatsComponent,
  ],
  providers: [
    StoryService    
  ]
})

export class StoryModule {}
