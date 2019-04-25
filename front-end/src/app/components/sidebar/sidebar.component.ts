import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    expanded: boolean;
    children: Array<object>;
}
export const ROUTES: RouteInfo[] = [
    { path: '/admin/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', expanded: false, children: [] },
    { path: '/admin/user-profile', title: 'User Profile',  icon:'person', class: '', expanded: false, children: [] },
    { path: '/admin/user-list', title: 'User List',  icon:'content_paste', class: '', expanded: false, children: [] },
    { 
      path: '#', 
      title: 'Stories',  
      icon:'library_books', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/stories/pending', title: 'Unpublished Stories', letter:'US' },
        { path: '/admin/stories/published', title: 'Published Stories', letter:'PS' },
        { path: '/admin/category', title: 'Categories',  letter:'C' },
        { path: '/admin/tags', title: 'Tags',  letter:'T' },
      ]
    }, { 
      path: '#', 
      title: 'Stories Comments',  
      icon:'comment', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/comments/pending', title: 'Unpublished Comments', letter:'UC' },
        { path: '/admin/comments/published', title: 'Published Comments', letter:'PC' },
      ]
    }, { 
      path: '#', 
      title: 'Questions',  
      icon:'live_help', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/questions/pending', title: 'Unpublished Questions', letter:'UQ' },
        { path: '/admin/questions/published', title: 'Published Questions', letter:'PQ' },
        { path: '/admin/topics', title: 'Topics', letter:'T' },
      ]
    }, { 
      path: '#', 
      title: 'Answers',  
      icon:'question_answer', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/answers/pending', title: 'Unpublished Answers', letter:'UQ' },
        { path: '/admin/answers/published', title: 'Published Answers', letter:'PQ' },
      ]
    }, { 
      path: '#', 
      title: 'Forum Comments',  
      icon:'sms', 
      class: '',
      expanded: false,
      children: [
        { path: '/admin/forum-comments/pending', title: 'Unpublished Comments', letter:'UC' },
        { path: '/admin/forum-comments/published', title: 'Published Comments', letter:'PC' },
      ]
    },
    // { path: '/admin/questions', title: 'Questions',  icon:'question_answer', class: '', expanded: false, children: [] },
    // { path: '/admin/answers', title: 'Answers',  icon:'question_answer', class: '', expanded: false, children: [] },
    // { path: '/admin/comments', title: 'Stories Comments',  icon:'comment', class: '', expanded: false, children: [] },
    // { path: '/admin/forum-comments', title: 'Forum Comments',  icon:'sms', class: '', expanded: false, children: [] },
    // { path: '/admin/category', title: 'Categories',  icon:'layers', class: '', expanded: false, children: [] },
    // { path: '/admin/tags', title: 'Tags',  icon:'more', class: '', expanded: false, children: [] },
    // { path: '/admin/topics', title: 'Topics',  icon:'whatshot', class: '', expanded: false, children: [] },
    // { path: '/admin/table-list', title: 'Table List',  icon:'content_paste', class: '', expanded: false, children: [] },
    // { path: '/admin/typography', title: 'Typography',  icon:'library_books', class: '', expanded: false, children: [] },
    // { path: '/admin/icons', title: 'Icons',  icon:'bubble_chart', class: '', expanded: false, children: [] },
    // { path: '/admin/maps', title: 'Maps',  icon:'location_on', class: '', expanded: false, children: [] },
    // { path: '/admin/notifications', title: 'Notifications',  icon:'notifications', class: '', expanded: false, children: [] },  
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
