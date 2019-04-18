import { Routes } from '@angular/router';

import { ForumListComponent } from './forum-list/forum-list.component';
import { QuestionsComponent } from './questions/questions.component';

export const ForumRoutes: Routes = [
    { 
        path: '',
        component: ForumListComponent,
    }, { 
        path: 'question/:slug',
        component: QuestionsComponent,
    },
];
