import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {TimeAgoPipe} from 'time-ago-pipe';
import { ShareButtonModule } from '@ngx-share/button';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { FrontendLayoutRoutes } from './frontend-layout.routing';
import { SafeHtmlPipe } from '../../pipes/safehtml.pipes';

import { HomeComponent } from '../../frontend/home/home.component';
import { ForumComponent } from '../../frontend/forum/forum.component';
import { SearchComponent } from '../../frontend/search/search.component';
import { StoriesComponent } from '../../frontend/stories/stories.component';
import { StoryDetailsComponent } from '../../frontend/story-details/story-details.component';
import { AuthorProfileComponent } from '../../frontend/author-profile/author-profile.component';

import { AboutComponent } from '../../frontend/static-pages/about/about.component';
import { TeamComponent } from '../../frontend/static-pages/team/team.component';
import { PrivacyPolicyComponent } from '../../frontend/static-pages/privacy-policy/privacy-policy.component';
import { PartnerComponent } from '../../frontend/static-pages/partner/partner.component';
import { CompaniesComponent } from '../../frontend/static-pages/companies/companies.component';
import { TermsAndConditionsComponent } from '../../frontend/static-pages/terms-and-conditions/terms-and-conditions.component';
import { ContactComponent } from '../../frontend/static-pages/contact/contact.component';

import { UserService } from "../../frontend/services/user.service";

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatIconModule,
  MatChipsModule,
  MatCardModule,
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FrontendLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    ShareButtonModule,
    InfiniteScrollModule,
    ContentLoaderModule,
  ],
  declarations: [
    HomeComponent,
    SafeHtmlPipe,
    ForumComponent,
    SearchComponent,
    StoriesComponent,
    StoryDetailsComponent,
    AuthorProfileComponent,
    AboutComponent,
    TeamComponent,
    PrivacyPolicyComponent,
    PartnerComponent,
    CompaniesComponent,
    TermsAndConditionsComponent,
    ContactComponent,
    TimeAgoPipe
  ],
  providers: [
    UserService,
  ]
})

export class FrontendLayoutModule {}
