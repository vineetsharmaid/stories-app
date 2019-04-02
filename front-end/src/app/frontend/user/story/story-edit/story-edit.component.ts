import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, animate, style } from '@angular/animations'
import { Router, NavigationEnd, Params, ActivatedRoute } from '@angular/router';

import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';



import { Observable }         from 'rxjs';
import { map, startWith }     from 'rxjs/operators';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

import { StoryService } from '../../../services/story.service';

import { environment } from '../../../../../environments/environment';
const API_URL  =  environment.baseUrl+'/api/';
const APP_URL  =  environment.baseUrl;

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-story-edit',
  templateUrl: './story-edit.component.html',
  styleUrls: ['./story-edit.component.css'],
  animations: [
	  trigger('slideInOut', [
	    transition(':enter', [
	      style({ opacity:0 }),
        animate('500ms ease-in-out', style({ opacity:1 }))
	    ]),
	    transition(':leave', [
	      style({ opacity:1 }),
        animate('0ms ease-in-out', style({ opacity:0 }))
      ]),
	  ])
  ]
})
export class StoryEditComponent implements OnInit {

	public showNewForm: boolean;
	public showPreview: boolean;
	public previewSubmitted: boolean = false;
  public previewIsTouched: boolean = false;
	public storyTitle;
	public editStoryForm: FormGroup;
	public previewForm: FormGroup;
	public selectedFile: ImageSnippet;
	public filePath: string;
  public previousUrl: string;
	public storyId: number;
  public story: Object;
  public storyErrors: Array<string>;
  isNewStory: boolean;


  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<string[]>;
  tags: any = [];
  allTags: any = [];

  visible    = true;
  removable  = true;
  addOnBlur  = true;
  selectable = true;
  fruitCtrl = new FormControl();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;  



	public editorStoryOptions: Object = {
  	toolbarInline: true,  
  	placeholderText: null,
    quickInsertButtons: ['image', 'table', 'ol', 'ul'],
  	toolbarButtons: [
	  	'bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 
	  	'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 
	  	'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
  	],
  	toolbarButtonsSM: [
	  	'bold', 'italic', 'underline', 'strikeThrough', 
	  	'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 
	  	'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
  	],
    fontSize: ['14', '18', '20', '24'],
    fontSizeSelection: true,
  	heightMin: 400,
  	charCounterCount: false,

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

  constructor(private formBuilder: FormBuilder, private storyService: StoryService, 
    private router: Router, private activatedRoute: ActivatedRoute) {   
  }
 
  ngOnInit() {

  	this.editStoryForm = this.formBuilder.group({

  		title: ['', Validators.required],
  		description: [' ', Validators.required],
  	});

  	this.previewForm = this.formBuilder.group({

  		previewTitle: [''],
  		previewSubtitle: [''],
      previewTags: [''],
  		// previewImage: ['', Validators.required],
  	});

    const routeParams = this.activatedRoute.snapshot.params;
    this.isNewStory = routeParams['new'] == "true" ? true : false;

    this.getStory();
    this.getTags();
    
    this.filteredTags = this.previewForm.controls['previewTags'].valueChanges.pipe(
        startWith(''),        
        map((tag: string | null) => tag ? this._filterTags(tag) : this.allTags.slice())
    );
    
  }

  getStory() {

    this.storyId = +this.activatedRoute.snapshot.paramMap.get('storyId');

    this.storyService.getStory(this.storyId).subscribe(
      (response) => {

        this.story = response['data'][0];
        
        if ( this.story['preview_image'] != "" ) {
          
          this.filePath = APP_URL+'/assets/uploads/'+this.story['preview_image'];
        }

        /****SET FORM FIELDS VALUE****/ 
        this.editStoryForm.patchValue({  

          title: this.story['title'],
          description: this.story['description'],
        });


        /********SHOW PREVIEW FORM FIRST WHEN PREVIEW INFORMATION IS EMPTY*******/
        if (this.isNewStory) {
          
          this.showPreview = true;          
          this.showNewForm = false;

          let description  = this.story['description'];
          let subTitle     = description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);

          subTitle = description.length > 140 ? subTitle+'...' : subTitle;

          /****SET FORM FIELDS VALUE****/ 
          // if ( this.story['preview_title'] == "" && this.story['preview_subtitle'] == "" ) { }
           
            this.previewForm.patchValue({  

              previewTitle: this.story['preview_title'] == "" ? this.story['title'] : this.story['preview_title'],
              previewSubtitle: this.story['preview_subtitle'] == "" ? subTitle : this.story['preview_subtitle'],
            });
          
        } else {
            
          this.showNewForm = true;
          this.showPreview = false;

          /****SET FORM FIELDS VALUE****/ 
          this.previewForm.patchValue({  

            previewTitle: this.story['preview_title'],
            previewSubtitle: this.story['preview_subtitle'],
          });            
        }

      }, (error) => {
        if ( error['errorData']['error'].length > 0 ) {
          
          this.storyErrors = error['errorData']['error'];
        }
        console.log('error', error);
      });
  }

