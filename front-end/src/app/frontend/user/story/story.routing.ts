import { Routes } from '@angular/router';

import { StoryListComponent } from './story-list/story-list.component';
import { StoryNewComponent } from './story-new/story-new.component';

export const StoryRoutes: Routes = [
    { 
        path: '',
        component: StoryListComponent,
    }, { 
        path: 'list',
        component: StoryListComponent,
    }, { 
        path: 'new',
        component: StoryNewComponent,
    },
];
