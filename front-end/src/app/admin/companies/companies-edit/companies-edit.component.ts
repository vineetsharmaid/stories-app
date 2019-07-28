import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { CompaniesService } from "../../../services/admin/companies.service";

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-companies-edit',
  templateUrl: './companies-edit.component.html',
  styleUrls: ['./companies-edit.component.css']
})

export class CompaniesEditComponent implements OnInit {

	public editCompanyForm: FormGroup;
	public formSubmitted: boolean = false;
	public company: any;
	public formErrors: Array<string>;
	public logoFile: any;

  	constructor(private formBuilder: FormBuilder, 
  		private companiesService: CompaniesService, 
  		private router: Router,
  		private activatedRoute: ActivatedRoute,) { }

  	ngOnInit() {
  		
  		this.editCompanyForm = this.formBuilder.group({ 
  			'name': ['', Validators.required],
  			'url': ['', Validators.required],
  			'email': ['', Validators.required],
  			'logo': [''] 
  		});

  		this.getCompany();
  	}

  	// convenience getter for easy access to form fields
  	get fields() { return this.editCompanyForm.controls; }    	  	

  	getCompany() {
	   	
	   	const companyId = +this.activatedRoute.snapshot.paramMap.get('companyId');

	    this.companiesService.getCompany(companyId).subscribe((response: Array<Object>) => {

	      this.company = response['data'];
	   		// console.log('this.company', this.company);
	      
	      this.editCompanyForm.patchValue({
			    name: this.company['name'],
			    url: this.company['url'],
			    email: this.company['email'],
			    // logo: this.company['logo'],
				});

	    }, error => {

	    	console.log('getCompany error', error);
	    });
  	}


  	editcompany() {

  		this.formSubmitted = true;
	  	
	  	// stop here if form is invalid
			if (this.editCompanyForm.invalid) {

				console.log('Validation error.');
				return;
			} else {

				let logo = typeof this.logoFile == 'undefined' ? "" : this.logoFile.file;

				var company = {
					'name': this.editCompanyForm.get('name').value,
					'url': this.editCompanyForm.get('url').value,
					'email': this.editCompanyForm.get('email').value,
					'company_id': this.company['company_id'],
					'logo': logo,
				};
				
				this.companiesService.editcompany(company).subscribe((response: Array<Object>) => {

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