  getTags() {


    this.storyService.getTags().subscribe((response) => {
      
      this.allTags = response['data'];

    }, (error) => {

      this.allTags = [];
      console.log('error', error);
    });
  }

	// convenience getter for easy access to form fields
  get as() { return this.editStoryForm.controls; }    
  get pf() { return this.previewForm.controls; }    

  updateDraft() {

    var draftStory = {
			title: this.editStoryForm.get('title').value,
			description: this.editStoryForm.get('description').value,
			username: localStorage.getItem('username'),
      story_id: this.story['story_id'],
		};

		// let description = this.editStoryForm.get('description').value;
		// let subTitle 		= description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);

		// this.previewForm.patchValue({	

		// 	previewTitle: this.editStoryForm.get('title').value,
		// 	previewSubtitle: subTitle.replace(/&nbsp;/g, ''),
		// });

		console.log('draftStory', draftStory);

    // stop here if form is invalid
    if (this.editStoryForm.invalid) {

    	console.log('Validation error.');
      return;
    } else {

    	this.storyService.updateDraft(draftStory).subscribe((response) => {

				console.log('Data saved to draft');
    		console.log(response);
    		
    		this.storyId = response['data']['story'];

    		this.toggleView();
    	}, (error) => {

    		console.log(error);
    	});

		}
  }

  savePreview() {

  	this.previewSubmitted = true;

    if ( this.previewForm.get('previewTitle').value == "" ) {
      
        this.previewForm.patchValue({  

          previewTitle: this.story['title'],
        });      
    }

    if ( this.previewForm.get('previewSubtitle').value == "" ) {
          
        let description = this.editStoryForm.get('description').value;
        let subTitle     = description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);
        
        this.previewForm.patchValue({  

          previewSubtitle: subTitle,
        });
    }
    
    console.log('this.tags', this.tags);

    var draftStory = {
			previewTitle: this.previewForm.get('previewTitle').value,
			previewSubtitle: this.previewForm.get('previewSubtitle').value,
			story: this.story['story_id'],
			username: localStorage.getItem('username'),
      tags: this.tags
		};

    // stop here if form is invalid
    if (this.previewForm.invalid) {

    	console.log('Validation error.');
      return;
    } else {

    	this.storyService.submitForReview(draftStory).subscribe((response) => {

    		console.log(response);
    		this.toggleView();
    	}, (error) => {

    		console.log(error);
    	});
			console.log('Preview data saved to draft');
		}
  }


  // savePreviewKeyup(field: string, event: any) {

  //   console.log('field', field);
  //   console.log('event.target.value', event.target.value);

  //   let story = {[field]: event.target.value};
  //   console.log('story', story);
  //   this.storyService.saveReview(story).subscribe((response) => {

  //     console.log('review data saved');
  //     console.log(response);
      
  //   }, (error) => {

  //     console.log(error);
  //   });

  // }

  toggleView() {

  	this.showNewForm = this.showNewForm == false ? true : false;
  	this.showPreview = this.showPreview == false ? true : false;
  }


  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.filePath = this.selectedFile.src;
      console.log('this.selectedFile', this.selectedFile);

      this.storyService.uploadImage(this.selectedFile.file, this.story['story_id']).subscribe(
        (res) => {
          
          console.log('res', res);
        },
        (err) => {
        
          console.log('err', err);
        })
    });

    reader.readAsDataURL(file);
  }  



  add(event: MatChipInputEvent): void {
    
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {    

      const input = event.input;
      const value = event.value;
      // Add our fruit
      if ((value || '').trim()) {
        this.tags.push({
          tag_id:"",
          name:value.trim()
        });
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
      
      this.previewForm.controls['previewTags'].setValue(null);
    }

  }

  remove(fruit, indx): void {
    this.tags.splice(indx, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    
    this.tags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.previewForm.controls['previewTags'].setValue(null);
  }

  private _filterTags(value: string): string[] {
    
    const filterValue = value.toString().toLowerCase();
   
    return this.allTags.filter( tag => tag.name.toLowerCase().includes(filterValue) );
  }
  
}
