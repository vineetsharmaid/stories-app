import { Component, OnInit, ElementRef } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";


import { UserService } from "../../frontend/services/user.service";

@Component({
  selector: 'frontend-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
   
	private user: SocialUser;
	private loggedIn: boolean = false;
	private authStateOnLoad: any;
	registerForm: FormGroup;
	submitted = false;

    constructor( private authService: AuthService, 
    	private formBuilder: FormBuilder, 
    	private userService: UserService,
    	private router: Router) {
   
    }

    ngOnInit(){

    	if( localStorage.getItem('isLoggedIn') == 'true' ) {

    		this.loggedIn = true;
    	}

		  (window as any).fbAsyncInit = function() {
		      FB.init({
		        appId      : '2266181523701724',
		        cookie     : true,
		        xfbml      : true,
		        version    : 'v3.1'
		      });
		      FB.AppEvents.logPageView();
		    };

		    (function(d, s, id){
		       var js, fjs = d.getElementsByTagName(s)[0];
		       if (d.getElementById(id)) {return;}
		       js = d.createElement(s); js.id = id;
		       js.src = "https://connect.facebook.net/en_US/sdk.js";
		       fjs.parentNode.insertBefore(js, fjs);
		     }(document, 'script', 'facebook-jssdk'));

    	// this.checkSocialMediaLogin();

	    this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.email]
        });
    }

		signInWithFB(){
      console.log("submit login to facebook");
      // FB.login();
      FB.login((response)=> {

        if (response.authResponse)
        {
        	console.log('authResponse',response.authResponse);

        	var userID = response.authResponse.userID;
        	/* make the API call */
					FB.api(
					    "/"+userID+"/", 
					    {
					    	fields: 'name,first_name,last_name,email,picture'
					    },
					    (response) => {
					      if (response && !response.error) {
					        /* handle the result */
					        response.photoUrl = response.picture.data.url;
					        console.log('response', response);
					        this.registerUser(response);
					      }
					    }
					);

        } else {
         
         	console.log('User login failed');
        }
      });

    }    

   //  checkSocialMediaLogin() {

   //  	this.authService.authState.subscribe((user) => {

			// this.user = user;
			// this.loggedIn = (user != null);
			// console.log('this.user', this.user);

	  //     	if (this.loggedIn) { // logged in on social account

	  //     		if ( localStorage.getItem('isLoggedIn') !== 'true' ) {
							
			// 				localStorage.setItem('isLoggedIn', 'true');

			// 				// get user details from social profile
			// 				var socialUser = this.getUserFromSocial();

			// 				// send user information for registeration
			// 				this.registerUser(socialUser);
	  //     		} else {

		 //    		// fill regiter form fields as per socail media information
		 //      		this.setSignUpForm(); 
	  //     		}
	  //     	}
	  //   });

   //  }
	
		// convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    setSignUpForm() {

    	var username = (this.user.firstName+''+this.user.lastName).toLowerCase();

    	this.registerForm.patchValue({
		  firstName: this.user.firstName, 
		  lastName: this.user.lastName,
		  username: username,
		  email: this.user.email,
		});
		console.log('this.registerForm.firstName', this.registerForm.controls.firstName);
    }

    onSubmit() {
        
        this.submitted = true;
        
        // stop here if form is invalid
        if (this.registerForm.invalid) {

        	console.log('Validation error.');
            return;
        } else {

        	var user = {  
        				firstName: this.registerForm.get('firstName').value, 
						lastName: this.registerForm.get('lastName').value,
						username: this.registerForm.get('username').value,
						email: this.registerForm.get('email').value,
						photoUrl: this.user.photoUrl
					};

        }

    }

    getUserFromSocial() {

		var username = (this.user.firstName+''+this.user.lastName).toLowerCase();
		var user = {
			firstName: this.user.firstName, 
			lastName: this.user.lastName,
			username: username,
			email: this.user.email
		};

		return user;
    }

    registerUser(user) {

        	this.userService.registerUser(user).subscribe((response: Array<Object>) => {

        		console.log('response', response);
        		if ( response['status'] == 200 ) {
        			
        			console.log('registered');
        			localStorage.setItem('isLoggedIn', 'true');
        			localStorage.setItem('userType', 'user');
        			this.loggedIn = true;
        			console.log('loggedIn', this.loggedIn);
        			// send user to login screen
	      			// this.router.navigateByUrl('/user/profile');
        		}
        	});
    }

	signInWithGoogle(): void {
		console.log('GoogleLoginProvider.PROVIDER_ID', GoogleLoginProvider.PROVIDER_ID);
		var check = this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
		console.log('here', check);
	}

	// signInWithFB(): void {
	// this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
	// }

	// signInWithLinkedIn(): void {
	// this.authService.signIn(LinkedInLoginProvider.PROVIDER_ID);
	// }



	signOut(): void {
		
		// this.authService.signOut();
		FB.getLoginStatus(function(response) {
				console.log('getLoginStatus response', response)
        if (response && response.status === 'connected') {
            FB.logout(function(response) {
								console.log('logout response', response)
								localStorage.removeItem('isLoggedIn');
								localStorage.removeItem('userType');
								this.loggedIn = false;
                document.location.reload();
            });
        }
    });

	}

	ngOnDestroy() {

		// this.signOut();
	}

}
