import { Routes } from '@angular/router';

import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompaniesAddComponent } from './companies-add/companies-add.component';
import { CompaniesEditComponent } from './companies-edit/companies-edit.component';

import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const CompaniesRoutes: Routes = [
    { 
    	path: '',     
    	component: CompaniesListComponent,
    	canActivate: [AuthGuard]
    }, { 
    	path: 'add',
    	component: CompaniesAddComponent,
    	canActivate: [AuthGuard]
    }, { 
    	path: 'edit/:companyId',
    	component: CompaniesEditComponent,
    	canActivate: [AuthGuard]
    },
];
