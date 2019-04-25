import { Routes } from '@angular/router';

import { QuestionsPendingComponent } from './questions-pending/questions-pending.component';
import { QuestionsPublishedComponent } from './questions-published/questions-published.component';
import { StoriesViewComponent } from './questions-view/stories-view.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const QuestionsRoutes: Routes = [
    { 
    	path: '',     
        redirectTo: 'pending',
    	pathMatch: 'full',
    },
    { 
        path: 'pending',     
        component: QuestionsPendingComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'published',     
        component: QuestionsPublishedComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'view/:storyId',
        component: StoriesViewComponent,
        canActivate: [AuthGuard]
    },
];

