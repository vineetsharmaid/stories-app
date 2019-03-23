import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FrontendLayoutRoutes } from './frontend-layout.routing';

import { HomeComponent } from '../../frontend/home/home.component';
import { StoriesComponent } from '../../frontend/stories/stories.component';
import { StoryDetailsComponent } from '../../frontend/story-details/story-details.component';

import { UserService } from "../../frontend/services/user.service";

// import {
//   MatButtonModule,
//   MatInputModule,
//   MatRippleModule,
//   MatFormFieldModule,
//   MatTooltipModule,
//   MatSelectModule
// } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FrontendLayoutRoutes),
    FormsModule,
    // MatButtonModule,
    // MatRippleModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatSelectModule,
    // MatTooltipModule,
  ],
  declarations: [
    HomeComponent,
    StoriesComponent,
    StoryDetailsComponent,
  ],
  providers: [
    UserService,
  ]
})

export class FrontendLayoutModule {}
