import { Routes } from '@angular/router';

import { HomeComponent } from '../../frontend/home/home.component';
import { ForumComponent } from '../../frontend/forum/forum.component';
import { SearchComponent } from '../../frontend/search/search.component';
import { StoriesComponent } from '../../frontend/stories/stories.component';
import { StoryDetailsComponent } from '../../frontend/story-details/story-details.component';

export const FrontendLayoutRoutes: Routes = [
    { path: '',      component: HomeComponent },
    { path: 'search',      component: SearchComponent },
    { path: 'stories',     component: StoriesComponent },
    { path: 'story/:slug', component: StoryDetailsComponent },
    {
	    path: 'forum',
	    component: ForumComponent,
	    children: [
	        {
	      path: '',
	      loadChildren: '../../frontend/forum/forum.module#ForumModule'
	  	}],
	},
];
