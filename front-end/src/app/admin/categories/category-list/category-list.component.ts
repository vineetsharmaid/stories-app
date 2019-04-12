import { Component, OnInit } from '@angular/core';

import { CategoryService } from "../../../services/admin/category.service";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {


	public categories: Array<Object>;
  	constructor(private categoryService: CategoryService) { }

  	ngOnInit() {

  		this.getCategories();
  	}

  	getCategories() {
	   
	    this.categoryService.getCategories().subscribe((response: Array<Object>) => {

	      console.log('getCategories response', response);
	      if ( response['status'] == true ) {
	        
	        this.categories = response['data'];
	      }

	    }, error => {

	    	this.categories = [];
	    	console.log('getCategories error', error);
	    });
  	}

}
