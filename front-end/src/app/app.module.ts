import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'; 
import { RouterModule } from '@angular/router';

import { SharedService } from "./frontend/services/shared.service";

/************Social Media Login Starts****************
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider} from "angularx-social-login";


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("917497774560-48jqrohaa6t378cp39me1bii01resllu.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("2266181523701724")
  },
]);
 
export function provideConfig() {
  return config;
}
***********Social Media Login Ends***************/





/*************Default Params Starts***************/

 
export function DefaultParams() {
  
  var params = {'apiBaseUrl': 'http://localhost/stories-app/api/welcome/'};
  return params;
}

/*************Default Params Ends***************/


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { FrontendSectionsModule } from './frontend-sections/frontend-sections.module';

import { AppComponent } from './app.component';

import { ShareButtonModule } from '@ngx-share/button';

import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { FrontendLayoutComponent } from './layouts/frontend-layout/frontend-layout.component';
import { ProfileLayoutComponent } from './layouts/profile-layout/profile-layout.component';
import { FacebookSharingComponent } from './facebook-sharing.component';
import { TweeterSharingComponent } from './tweeter-sharing.component';
import { LinkedInSharingComponent } from './linkedin-sharing.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    // SocialLoginModule,
    ComponentsModule,
    FrontendSectionsModule,
    RouterModule,
    AppRoutingModule,
    ShareButtonModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AdminLoginComponent,
    FrontendLayoutComponent,
    ProfileLayoutComponent,
    FacebookSharingComponent,
    TweeterSharingComponent,
    LinkedInSharingComponent,
  ],
  providers: [
      SharedService,
      // {
      //   provide: AuthServiceConfig,
      //   useFactory: provideConfig
      // }
      ],
  bootstrap: [AppComponent]
})
export class AppModule { }
