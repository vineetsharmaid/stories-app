import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {

	public contactForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;

	@ViewChild('sucessContactBtn')  sucessContactBtn: ElementRef;
	@ViewChild('errorContactBtn')  errorContactBtn: ElementRef;

	constructor(private formBuilder: FormBuilder, private userService: UserService) { }

	ngOnInit() {

  		this.contactForm = this.formBuilder.group({
  			'firstName': ['', Validators.required],
  			'lastName': ['', Validators.required],
  			'email': ['',  Validators.compose([Validators.required, Validators.email]) ],
  			'message': ['', Validators.required],
  		})
	}

	// convenience getter for easy access to form fields
	get fields() { return this.contactForm.controls; }  

  submitContact() {

		this.formSubmitted = true;

		// stop here if form is invalid
		if (this.contactForm.invalid) {

			console.log('Validation error.');
			return;
		} else {

			var contact = {
					firstName: this.contactForm.get('firstName').value,
					lastName: this.contactForm.get('lastName').value,
					message: this.contactForm.get('message').value,
					email: this.contactForm.get('email').value,
				};

			this.userService.submitContactForm(contact).subscribe((response: Array<Object>) => {

				this.formSubmitted = false;
				this.contactForm.reset();
				if ( response['status'] == true ) {
					
					this.sucessContactBtn.nativeElement.click();
		    } else {

					this.errorContactBtn.nativeElement.click();
		    }
				
			}, error => {

				this.errorContactBtn.nativeElement.click();
				console.log('error', error);
			});

		}

  	}

}
