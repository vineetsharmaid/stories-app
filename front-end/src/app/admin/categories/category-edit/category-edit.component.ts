import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { CategoryService } from "../../../services/admin/category.service";

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {


	public categories: Array<Object>;
	public filteredCategories: Observable<Array<object>>;
	public category: Object;
	public editCategoryForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;
  	constructor(private formBuilder: FormBuilder, 
  		private categoryService: CategoryService, 
  		private router: Router,
  		private activatedRoute: ActivatedRoute,) { }

  	ngOnInit() {

  		this.editCategoryForm = this.formBuilder.group({
  			'catID': ['', Validators.required],
  			'name': ['', Validators.required],
  			'description': ['', Validators.required],
  			'status': ['0', Validators.required],
  			'parent': [''],
  		})
  		
  		this.getCategory();
  	}

  	// convenience getter for easy access to form fields
  	get fields() { return this.editCategoryForm.controls; }


  	getCategory() {
	   	
	   	const catId = +this.activatedRoute.snapshot.paramMap.get('catId');
	   	console.log('catId', catId);

	    this.categoryService.getCategory(catId).subscribe((response: Array<Object>) => {

	      console.log('get single category response', response);
	      if ( response['status'] == true ) {
	        
	        this.category = response['data'][0];
	        this.editCategoryForm.patchValue({
			    catID: this.category['cat_id'],
			    name: this.category['name'],
			    description: this.category['description'],
			    status: this.category['status']
			});

	        this.getParentCategories();
	      }

	    }, error => {

	    	this.categories = [];
	    	console.log('getCategories error', error);
	    });
  	}


  	editCategory() {

  		this.formSubmitted = true;
  		
  		let parent = this.editCategoryForm.get('parent').value;
  		let parent_id = parent ? parent['cat_id']: '';


		// stop here if form is invalid
		if (this.editCategoryForm.invalid) {

			console.log('Validation error.');
			return;
		} else {

			var category = {
					cat_id: this.editCategoryForm.get('catID').value,
					name: this.editCategoryForm.get('name').value,
					description: this.editCategoryForm.get('description').value,
					status: this.editCategoryForm.get('status').value,
					parent: parent_id,
				};

			this.categoryService.editCategory(category).subscribe((response: Array<Object>) => {

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


  	getParentCategories() {
	   	
	    this.categoryService.getParentCategories(this.category['cat_id']).subscribe((response: Array<Object>) => {

	      console.log('getParentCategories response', response);
	      if ( response['status'] == true ) {
	        
	        console.log('list users');
	        this.categories = response['data'];

		    let parentCategory = this.categories.filter((category) => category['cat_id'] == this.category['parent'] );
		    
		    console.log('parentCategory', parentCategory);
		    if ( parentCategory.length > 0 ) {
		    	
		    	this.editCategoryForm.patchValue({
				    parent: parentCategory[0]
				});
		    }

	  		this.filteredCategories = this.editCategoryForm.controls['parent'].valueChanges
		      .pipe(
		        startWith(''),
		        map(value => this._filterCategories(value))
		      );

	      }

	    }, error => {

	    	this.categories = [];
	    	console.log('getParentCategories error', error);
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
