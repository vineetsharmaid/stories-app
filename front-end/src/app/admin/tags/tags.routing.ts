import { Routes } from '@angular/router';

import { TagsListComponent } from './tags-list/tags-list.component';
import { TagsAddComponent } from './tags-add/tags-add.component';
import { TagsEditComponent } from './tags-edit/tags-edit.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const TagsRoutes: Routes = [
    { 
    	path: '',     
    	component: TagsListComponent,
    	canActivate: [AuthGuard]
    },    { 
    	path: 'add',
    	component: TagsAddComponent,
    	canActivate: [AuthGuard]
    },    { 
    	path: 'edit/:tagID',
    	component: TagsEditComponent,
    	canActivate: [AuthGuard]
    },
];
