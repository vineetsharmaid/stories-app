import { Routes } from '@angular/router';

import { ForumListComponent } from './forum-list/forum-list.component';
import { StoryNewComponent } from './story-new/story-new.component';
import { StoryEditComponent } from './story-edit/story-edit.component';

export const ForumRoutes: Routes = [
    { 
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
    }, { 
        path: 'list',
        component: ForumListComponent,
    }, { 
        path: 'list/:viewType',
        component: ForumListComponent,
    }, { 
        path: 'new',
        component: StoryNewComponent,
    }, { 
        path: 'edit/:storyId',
        component: StoryEditComponent,
    },
];
