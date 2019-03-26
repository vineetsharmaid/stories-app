import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class UserAuthGuardService implements CanActivate {
  constructor(public router: Router) {}
  canActivate(): boolean {

  	console.log('UserAuthGuardService isLoggedIn', localStorage.getItem('isLoggedIn'));

    if (localStorage.getItem('isLoggedIn') && localStorage.getItem('userType') == 'user') {
    	
    	return true;
    } else {
      
      this.router.navigate(['/']);
      return false;
    }
  }
}