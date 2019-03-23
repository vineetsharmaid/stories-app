import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router) {}
  canActivate(): boolean {

  	console.log('isLoggedIn', localStorage.getItem('isLoggedIn'));

    if (localStorage.getItem('isLoggedIn') && localStorage.getItem('userType') == 'admin') {
    	
    	return true;
    } else {
      
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}