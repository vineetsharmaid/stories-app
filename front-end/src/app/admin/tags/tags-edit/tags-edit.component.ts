import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { CategoryService } from "../../../services/admin/category.service";

@Component({
  selector: 'app-tags-edit',
  templateUrl: './tags-edit.component.html',
  styleUrls: ['./tags-edit.component.css']
})

export class TagsEditComponent implements OnInit {

	public categories: Array<Object>;
	public filteredCategories: Observable<Array<object>>;
	public tag: Object;
	public editTagsForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;
  	constructor(private formBuilder: FormBuilder, 
  		private categoryService: CategoryService, 
  		private router: Router,
  		private activatedRoute: ActivatedRoute,) { }

  	ngOnInit() {

  		this.editTagsForm = this.formBuilder.group({
  			'tagID': ['', Validators.required],
  			'name': ['', Validators.required],
  		})
  		
  		this.getTag();
  	}

  	// convenience getter for easy access to form fields
  	get fields() { return this.editTagsForm.controls; }


  	getTag() {
	   	
	   	const tagID = +this.activatedRoute.snapshot.paramMap.get('tagID');
	   	console.log('tagID', tagID);

	    this.categoryService.getTag(tagID).subscribe((response: Array<Object>) => {

	      if ( response['status'] == true ) {
	        
	        this.tag = response['data'][0];
	        this.editTagsForm.patchValue({
					    tagID: this.tag['tag_id'],
					    name: this.tag['name'],
					});

	      }

	    }, error => {

	    	this.categories = [];
	    	console.log('getCategories error', error);
	    });
  	}


  	editTag() {

  		this.formSubmitted = true;

		// stop here if form is invalid
		if (this.editTagsForm.invalid) {

			console.log('Validation error.');
			return;
		} else {

			var tag = {
					tag_id: this.editTagsForm.get('tagID').value,
					name: this.editTagsForm.get('name').value,
				};

			this.categoryService.editTag(tag).subscribe((response: Array<Object>) => {

				console.log('response', response);
				if ( response['status'] == true ) {
					
		      this.router.navigateByUrl('/admin/tags');
		    } else {

					this.formErrors = response['error'];
		    }
				
			}, error => {

				console.log('error', error);
			});

		}

  	}

}
