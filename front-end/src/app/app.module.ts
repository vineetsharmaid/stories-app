import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'; 
import { RouterModule } from '@angular/router';


/************Social Media Login Starts****************/
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
  // {
  //   id: LinkedInLoginProvider.PROVIDER_ID,
  //   provider: new LinkedInLoginProvider("LinkedIn-client-Id", false, 'en_US')
  // }
]);
 
export function provideConfig() {
  return config;
}
/*************Social Media Login Ends***************/





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

// import { DashboardComponent } from './dashboard/dashboard.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';
// import { TableListComponent } from './table-list/table-list.component';
// import { TypographyComponent } from './typography/typography.component';
// import { IconsComponent } from './icons/icons.component';
// import { MapsComponent } from './maps/maps.component';
// import { NotificationsComponent } from './notifications/notifications.component';
// import { UpgradeComponent } from './upgrade/upgrade.component';


import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { FrontendLayoutComponent } from './layouts/frontend-layout/frontend-layout.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    SocialLoginModule,
    ComponentsModule,
    FrontendSectionsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AdminLoginComponent,
    FrontendLayoutComponent,
  ],
  providers: [
      {
        provide: AuthServiceConfig,
        useFactory: provideConfig
      }
      ],
  bootstrap: [AppComponent]
})
export class AppModule { }
