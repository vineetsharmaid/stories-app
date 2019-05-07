import { Component, OnInit } from '@angular/core';

import { CompaniesService } from "../../../services/admin/companies.service";

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

	      console.log('getCompanies response', response);
	      if ( response['status'] == true ) {
	        
	        this.companies = response['data'];
	      }

	    }, error => {

	    	this.companies = [];
	    	console.log('getCompanies error', error);
	    });
  	}

}
