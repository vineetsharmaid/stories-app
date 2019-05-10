import { Routes } from '@angular/router';

import { CommentsPendingComponent } from './comments-pending/comments-pending.component';
import { CommentsPublishedComponent } from './comments-published/comments-published.component';
// import { CommentsViewComponent } from './comments-view/comments-view.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const CommentsRoutes: Routes = [
    { 
    	path: '',     
        redirectTo: 'pending',
    	pathMatch: 'full',
    },
    { 
        path: 'pending',     
        component: CommentsPendingComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'published',     
        component: CommentsPublishedComponent,
        canActivate: [AuthGuard]
    },
    // { 
    //     path: 'view/:storyId',
    //     component: CommentsViewComponent,
    //     canActivate: [AuthGuard]
    // },
];
