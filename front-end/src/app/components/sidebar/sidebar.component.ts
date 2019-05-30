import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    access: Array<string>;
    expanded: boolean;
    children: Array<object>;
}
export const ROUTES: RouteInfo[] = [
    { path: '/admin/dashboard', title: 'Dashboard', access: ['admin', 'superadmin'], icon: 'dashboard', class: '', expanded: false, children: [] },
    // { path: '/admin/user-profile', title: 'User Profile', access: ['admin', 'superadmin'],  icon:'person', class: '', expanded: false, children: [] },
    { path: '/admin/user-list', title: 'User List', access: ['admin', 'superadmin'],  icon:'content_paste', class: '', expanded: false, children: [] },
    { path: '/admin/companies', title: 'Companies', access: ['admin', 'superadmin'], icon:'content_paste', class: '', expanded: false, children: [] },
    { path: '/admin/pages', title: 'Pages', access: ['superadmin'], icon:'content_paste', class: '', expanded: false, children: [] },
    { 
      path: '#', 
      title: 'Stories', access: ['admin', 'superadmin'], 
      icon:'library_books', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/stories/pending', title: 'Unpublished Stories', access: ['admin', 'superadmin'], letter:'US' },
        { path: '/admin/stories/published', title: 'Published Stories', access: ['admin', 'superadmin'], letter:'PS' },
        { path: '/admin/stories/flagged', title: 'Flagged Stories', access: ['admin', 'superadmin'], letter:'FS' },
        // { path: '/admin/category', title: 'Categories', access: ['admin', 'superadmin'], letter:'C' },
        { path: '/admin/tags', title: 'Tags', access: ['admin', 'superadmin'], letter:'T' },
      ]
    }, { 
      path: '#', 
      title: 'Stories Comments', access: ['admin', 'superadmin'],  
      icon:'comment', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/comments/pending', title: 'Unpublished Comments', access: ['admin', 'superadmin'], letter:'UC' },
        { path: '/admin/comments/published', title: 'Published Comments', access: ['admin', 'superadmin'], letter:'PC' },
      ]
    }, { 
      path: '#', 
      title: 'Questions', access: ['admin', 'superadmin'], 
      icon:'live_help', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/questions/pending', title: 'Unpublished Questions', access: ['admin', 'superadmin'], letter:'UQ' },
        { path: '/admin/questions/published', title: 'Published Questions', access: ['admin', 'superadmin'], letter:'PQ' },
        { path: '/admin/topics', title: 'Topics', access: ['admin', 'superadmin'], letter:'T' },
      ]
    }, { 
      path: '#', 
      title: 'Answers', access: ['admin', 'superadmin'], 
      icon:'question_answer', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/answers/pending', title: 'Unpublished Answers', access: ['admin', 'superadmin'], letter:'UA' },
        { path: '/admin/answers/published', title: 'Published Answers', access: ['admin', 'superadmin'], letter:'PA' },
        { path: '/admin/answers/flagged', title: 'Flagged Answers', access: ['admin', 'superadmin'], letter:'FA' },
      ]
    }, { 
      path: '#', 
      title: 'Forum Comments', access: ['admin', 'superadmin'],  
      icon:'sms', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/forum-comments/pending', title: 'Unpublished Comments', access: ['admin', 'superadmin'], letter:'UC' },
        { path: '/admin/forum-comments/published', title: 'Published Comments', access: ['admin', 'superadmin'], letter:'PC' },
        { path: '/admin/forum-comments/flagged', title: 'Flagged Comments', access: ['admin', 'superadmin'], letter:'FC' },
      ]
    },
    
    // { path: '/admin/table-list', title: 'Table List', access: ['admin', 'superadmin'],  icon:'content_paste', class: '', expanded: false, children: [] },
    // { path: '/admin/typography', title: 'Typography', access: ['admin', 'superadmin'], icon:'library_books', class: '', expanded: false, children: [] },
    // { path: '/admin/icons', title: 'Icons', access: ['admin', 'superadmin'], icon:'bubble_chart', class: '', expanded: false, children: [] },
    // { path: '/admin/maps', title: 'Maps', access: ['admin', 'superadmin'], icon:'location_on', class: '', expanded: false, children: [] },
    // { path: '/admin/notifications', title: 'Notifications', access: ['admin', 'superadmin'], icon:'notifications', class: '', expanded: false, children: [] },  
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
    var userType = localStorage.getItem('userType');
    this.menuItems = ROUTES.filter(menuItem => {
      
      return menuItem.access.includes(userType);
    });
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
