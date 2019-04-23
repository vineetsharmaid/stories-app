import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/admin/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/admin/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/admin/user-list', title: 'User List',  icon:'content_paste', class: '' },
    { path: '/admin/stories', title: 'Stories',  icon:'library_books', class: '' },
    { path: '/admin/comments', title: 'Stories Comments',  icon:'comment', class: '' },
    { path: '/admin/forum-comments', title: 'Forum Comments',  icon:'sms', class: '' },
    { path: '/admin/category', title: 'Categories',  icon:'layers', class: '' },
    { path: '/admin/tags', title: 'Tags',  icon:'more', class: '' },
    { path: '/admin/topics', title: 'Topics',  icon:'whatshot', class: '' },
    // { path: '/admin/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/admin/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/admin/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/admin/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/admin/notifications', title: 'Notifications',  icon:'notifications', class: '' },  
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  logout() {

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('jwtToken');
    this.router.navigateByUrl('/admin/login');
  }
}
