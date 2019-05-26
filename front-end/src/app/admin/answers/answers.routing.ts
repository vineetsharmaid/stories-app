import { Routes } from '@angular/router';

import { AnswersPendingComponent } from './answers-pending/answers-pending.component';
import { AnswersPublishedComponent } from './answers-published/answers-published.component';
import { AnswersFlaggedComponent } from './answers-flagged/answers-flagged.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const AnswersRoutes: Routes = [
    { 
    	path: '',     
        redirectTo: 'pending',
    	pathMatch: 'full',
    },
    { 
        path: 'pending',     
        component: AnswersPendingComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'published',     
        component: AnswersPublishedComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'flagged',
        component: AnswersFlaggedComponent,
        canActivate: [AuthGuard]
    },
];

