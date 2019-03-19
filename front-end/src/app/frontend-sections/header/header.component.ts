import { Component, OnInit, ElementRef } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
	registerForm: FormGroup;
	submitted = false;

    constructor(private authService: AuthService, private formBuilder: FormBuilder) {
   
    }

    ngOnInit(){
     	
		this.authService.authState.subscribe((user) => {
	      this.user = user;
	      this.loggedIn = (user != null);
	    });

	    this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
	
	// convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        
        this.submitted = true;
        
        // stop here if form is invalid
        if (this.registerForm.invalid) {

        	console.log('Validation error.');
            return;
        } else {

        	console.log('Registeration form submitted');
        }

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
