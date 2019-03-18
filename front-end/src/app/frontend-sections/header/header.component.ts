import { Component, OnInit, ElementRef } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

@Component({
  selector: 'frontend-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   
	private user: SocialUser;
	private loggedIn: boolean;

    constructor(private authService: AuthService) {
   
    }

    ngOnInit(){
     	
		this.authService.authState.subscribe((user) => {
	      this.user = user;
	      this.loggedIn = (user != null);
	    });
    }


	signInWithGoogle(): void {
		console.log('GoogleLoginProvider.PROVIDER_ID', GoogleLoginProvider.PROVIDER_ID);
		var check = this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
		console.log('here', check);
	}

	signInWithFB(): void {
	this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
	}

	// signInWithLinkedIn(): void {
	// this.authService.signIn(LinkedInLoginProvider.PROVIDER_ID);
	// }  

	signOut(): void {
		this.authService.signOut();
	}

}
