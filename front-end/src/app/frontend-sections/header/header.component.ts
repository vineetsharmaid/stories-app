import { Component, OnInit, ElementRef, ErrorHandler, Injectable, Injector, NgZone, ViewChild } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


declare const gapi: any;
declare const FB: any;

import { UserService } from "../../frontend/services/user.service";
import { SharedService } from "../../frontend/services/shared.service";
import { UserValidators } from '../../frontend/services/validators/user.validator';

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'frontend-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
   
  public auth2: any;

	public submitted:boolean = false;
	public loggedIn: boolean = false;
	public loginLoading: boolean = false;
	public loginSubmitted:boolean = false;
	public registerLoading: boolean = false;
  public forgotPassLoading: boolean = false;
  public passwordEmailSent: boolean = false;
  public forgotPassSubmitted:boolean = false;
	public accountAlreadyExists: boolean = false;
	
	public loginForm: FormGroup;
  public registerForm: FormGroup;
  public forgotPassForm: FormGroup;
	public loginErrors: Array<string>;
  public forgotPassErrors: Array<string>;
  public passwordEmailSuccess: string;

  public loading: any;
  public showHideLogin: any;
  public showForgotPassword: any;
  public showHideSignupForm: any;
  public companies: Array<object>;
  public userInfo: Object;

	@ViewChild('showLoginModal')  showLoginModal: ElementRef;
  @ViewChild('closeLoginModal') closeLoginModal: ElementRef;
	@ViewChild('showHideLoginBtn') showHideLoginBtn: ElementRef;
	@ViewChild('googleLoginBtn') googleLoginBtn: ElementRef;
	@ViewChild('googleLoginBtn2') googleLoginBtn2: ElementRef;

  constructor(
  	private formBuilder: FormBuilder, 
  	private userService: UserService,
    private sharedService: SharedService,
  	private router: Router,
  	private injector: Injector,
  	private userValidators: UserValidators ) {
 
  }

  ngOnInit(){

  	if( localStorage.getItem('isLoggedIn') == 'true' ) {

  		this.loggedIn = true;
      this.getUserInfo();
  	}

    this.sharedService.currentMessage.subscribe((message) => {

      console.log('header message', message);
      if (message == 'show_login') {
        
        this.showLoginModal.nativeElement.click();
      }
    });

    this.userService.getCompanies().subscribe((response) => {

      this.companies = response['data'];
    }, (error) => {
      
      this.companies = [];
      console.log('error', error);
    });

  	this.loadFacebookSDK();

    this.loginForm = this.formBuilder.group({
          email: [ '',  Validators.compose([Validators.required, Validators.email]) ],
          password: [ '',  Validators.required ]
      });

    this.forgotPassForm = this.formBuilder.group({
          email: [ '',  Validators.compose([Validators.required, Validators.email]) ]
      });

    this.registerForm = this.formBuilder.group({
          firstName: [ '', Validators.required ],
          lastName: [ '', Validators.required ],
          company: [ '' ],
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
  }


  getUserInfo() {

    this.userService.getUserInfo().subscribe( (response) => {

      console.log('response', response);
      this.userInfo = response['data'][0];
      this.userInfo['cover_pic'] = this.userInfo['cover_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.userInfo['cover_pic'];
      this.userInfo['profile_pic'] = this.userInfo['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.userInfo['profile_pic'];
      
    }, (error) => {

      console.log('error', error['code']);
      if ( error['code'] == 401 ) {
        // authentication error show login popup
      }
    });
  }


	// convenience getter for easy access to form fields
  get lf() { return this.loginForm.controls; }
  get f() { return this.registerForm.controls; }
  get fp() { return this.forgotPassForm.controls; }

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
          company: this.registerForm.get('company').value,
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

      	console.log('LoginSubmit Validation error.');
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
  
  /**** Forgot password form handling ****/
  onForgotPassSubmit() {
      
      this.forgotPassSubmitted = true;
      
      // stop here if form is invalid
      if (this.forgotPassForm.invalid) {

        console.log('ForgotPassSubmit Validation error.');
        return;
      } else {

        var user = {
          email: this.forgotPassForm.get('email').value,
        };

        this.forgotPassLoading = true;
        this.forgotPassword(user);

      }

  }

  registerUser(user) {
  	
  	this.userService.registerUser(user).subscribe((response: Array<Object>) => {

  		if ( response['status'] == 200 || user.loginBy == 'facebook' || user.loginBy == 'google' ) {
  			
  			// Close login modal
  			this.closeLoginModal.nativeElement.click();
				
  			// set user login
				this.setUserLogin(response['data']['id'], response['data']['username'], response['token']);
  			console.log('loggedIn', this.loggedIn);
        console.log('token', response['token']);
  		}

  		// user already exists
  		if ( response['status'] == 201 ) {
  			
  			this.accountAlreadyExists = true;
  			this.showHideLoginBtn.nativeElement.click();
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
				this.setUserLogin(response['data']['id'], response['data']['username'], response['token']);
  			console.log('loggedIn', this.loggedIn);

  		}

  		if ( response['status'] == 201 ) {
  			
  			this.loginErrors = response['error'];
  		}

  	});
  }

  forgotPassword(user) {

    this.userService.forgotPassword(user).subscribe((response: Array<Object>) => {

      console.log('forgotPassword response', response);
      this.forgotPassLoading = false;

      if ( response['status'] == 200 ) {
        
        console.log('email sent');
        
        this.forgotPassForm.reset();
        this.forgotPassForm.reset();

        this.passwordEmailSent = true;
        this.passwordEmailSuccess = "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.";

        this.forgotPassSubmitted = false;
      }

      if ( response['status'] == 201 ) {
        
        this.forgotPassErrors = response['error'];
      }

    });
  }

  setUserLogin(id, username, jwtToken) {

		// set login
		localStorage.setItem('isLoggedIn', 'true');
		localStorage.setItem('userType', 'user');
    localStorage.setItem('username', username);
    localStorage.setItem('user_id', id);
    localStorage.setItem('jwtToken', jwtToken);
    console.log('id', id);
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

    console.log('Before signed out jwtToken', localStorage.getItem('jwtToken'));
		
		localStorage.removeItem('isLoggedIn');
		localStorage.removeItem('userType');
    localStorage.removeItem('jwtToken');

    console.log('Signed out jwtToken', localStorage.getItem('jwtToken'));

		this.loggedIn = false;
    // document.location.reload();
    this.router.navigate(["/"]);

	}


}
