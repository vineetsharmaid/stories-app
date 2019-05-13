import { Component, OnInit } from '@angular/core';

import { CompaniesService } from "../../../services/admin/companies.service";

@Component({
  selector: 'app-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.css']
})
export class PagesListComponent implements OnInit {


	public pages: Array<Object>;
  	constructor(private companiesService: CompaniesService) { }

  	ngOnInit() {

  		this.getTags();
  	}

  	getTags() {
	   
	    this.companiesService.getPages().subscribe((response: Array<Object>) => {

	      if ( response['status'] == true ) {
	        
	        var pages = response['data'];

	        pages.forEach((page) => {

	        	page['content'] = page['content'].replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,250);
	        	page['content'] = page['content'].length >= 249 ? page['content']+'...' : page['content'];
	        })

	        this.pages = pages;
	      }

	    }, error => {

	    	this.pages = [];
	    	console.log('getTags error', error);
	    });
  	}


}
