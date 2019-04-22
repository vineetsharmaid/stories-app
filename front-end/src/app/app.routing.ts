import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { FrontendLayoutComponent } from './layouts/frontend-layout/frontend-layout.component';
import { ProfileLayoutComponent } from './layouts/profile-layout/profile-layout.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: FrontendLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/frontend-layout/frontend-layout.module#FrontendLayoutModule'
  }] }, {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }] }, {
    path: 'admin/login',
    component: AdminLoginComponent,
    children: [
        {
      path: '',
      loadChildren: './admin/admin-login/admin-login.module#AdminLoginModule'
  }] }, {
    path: 'user',
    component: ProfileLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/profile-layout/profile-layout.module#ProfileLayoutModule'
  }] }
    // { path: 'dashboard',      component: DashboardComponent },
    // { path: 'user-profile',   component: UserProfileComponent },
    // { path: 'table-list',     component: TableListComponent },
    // { path: 'typography',     component: TypographyComponent },
    // { path: 'icons',          component: IconsComponent },
    // { path: 'maps',           component: MapsComponent },
    // { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent },
    // { path: '',               redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled' })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
