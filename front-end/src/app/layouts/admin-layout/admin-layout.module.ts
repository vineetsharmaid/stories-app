import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';


import { DashboardComponent } from '../../admin/dashboard/dashboard.component';
import { UserProfileComponent } from '../../admin/user-profile/user-profile.component';
import { TableListComponent } from '../../admin/table-list/table-list.component';
import { TypographyComponent } from '../../admin/typography/typography.component';
import { IconsComponent } from '../../admin/icons/icons.component';
import { MapsComponent } from '../../admin/maps/maps.component';
import { NotificationsComponent } from '../../admin/notifications/notifications.component';
import { UpgradeComponent } from '../../admin/upgrade/upgrade.component';
import { UserListComponent } from '../../admin/user-list/user-list.component';
import { CategoriesComponent } from '../../admin/categories/categories.component';
import { StoriesComponent } from '../../admin/stories/stories.component';

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
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    UserListComponent,
    CategoriesComponent,
    StoriesComponent,
  ],
  providers: [
    AuthGuard,
    UserService
  ]
})

export class AdminLayoutModule {}
