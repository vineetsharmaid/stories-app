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

	public fbUrl: string;
	public lnUrl: string;
	public instaUrl: string;
	
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

    this.getSettings();
  }

  getSettings() {
    
    this.userService.getSettings().subscribe((response: Array<Object>) => {

      let settings = response['data'];
      this.fbUrl = settings['fb_url']
      this.lnUrl = settings['ln_url']
      this.instaUrl = settings['insta_url']
      
      localStorage.setItem('fbUrl', this.fbUrl);
      localStorage.setItem('instaUrl', this.lnUrl);
      localStorage.setItem('lnUrl', this.instaUrl);
    }, (error) => {

      console.log('error', error);
    });
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
				this.sucessNewsletterBtn.nativeElement.click();
				
			}, error => {

				console.log('error', error);
				this.subscribeError = error['errorData']['message'];
				this.errorNewsletterBtn.nativeElement.click();
				
			});

		}

  	}

}
