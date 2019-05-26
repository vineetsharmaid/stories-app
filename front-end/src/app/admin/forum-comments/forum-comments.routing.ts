import { Routes } from '@angular/router';

import { ForumCommentsPendingComponent } from './forum-comments-pending/forum-comments-pending.component';
import { ForumCommentsPublishedComponent } from './forum-comments-published/forum-comments-published.component';
import { ForumCommentsFlaggedComponent } from './forum-comments-flagged/forum-comments-flagged.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const ForumCommentsRoutes: Routes = [
    { 
    	path: '',     
        redirectTo: 'pending',
    	pathMatch: 'full',
    },
    { 
        path: 'pending',     
        component: ForumCommentsPendingComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'published',     
        component: ForumCommentsPublishedComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'flagged',     
        component: ForumCommentsFlaggedComponent,
        canActivate: [AuthGuard]
    },
];
