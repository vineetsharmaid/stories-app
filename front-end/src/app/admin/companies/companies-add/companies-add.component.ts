import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { CompaniesService } from "../../../services/admin/companies.service";

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

@Component({
  selector: 'app-companies-add',
  templateUrl: './companies-add.component.html',
  styleUrls: ['./companies-add.component.css']
})

export class CompaniesAddComponent implements OnInit {

	public addCompanyForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;

  	constructor(private formBuilder: FormBuilder, private companiesService: CompaniesService, private router: Router) { }

  	ngOnInit() {

  		this.addCompanyForm = this.formBuilder.group(
  			{ 'name': ['', Validators.required] }
  		);

  	}

  	// convenience getter for easy access to form fields
  	get fields() { return this.addCompanyForm.controls; }    	

  	addCompany() {

  		this.formSubmitted = true;
		  		
			// stop here if form is invalid
			if (this.addCompanyForm.invalid) {

				console.log('Validation error.');
				return;
			} else {
				console.log(this.addCompanyForm.get('name').value);
				this.companiesService.addCompany(this.addCompanyForm.get('name').value).subscribe((response: Array<Object>) => {

					console.log('response', response);
					if ( response['status'] == true ) {
						
			      this.router.navigateByUrl('/admin/companies');
			    } else {

						this.formErrors = response['error'];
			    }
					
				}, error => {

					console.log('error', error);
				});

			}

  	}


}
