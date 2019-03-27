import { Routes } from '@angular/router';

import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryAddComponent } from './category-add/category-add.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const CategoriesRoutes: Routes = [
    { 
    	path: '',     
    	component: CategoryListComponent,
    	canActivate: [AuthGuard]
    },    { 
    	path: 'add',
    	component: CategoryAddComponent,
    	canActivate: [AuthGuard]
    },
];
