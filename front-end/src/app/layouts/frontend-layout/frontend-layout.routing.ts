import { Routes } from '@angular/router';

import { HomeComponent } from '../../frontend/home/home.component';
import { SearchComponent } from '../../frontend/search/search.component';
import { StoriesComponent } from '../../frontend/stories/stories.component';
import { StoryDetailsComponent } from '../../frontend/story-details/story-details.component';

export const FrontendLayoutRoutes: Routes = [
    { path: '',      component: HomeComponent },
    { path: 'stories',      component: StoriesComponent },
    { path: 'search',      component: SearchComponent },
    { path: 'story/:slug',      component: StoryDetailsComponent },
];
