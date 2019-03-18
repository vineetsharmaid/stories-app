import { Routes } from '@angular/router';

import { HomeComponent } from '../../frontend/home/home.component';

export const FrontendLayoutRoutes: Routes = [
    { path: '',      component: HomeComponent },
    { path: 'stories',      component: HomeComponent },
];
