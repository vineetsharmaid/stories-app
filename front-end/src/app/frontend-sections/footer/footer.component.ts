import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../frontend/services/user.service';


@Component({
  selector: 'frontend-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	public newsletterForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;
	public subscribeError: string;
  test : Date = new Date();

	@ViewChild('sucessNewsletterBtn')  sucessNewsletterBtn: ElementRef;
	@ViewChild('errorNewsletterBtn')  errorNewsletterBtn: ElementRef;
  
  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {

  		this.newsletterForm = this.formBuilder.group({
  			'firstName': ['', Validators.required],
  			'lastName': ['', Validators.required],
  			'email': ['',  Validators.compose([Validators.required, Validators.email]) ],  			
  		})
	}

	// convenience getter for easy access to form fields
	get fields() { return this.newsletterForm.controls; }  

  submitNewsletter() {

		this.formSubmitted = true;

		// stop here if form is invalid
		if (this.newsletterForm.invalid) {

			console.log('Validation error.');
			return;
		} else {

			var subscriber = {
					firstName: this.newsletterForm.get('firstName').value,
					lastName: this.newsletterForm.get('lastName').value,
					email: this.newsletterForm.get('email').value,
				};

			this.userService.submitNewsletter(subscriber).subscribe((response: Array<Object>) => {

				this.formSubmitted = false;
				this.newsletterForm.reset();
		    if( response['status'] == true ) {
		    	
						this.subscribeError = "";
		    } else {

						this.subscribeError = response['message'];
		    }
				this.sucessNewsletterBtn.nativeElement.click();
				
			}, error => {

				this.errorNewsletterBtn.nativeElement.click();
				console.log('error', error);
			});

		}

  	}

}
