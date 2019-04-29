import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {TimeAgoPipe} from 'time-ago-pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { FrontendLayoutRoutes } from './frontend-layout.routing';

import { HomeComponent } from '../../frontend/home/home.component';
import { ForumComponent } from '../../frontend/forum/forum.component';
import { SearchComponent } from '../../frontend/search/search.component';
import { StoriesComponent } from '../../frontend/stories/stories.component';
import { StoryDetailsComponent } from '../../frontend/story-details/story-details.component';

import { UserService } from "../../frontend/services/user.service";

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
    RouterModule.forChild(FrontendLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
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
    InfiniteScrollModule,
    ContentLoaderModule,
  ],
  declarations: [
    HomeComponent,
    ForumComponent,
    SearchComponent,
    StoriesComponent,
    StoryDetailsComponent,
    TimeAgoPipe
  ],
  providers: [
    UserService,
  ]
})

export class FrontendLayoutModule {}
