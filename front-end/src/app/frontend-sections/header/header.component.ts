import { Component, OnInit, ElementRef, ErrorHandler, Injectable, Injector, NgZone, ViewChild } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare const gapi: any;
declare const FB: any;

import { UserService } from "../../frontend/services/user.service";
import { UserValidators } from '../../frontend/services/validators/user.validator';

@Component({
  selector: 'frontend-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})



export class HeaderComponent implements OnInit {
   
  public auth2: any;

	public submitted:boolean = false;
	private loggedIn: boolean = false;
	private loginLoading: boolean = false;
	public loginSubmitted:boolean = false;
	private registerLoading: boolean = false;
	private accountAlreadyExists: boolean = false;
	
	public registerForm: FormGroup;
	public loginForm: FormGroup;
	private loginErrors: Array<string>;

	@ViewChild('closeLoginModal') closeLoginModal: ElementRef;
	@ViewChild('showHideLoginBtn') showHideLoginBtn: ElementRef;
	@ViewChild('googleLoginBtn') googleLoginBtn: ElementRef;
	@ViewChild('googleLoginBtn2') googleLoginBtn2: ElementRef;

  constructor(
  	private formBuilder: FormBuilder, 
  	private userService: UserService,
  	private router: Router,
  	private injector: Injector,
  	private userValidators: UserValidators ) {
 
  }

  ngOnInit(){

  	if( localStorage.getItem('isLoggedIn') == 'true' ) {

  		this.loggedIn = true;
  	}

  	this.loadFacebookSDK();

    this.registerForm = this.formBuilder.group({
          firstName: [ '', Validators.required ],
          lastName: [ '', Validators.required ],
          username: [ 
	          '', // default value
	          {
	          	validators: Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9_]*")]),  // sync validations
	           	asyncValidators: this.userValidators.usernameValidator(), // async validations
	           	updateOn: 'blur' 
	         },
          ],
          email: [ '',  Validators.compose([Validators.required, Validators.email]) ]
      });

    this.loginForm = this.formBuilder.group({
          email: [ '',  Validators.compose([Validators.required, Validators.email]) ],
          password: [ '',  Validators.required ]
      });
  }

	// convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  get lf() { return this.loginForm.controls; }

  /**** User registration form handling ****/
  onSubmit() {
      
      this.submitted = true;
      
      console.log('Validation', this.registerForm);
      console.log('Validation.invalid', this.registerForm.invalid);

      // stop here if form is invalid
      if (this.registerForm.status === "VALID") {

      	var user = {  
      		first_name: this.registerForm.get('firstName').value, 
					last_name: this.registerForm.get('lastName').value,
					username: this.registerForm.get('username').value,
					email: this.registerForm.get('email').value,
				};

				this.registerUser(user);
      } else {

      	console.log('Validation error.');
        return;
      }

  }

  /**** User login form handling ****/
  onLoginSubmit() {
      
      this.loginSubmitted = true;
      
      // stop here if form is invalid
      if (this.loginForm.invalid) {

      	console.log('Validation error.');
        return;
      } else {

      	var user = {        		
					email: this.loginForm.get('email').value,
					password: this.loginForm.get('password').value,
				};

				this.loginLoading = true;
				this.loginUser(user);

      }

  }

  registerUser(user) {
  	console.log('user', user);
  	this.userService.registerUser(user).subscribe((response: Array<Object>) => {

  		console.log('register response', response);

  		if ( response['status'] == 200 || user.loginBy == 'facebook' || user.loginBy == 'google' ) {
  			
  			console.log('registered');
  			
  			// Close login modal
  			this.closeLoginModal.nativeElement.click();
				
  			// set user login
				this.setUserLogin();
  			console.log('loggedIn', this.loggedIn);
  		}

  		// user already exists
  		if ( response['status'] == 201 ) {
  			
  			this.accountAlreadyExists = true;
  			this.showHideLoginBtn.nativeElement.click();
  			// this.setUserLogin();
  		}

  	});
  }

  loginUser(user) {

  	this.userService.loginUser(user).subscribe((response: Array<Object>) => {

  		console.log('register response', response);
  		this.loginLoading = false;

  		if ( response['status'] == 200 ) {
  			
  			console.log('logged in');

  			// Close login modal
  			this.closeLoginModal.nativeElement.click();
				
  			// set user login
				this.setUserLogin();
  			console.log('loggedIn', this.loggedIn);

  		}

  		if ( response['status'] == 201 ) {
  			
  			this.loginErrors = response['error'];
  		}

  	});
  }

  setUserLogin() {

		// set login
		localStorage.setItem('isLoggedIn', 'true');
		localStorage.setItem('userType', 'user');
		this.loggedIn = true;

		this.navigate('/user');
  }

	// common function for redirecting to different module
  navigate(path) {
	  
    const routerService = this.injector.get(Router);
    const ngZone = this.injector.get(NgZone);
    ngZone.run(() => {
      routerService.navigate([path]);
    });  	
  	
  }

	ngOnDestroy() {
	}
	

	/*
	*
	*
	* FACEBOOK LOGIN FUNCTIONS
	*
	*
	**/ 

	loadFacebookSDK() {

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
	}

	signInWithFB(){
    console.log("submit login to facebook");
    // FB.login();
    FB.login((response)=> {

      if (response.authResponse)
      {
      	console.log('authResponse',response.authResponse);

      	var userID = response.authResponse.userID;
      	
      	/* get user details from facebook */
				FB.api(
				    "/"+userID+"/", 
				    {
				    	fields: 'name,first_name,last_name,email,picture'
				    },
				    (response) => {
				      if (response && !response.error) {
				        
				        /* handle the result */
				        response.photoUrl = response.picture.data.url;
				        response.loginBy  = 'facebook';
				        this.registerUser(response);
				      }
				    }
				);

      } else {
       
       	console.log('Facebook User login failed');
      }
    });

  }

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '917497774560-48jqrohaa6t378cp39me1bii01resllu.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(this.googleLoginBtn.nativeElement);
      this.attachSignin(this.googleLoginBtn2.nativeElement);
    });
  }
  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        // console.log('googleUser', googleUser);
        // console.log('profile', profile);
        // console.log('Token || ' + googleUser.getAuthResponse().id_token);
        // console.log('ID: ' + profile.getId());
        // console.log('Name: ' + profile.getName());
        // console.log('FirstName: ' + profile.getGivenName());
        // console.log('LastName: ' + profile.getFamilyName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail());
        
        /* handle the result */
        var user = {
					email: 			profile.getEmail(),
					loginBy: 		'google',
					photoUrl: 	profile.getImageUrl(),
					last_name: 	profile.getFamilyName(),
        	first_name: profile.getGivenName(),
        };
        
        this.registerUser(user);

      }, (error) => {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

	ngAfterViewInit(){
	  
	  this.googleInit();
	}


	signOut(): void {
		console.log('FB', FB);
		
		FB.getLoginStatus(function(response) {
				
				console.log('getLoginStatus response', response)
        
        if (response && response.status === 'connected') {
            FB.logout(function(response) {

								console.log('Facebbok logout response', response)
            });
        }
    });

    this.auth2.signOut().then( () => {
      console.log('Google user signed out.');
    });
		
		localStorage.removeItem('isLoggedIn');
		localStorage.removeItem('userType');
		this.loggedIn = false;
    // document.location.reload();

	}


}
