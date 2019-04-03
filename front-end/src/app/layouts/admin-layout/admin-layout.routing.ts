import { Routes } from '@angular/router';

import { DashboardComponent } from '../../admin/dashboard/dashboard.component';
import { UserProfileComponent } from '../../admin/user-profile/user-profile.component';
import { TableListComponent } from '../../admin/table-list/table-list.component';
import { UserListComponent } from '../../admin/user-list/user-list.component';
import { TypographyComponent } from '../../admin/typography/typography.component';
import { IconsComponent } from '../../admin/icons/icons.component';
import { MapsComponent } from '../../admin/maps/maps.component';
import { NotificationsComponent } from '../../admin/notifications/notifications.component';
import { UpgradeComponent } from '../../admin/upgrade/upgrade.component';
import { CategoriesComponent } from '../../admin/categories/categories.component';
import { StoriesComponent } from '../../admin/stories/stories.component';
import { 
  AuthGuardService as AuthGuard 
} from '../../auth/auth-guard.service';

export const AdminLayoutRoutes: Routes = [
    { path: '',      redirectTo: 'dashboard' },
    { 
    	path: 'dashboard',      
    	component: DashboardComponent,
    	canActivate: [AuthGuard],
        data : {title : 'Dashboard'}
    },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'user-list',     component: UserListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent }, 
    // { path: 'category',        component: CategoriesComponent }, 
    {
        path: 'category',
        component: CategoriesComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/categories/categories.module#CategoriesModule'
            }
        ] 
    },{
        path: 'stories',
        component: StoriesComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/stories/stories.module#StoriesModule'
            }
        ] 
    },
];
