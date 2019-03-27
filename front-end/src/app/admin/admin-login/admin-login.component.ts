import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from "../../frontend/services/user.service";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

	loginForm: FormGroup;
	submitted: boolean = false;
  hideErrors: boolean = false;
	loginErrors: Array<string>;
  constructor(private formBuilder: FormBuilder,
    	private router: Router,
    	private userService: UserService) { }
 
  ngOnInit() {

  		if (localStorage.getItem('isLoggedin') && localStorage.getItem('userType') == 'admin') {
  			
  				this.router.navigate(['/admin/dashboard']);
  		}

	    this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
  }

	// convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }  


  onSubmit() {
      
      this.submitted = true;
      
      // stop here if form is invalid
      if (this.loginForm.invalid) {

      	console.log('Validation error.');
          return;
      } else {

      	var user = {
					email: this.loginForm.get('email').value,
					password: this.loginForm.get('password').value,
				};


      	this.userService.loginUser(user).subscribe((response: Array<Object>) => {

      		console.log('response', response);
      		if ( response['status'] == 200 ) {
      			
            if ( response['data']['user_type'] == 'admin' ) {
                
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('userType', response['data'].user_type);
              this.router.navigateByUrl('/admin/dashboard');
            } else {
              
              this.hideErrors = false;
              this.loginErrors = ['Incorrect email or password.'];
            }

      		} else {

            this.hideErrors = false;
      			this.loginErrors = response['error'];
      		}
      	});

      }

  }

}
