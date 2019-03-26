import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileLayoutRoutes } from './profile-layout.routing';

import { ProfileComponent } from '../../frontend/user/profile/profile.component';
import { UserService } from "../../frontend/services/user.service";
import { 
  UserAuthGuardService as AuthGuard 
} from '../../auth/user-auth-guard.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileLayoutRoutes),
    FormsModule,
  ],
  declarations: [
    ProfileComponent,
  ],
  providers: [
    UserService,
    AuthGuard
  ]
})

export class ProfileLayoutModule {}
