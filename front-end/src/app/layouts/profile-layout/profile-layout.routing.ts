import { Routes } from '@angular/router';

import { ProfileComponent } from '../../frontend/user/profile/profile.component';
import { 
  UserAuthGuardService as AuthGuard 
} from '../../auth/user-auth-guard.service';

export const ProfileLayoutRoutes: Routes = [
    { 
    	path: '',      
    	component: ProfileComponent,
    	canActivate: [AuthGuard]
    },
];
