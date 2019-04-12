import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { CategoryService } from "../../../services/admin/category.service";

@Component({
  selector: 'app-tags-add',
  templateUrl: './tags-add.component.html',
  styleUrls: ['./tags-add.component.css']
})

export class TagsAddComponent implements OnInit {

	public categories: Array<Object>;
	public filteredCategories: Observable<Array<object>>;
	public category: Object;
	public addTagForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;
  	constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private router: Router) { }

  	ngOnInit() {

  		this.addTagForm = this.formBuilder.group({
  			'name': ['', Validators.required],
  		})
  		
  	}

  	// convenience getter for easy access to form fields
  	get fields() { return this.addTagForm.controls; }  

  	addTag() {

  		this.formSubmitted = true;
  		
		// stop here if form is invalid
		if (this.addTagForm.invalid) {

			console.log('Validation error.');
			return;
		} else {

			var tag = this.addTagForm.get('name').value;

			this.categoryService.addTag(tag).subscribe((response: Array<Object>) => {

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
