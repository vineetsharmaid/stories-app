import { Component, OnInit } from '@angular/core';

import { CategoryService } from "../../../services/admin/category.service";

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.css']
})
export class TagsListComponent implements OnInit {


	public tags: Array<Object>;
  	constructor(private categoryService: CategoryService) { }

  	ngOnInit() {

  		this.getTags();
  	}

  	getTags() {
	   
	    this.categoryService.getTags().subscribe((response: Array<Object>) => {

	      console.log('getTags response', response);
	      if ( response['status'] == true ) {
	        
	        this.tags = response['data'];
	      }

	    }, error => {

	    	this.tags = [];
	    	console.log('getTags error', error);
	    });
  	}

}
