import { Routes } from '@angular/router';

import { TopicsListComponent } from './topics-list/topics-list.component';
import { TopicsAddComponent } from './topics-add/topics-add.component';
import { TopicsEditComponent } from './topics-edit/topics-edit.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const TopicsRoutes: Routes = [
    { 
    	path: '',     
    	component: TopicsListComponent,
    	canActivate: [AuthGuard]
    },    { 
    	path: 'add',
    	component: TopicsAddComponent,
    	canActivate: [AuthGuard]
    },    { 
    	path: 'edit/:topicId',
    	component: TopicsEditComponent,
    	canActivate: [AuthGuard]
    },
];
