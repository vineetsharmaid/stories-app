import { Routes } from '@angular/router';

import { HomeComponent } from '../../frontend/home/home.component';
import { ForumComponent } from '../../frontend/forum/forum.component';
import { SearchComponent } from '../../frontend/search/search.component';
import { StoriesComponent } from '../../frontend/stories/stories.component';
import { StoryDetailsComponent } from '../../frontend/story-details/story-details.component';
import { AboutComponent } from '../../frontend/static-pages/about/about.component';
import { TeamComponent } from '../../frontend/static-pages/team/team.component';
import { PrivacyPolicyComponent } from '../../frontend/static-pages/privacy-policy/privacy-policy.component';
import { PartnerComponent } from '../../frontend/static-pages/partner/partner.component';
import { ContactComponent } from '../../frontend/static-pages/contact/contact.component';

export const FrontendLayoutRoutes: Routes = [
    { path: '',      component: HomeComponent },
    { path: 'search',      component: SearchComponent },
    { path: 'stories',     component: StoriesComponent },
    { path: 'about',     component: AboutComponent },
    { path: 'team',     component: TeamComponent },
    { path: 'privacy-policy',     component: PrivacyPolicyComponent },
    { path: 'terms-and-conditions',     component: PrivacyPolicyComponent },
    { path: 'partner',     component: PartnerComponent },
    { path: 'contact',     component: ContactComponent },
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
