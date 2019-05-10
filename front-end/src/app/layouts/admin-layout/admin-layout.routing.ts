import { Routes } from '@angular/router';

import { DashboardComponent } from '../../admin/dashboard/dashboard.component';
import { UserProfileComponent } from '../../admin/user-profile/user-profile.component';
import { TableListComponent } from '../../admin/table-list/table-list.component';
import { UserListComponent } from '../../admin/user-list/user-list.component';
import { UserDetailsComponent } from '../../admin/user-details/user-details.component';
import { TypographyComponent } from '../../admin/typography/typography.component';
import { IconsComponent } from '../../admin/icons/icons.component';
import { MapsComponent } from '../../admin/maps/maps.component';
import { NotificationsComponent } from '../../admin/notifications/notifications.component';
import { UpgradeComponent } from '../../admin/upgrade/upgrade.component';
import { CategoriesComponent } from '../../admin/categories/categories.component';
import { TagsComponent } from '../../admin/tags/tags.component';
import { TopicsComponent } from '../../admin/topics/topics.component';
import { CompaniesComponent } from '../../admin/companies/companies.component';
import { StoriesComponent } from '../../admin/stories/stories.component';
import { QuestionsComponent } from '../../admin/questions/questions.component';
import { AnswersComponent } from '../../admin/answers/answers.component';
import { CommentsComponent } from '../../admin/comments/comments.component';
import { ForumCommentsComponent } from '../../admin/forum-comments/forum-comments.component';
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
    { path: 'user-profile',   component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'table-list',     component: TableListComponent, canActivate: [AuthGuard] },
    { path: 'user-list',     component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'user-list/:userId', component: UserDetailsComponent, canActivate: [AuthGuard] },
    { path: 'typography',     component: TypographyComponent, canActivate: [AuthGuard] },
    { path: 'icons',          component: IconsComponent, canActivate: [AuthGuard] },
    { path: 'maps',           component: MapsComponent, canActivate: [AuthGuard] },
    { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard] },
    { path: 'upgrade',        component: UpgradeComponent, canActivate: [AuthGuard] }, 
    // { path: 'category',        component: CategoriesComponent }, 
    {
        path: 'category',
        component: CategoriesComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/categories/categories.module#CategoriesModule'
            }
        ],
        canActivate: [AuthGuard], 
    },{
        path: 'tags',
        component: TagsComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/tags/tags.module#TagsModule'
            }
        ],
        canActivate: [AuthGuard], 
    },{
        path: 'topics',
        component: TopicsComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/topics/topics.module#TopicsModule'
            }
        ],
        canActivate: [AuthGuard], 
    },{
        path: 'companies',
        component: CompaniesComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/companies/companies.module#CompaniesModule'
            }
        ],
        canActivate: [AuthGuard], 
    },{
        path: 'stories',
        component: StoriesComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/stories/stories.module#StoriesModule'
            }
        ],
        canActivate: [AuthGuard], 
    },{
        path: 'questions',
        component: QuestionsComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/questions/questions.module#QuestionsModule'
            }
        ],
        canActivate: [AuthGuard], 
    },{
        path: 'answers',
        component: AnswersComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/answers/answers.module#AnswersModule'
            }
        ],
        canActivate: [AuthGuard], 
    },{
        path: 'comments',
        component: CommentsComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/comments/comments.module#CommentsModule'
            }
        ],
        canActivate: [AuthGuard], 
    },{
        path: 'forum-comments',
        component: ForumCommentsComponent,
        children: [
            {
              path: '',
              loadChildren: '../../admin/forum-comments/forum-comments.module#ForumCommentsModule'
            }
        ],
        canActivate: [AuthGuard], 
    },
];
