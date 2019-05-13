import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router) {}
  canActivate(): boolean {

    if (localStorage.getItem('isLoggedIn') && (localStorage.getItem('userType') == 'admin' || localStorage.getItem('userType') == 'superadmin') ) {
    	
    	return true;
    } else {
      
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}