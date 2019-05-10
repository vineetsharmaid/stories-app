import { Routes } from '@angular/router';

import { ProfileComponent } from '../../frontend/user/profile/profile.component';
import { StoryComponent } from '../../frontend/user/story/story.component';
import { ForumComponent } from '../../frontend/user/forum/forum.component';
import { PointsComponent } from '../../frontend/user/points/points.component';


import { 
  UserAuthGuardService as AuthGuard 
} from '../../auth/user-auth-guard.service';

export const ProfileLayoutRoutes: Routes = [
    { 
    	path: '',      
    	component: ProfileComponent,
    	canActivate: [AuthGuard]
    }, {
	    path: 'story',
	    component: StoryComponent,
	    children: [
	        {
	      path: '',
	      loadChildren: '../../frontend/user/story/story.module#StoryModule'
	  	}],
    	canActivate: [AuthGuard]
	}, {
	    path: 'forum',
	    component: ForumComponent,
	    children: [
	        {
	      path: '',
	      loadChildren: '../../frontend/user/forum/forum.module#ForumModule'
	  	}],
    	canActivate: [AuthGuard]
	}, {
		path: 'points',
		component: PointsComponent,
    canActivate: [AuthGuard]
	}
];
