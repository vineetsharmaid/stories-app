import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';


import { DashboardComponent } from '../../admin/dashboard/dashboard.component';
import { UserProfileComponent } from '../../admin/user-profile/user-profile.component';
import { UserDetailsComponent } from '../../admin/user-details/user-details.component';
import { TableListComponent } from '../../admin/table-list/table-list.component';
import { TypographyComponent } from '../../admin/typography/typography.component';
import { IconsComponent } from '../../admin/icons/icons.component';
import { MapsComponent } from '../../admin/maps/maps.component';
import { NotificationsComponent } from '../../admin/notifications/notifications.component';
import { UpgradeComponent } from '../../admin/upgrade/upgrade.component';
import { UserListComponent } from '../../admin/user-list/user-list.component';
import { CategoriesComponent } from '../../admin/categories/categories.component';
import { TagsComponent } from '../../admin/tags/tags.component';
import { TopicsComponent } from '../../admin/topics/topics.component';
import { CompaniesComponent } from '../../admin/companies/companies.component';
import { StoriesComponent } from '../../admin/stories/stories.component';
import { SubscribersComponent } from '../../admin/subscribers/subscribers.component';
import { QuestionsComponent } from '../../admin/questions/questions.component';
import { AnswersComponent } from '../../admin/answers/answers.component';
import { CommentsComponent } from '../../admin/comments/comments.component';
import { ForumCommentsComponent } from '../../admin/forum-comments/forum-comments.component';
import { PagesComponent } from '../../admin/pages/pages.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';
import { UserService } from "../../services/admin/user.service";

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    UserDetailsComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    UserListComponent,
    CategoriesComponent,
    TagsComponent,
    TopicsComponent,
    CompaniesComponent,
    StoriesComponent,
    SubscribersComponent,
    QuestionsComponent,
    AnswersComponent,
    CommentsComponent,
    ForumCommentsComponent,
    PagesComponent,
  ],
  providers: [
    AuthGuard,
    UserService
  ]
})

export class AdminLayoutModule {}
