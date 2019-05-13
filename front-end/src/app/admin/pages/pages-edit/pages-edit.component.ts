import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { CompaniesService } from "../../../services/admin/companies.service";


import { environment } from '../../../../environments/environment';
const API_URL  =  environment.baseUrl+'/api/';

@Component({
  selector: 'app-pages-edit',
  templateUrl: './pages-edit.component.html',
  styleUrls: ['./pages-edit.component.css']
})

export class PagesEditComponent implements OnInit {

	public categories: Array<Object>;
	public filteredCategories: Observable<Array<object>>;
	public page: Object;
	public editPagesForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;


	public editorPageOptions: Object = {
  	// toolbarInline: true,  
    placeholderText: null,
    quickInsertButtons: ['image', 'table', 'ol', 'ul'],
    toolbarButtons: [
      'bold', 'italic', 'underline', 'strikeThrough', 'formatOL', 'formatUL',
      'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 'insertVideo', 
      'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
    ],
    toolbarButtonsSM: [
      'bold', 'italic', 'underline', 'strikeThrough', 'formatOL', 'formatUL',
      'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 'insertVideo', 
      'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
    ],
    heightMin: 400,    
  	charCounterCount: true,

    // Set the image upload parameter.
    imageUploadParam: 'description_image',

    // Set the image upload URL.
    imageUploadURL: API_URL+'story_description_image_upload',

    // Additional upload params.
    imageUploadParams: {id: 'my_editor'},

    // Set request type.
    imageUploadMethod: 'POST',

    // Set max image size to 5MB.
    imageMaxSize: 5 * 1024 * 1024,

    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    events:  {
      'froalaEditor.initialized':  function () {
        console.log('initialized');
      },
      'froalaEditor.image.beforeUpload':  function  (e,  editor,  images) {
        //Your code 
        // if  (images.length) {
        //   // Create a File Reader.
        //   const  reader  =  new  FileReader();
        //   // Set the reader to insert images when they are loaded.
        //   reader.onload  =  (ev)  =>  {
        //     const  result  =  ev.target['result'];
        //     editor.image.insert(result,  null,  null,  editor.image.get());
        //     console.log(ev,  editor.image,  ev.target['result'])
        //   };
        //   // Read image as base64.
        //   reader.readAsDataURL(images[0]);
        // }
        // Stop default upload chain.
        // return  false;
      }, 
      'froalaEditor.image.error':  function  (e,  editor, error, images) {
        
        console.log('error', error);
      },

    }
    // quickInsertTags: [], //to disable quick button
		// toolbarVisibleWithoutSelection: true, // shows toolbar when click anywhere on editor
	}

  	constructor(private formBuilder: FormBuilder, 
  		private companiesService: CompaniesService, 
  		private router: Router,
  		private activatedRoute: ActivatedRoute,) { }

  	ngOnInit() {

  		this.editPagesForm = this.formBuilder.group({
  			'pageID': ['', Validators.required],
  			'title': ['', Validators.required],
  			'content': ['', Validators.required],
  		})
  		
  		this.getTag();
  	}

  	// convenience getter for easy access to form fields
  	get fields() { return this.editPagesForm.controls; }


  	getTag() {
	   	
	   	const pageID = +this.activatedRoute.snapshot.paramMap.get('pageID');
	   	console.log('pageID', pageID);

	    this.companiesService.getPage(pageID).subscribe((response: Array<Object>) => {

	      if ( response['status'] == true ) {
	        
	        this.page = response['data'][0];
	        this.editPagesForm.patchValue({
					    pageID: this.page['page_id'],
					    title: this.page['title'],
					    content: this.page['content'],
					});

	      }

	    }, error => {

	    	this.categories = [];
	    	console.log('getCategories error', error);
	    });
  	}


  	editpage() {

  		this.formSubmitted = true;

		// stop here if form is invalid
		if (this.editPagesForm.invalid) {

			console.log('Validation error.');
			return;
		} else {

			var page = {
					title: this.editPagesForm.get('title').value,
					page_id: this.editPagesForm.get('pageID').value,
					content: this.editPagesForm.get('content').value,
				};

			this.companiesService.editpage(page).subscribe((response: Array<Object>) => {

				console.log('response', response);
				if ( response['status'] == true ) {
					
		      this.router.navigateByUrl('/admin/pages');
		    } else {

					this.formErrors = response['error'];
		    }
				
			}, error => {

				console.log('error', error);
			});

		}

  	}

}
