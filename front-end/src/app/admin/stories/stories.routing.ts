import { Routes } from '@angular/router';

import { StoriesPendingComponent } from './stories-pending/stories-pending.component';
import { StoriesPublishedComponent } from './stories-published/stories-published.component';
import { StoriesViewComponent } from './stories-view/stories-view.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const StoriesRoutes: Routes = [
    { 
    	path: '',     
        redirectTo: 'pending',
    	pathMatch: 'full',
    },
    { 
        path: 'pending',     
        component: StoriesPendingComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'published',     
        component: StoriesPublishedComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'view/:storyId',
        component: StoriesViewComponent,
        canActivate: [AuthGuard]
    },
];
