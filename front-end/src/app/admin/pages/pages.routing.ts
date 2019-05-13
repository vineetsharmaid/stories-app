import { Routes } from '@angular/router';

import { PagesListComponent } from './pages-list/pages-list.component';
import { PagesEditComponent } from './pages-edit/pages-edit.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const PagesRoutes: Routes = [
    { 
    	path: '',     
    	component: PagesListComponent,
    	canActivate: [AuthGuard]
    },   { 
    	path: 'edit/:pageID',
    	component: PagesEditComponent,
    	canActivate: [AuthGuard]
    },
];
