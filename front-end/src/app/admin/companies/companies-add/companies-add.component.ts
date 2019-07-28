import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { CompaniesService } from "../../../services/admin/companies.service";

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-companies-add',
  templateUrl: './companies-add.component.html',
  styleUrls: ['./companies-add.component.css']
})

export class CompaniesAddComponent implements OnInit {

	public addCompanyForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;
	public logoFile: any;

  	constructor(private formBuilder: FormBuilder, private companiesService: CompaniesService, private router: Router) { }

  	ngOnInit() {

  		this.addCompanyForm = this.formBuilder.group({ 
  			'name': ['', Validators.required],
  			'url': ['', Validators.required],
  			'email': ['', Validators.required],
  			'logo': ['', Validators.required] 
  		});
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
				
				var company = {
					'name': this.addCompanyForm.get('name').value,
					'url': this.addCompanyForm.get('url').value,
					'email': this.addCompanyForm.get('email').value,
					'logo': this.logoFile.file,
				};

				this.companiesService.addCompany(company).subscribe((response: Array<Object>) => {

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


  uploadCoverPic(imageInput: any) {

    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.logoFile = new ImageSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);

  }

}
