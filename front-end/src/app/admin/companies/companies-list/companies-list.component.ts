import { Component, OnInit } from '@angular/core';

import { CompaniesService } from "../../../services/admin/companies.service";
import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit {

	public companies: Array<Object>;
  	constructor(private companiesService: CompaniesService) { }

  	ngOnInit() {

  		this.getCompanies();
  	}

  	getCompanies() {
	   
	    this.companiesService.getCompanies().subscribe((response: Array<Object>) => {

	      if ( response['status'] == true ) {
	        
	    		var companies = response['data'] 
	    		companies.forEach((company) => {

		    			company['logo'] = company['logo'] == '' ? '' : APP_URL+'/assets/uploads/companies/'+company['logo'];
	    		});
	        this.companies = companies;
	      }

	    }, error => {

	    	this.companies = [];
	    	console.log('getCompanies error', error);
	    });
  	}

  	delete(companyId, index) {

	    this.companiesService.deleteCompany(companyId).subscribe((response: Array<Object>) => {

	    	this.companies.splice(index, 1);
	    }, error => {
	    	
	    	console.log('deleteComment error', error);
	    });
  	}
}
