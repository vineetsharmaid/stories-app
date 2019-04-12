import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { CategoryService } from "../../../services/admin/category.service";

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {


	public categories: Array<Object>;
	public filteredCategories: Observable<Array<object>>;
	public category: Object;
	public addCategoryForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;
  	constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private router: Router) { }

  	ngOnInit() {

  		this.addCategoryForm = this.formBuilder.group({
  			'name': ['', Validators.required],
  			'description': ['', Validators.required],
  			'status': ['0', Validators.required],
  			'parent': [''],
  		})
  		
  		this.getCategories();
  	}

  	// convenience getter for easy access to form fields
  	get fields() { return this.addCategoryForm.controls; }  

  	addCategory() {

  		this.formSubmitted = true;
  		
  		let parent = this.addCategoryForm.get('parent').value;
  		let parent_id = parent ? parent['cat_id']: '';


		// stop here if form is invalid
		if (this.addCategoryForm.invalid) {

			console.log('Validation error.');
			return;
		} else {

			var category = {
					name: this.addCategoryForm.get('name').value,
					description: this.addCategoryForm.get('description').value,
					status: this.addCategoryForm.get('status').value,
					parent: parent_id,
				};

			this.categoryService.addCategory(category).subscribe((response: Array<Object>) => {

				console.log('response', response);
				if ( response['status'] == true ) {
					
		      this.router.navigateByUrl('/admin/category');
		    } else {

					this.formErrors = response['error'];
		    }
				
			}, error => {

				console.log('error', error);
			});

		}

  	}

  	getCategories() {
	   
	    this.categoryService.getCategories().subscribe((response: Array<Object>) => {

	      console.log('getCategories response', response);
	      if ( response['status'] == true ) {
	        
	        this.categories = response['data'];

	  		this.filteredCategories = this.addCategoryForm.controls['parent'].valueChanges
		      .pipe(
		        startWith(''),
		        map(value => this._filterCategories(value))
		      );

	      }

	    }, error => {

	    	this.categories = [];
	    	console.log('getCategories error', error);
	    });
  	}


	/**
	*
	*
	* Parent Category Auotcomplete functions (https://material.angular.io/components/autocomplete/overview)
	*
	* function _filterCategories: filters the categories based upon user search
	* function displayFn: displays the desired value from the category object once user select a category
	*
	**/ 
	private _filterCategories(searchValue: string): Array<object> {
	    
	    const filterValue = searchValue.toString().toLowerCase();

	    let filteredCategories = this.categories.filter((category) => category['name'].toLowerCase().includes(filterValue) );

	    return filteredCategories;
	}


	displayFn(category): Object | undefined {
		
		return category ? category.name : undefined;
	}


}
