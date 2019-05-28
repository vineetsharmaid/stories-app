import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from "../../services/admin/user.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	public settingsForm: FormGroup;
	public submitted: boolean = false;
	public settings: object;

  constructor(private formBuilder: FormBuilder,
    	private router: Router,
    	private userService: UserService) { }

  ngOnInit() {

	    this.settingsForm = this.formBuilder.group({
            contactEmail: ['', Validators.required],
						email: ['', Validators.required],
						fbUrl: ['', Validators.required],
						instaUrl: ['', Validators.required],
						lnUrl: ['', Validators.required],
        });

	    this.getSettings();
  }

	// convenience getter for easy access to form fields
  get f() { return this.settingsForm.controls; }    

  onSubmit() {
      
      this.submitted = true;
      
      // stop here if form is invalid
      if (this.settingsForm.invalid) {

      	console.log('Validation error.');
          return;
      } else {

      	var settings = {
					contact_email:  this.settingsForm.get('contactEmail').value,
					email:  this.settingsForm.get('email').value,
					fb_url:  this.settingsForm.get('fbUrl').value,
					insta_url:  this.settingsForm.get('instaUrl').value,
					ln_url:  this.settingsForm.get('lnUrl').value,
				};

      	this.userService.updateSettings(settings).subscribe((response: Array<Object>) => {

      		console.log('response', response);
      	}, (error) => {

      		console.log('error', error);
      	});

      }

  }

  getSettings() {
  	
  	this.userService.getSettings().subscribe((response: Array<Object>) => {

  		this.settings = response['data'];

  		this.settingsForm.patchValue({
			    contactEmail: this.settings['contact_email'],
					email: this.settings['email'],
					fbUrl: this.settings['fb_url'],
					instaUrl: this.settings['insta_url'],
					lnUrl: this.settings['ln_url'],
			});
  	}, (error) => {

  		console.log('error', error);
  	});
  }

}
