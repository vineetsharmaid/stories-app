import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';

import { trigger, transition, animate, style } from '@angular/animations'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Observable }         from 'rxjs';
import { map, startWith }     from 'rxjs/operators';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

import { StoryService } from '../../../services/story.service';
import { UserService } from '../../../services/user.service';

import { environment } from '../../../../../environments/environment';
const API_URL  =  environment.baseUrl+'/api/';
const APP_URL  =  environment.baseUrl;

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-story-new',
  templateUrl: './story-new.component.html',
  styleUrls: ['./story-new.component.css'],
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
export class StoryNewComponent implements OnInit {

	public showNewForm: boolean = true;
	public showPreview: boolean = false;
	public addStorySubmitted: boolean = false;
  public previewSubmitted: boolean = false;
	public storyTitle;
	public addStoryForm: FormGroup;
	public previewForm: FormGroup;
	public selectedFile: ImageSnippet;
  public subAddForm: any;
	public filePath: string;
	public previousUrl: string;
	public storyId: number;

  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredTags: Observable<string[]>;
  public tags: any = [];
  public allTags: any = [];
  public allCountries: Array<object>;
  public filteredCountries: Array<object>;
  public selectedCountry: any = "";
  public companies: Array<object>;
  public storyErrors: Array<string>;

  visible    = true;
  removable  = true;
  addOnBlur  = true;
  selectable = true;
  fruitCtrl = new FormControl();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;  
  @ViewChild('saveStoryError') saveStoryError: ElementRef<HTMLInputElement>;
  @ViewChild('closeReviewSubmit') closeReviewSubmit: ElementRef<HTMLInputElement>;
  @ViewChild('saveDraftResponse') saveDraftResponse: ElementRef<HTMLInputElement>;  


	public editorStoryOptions: Object = {
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
    charCounterMax: 400,
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
    private storyService: StoryService, 
    private userService: UserService, 
    private router: Router) {


    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        console.log(event[0].urlAfterRedirects);

        // check if previous url was edit
        this.previousUrl = event[0].urlAfterRedirects.split('/');
        if( this.previousUrl[3] == 'edit' ) {

        	this.router.navigate(['/user']);
        }
    }); 
  }
 
  ngOnInit() {

  	this.addStoryForm = this.formBuilder.group({

  		title: ['', Validators.required],
  		description: [' ', Validators.required],
      previewTitle: ['', Validators.required],
      previewSubtitle: ['', Validators.required],
      previewType: ['1', Validators.required],
      previewImage: [''],
      previewTags: [''],
      haveCompany: ['0'],
      company: ['0'],
      country: [''],
  	});

  	this.previewForm = this.formBuilder.group({

  		previewTitle: ['', Validators.required],
  		previewSubtitle: ['', Validators.required],
  		// previewImage: ['', Validators.required],
  	});

    // subscribe to changes on add story form
    this.onChanges();

    this.getTags();
    this.getCountries();
    this.getCompanies();
    this.subscribeToCountry();

  }

  subscribeToCountry() {


    this.addStoryForm.get('country').valueChanges.subscribe(val => {
      
        var searchedCountry = this.addStoryForm.get('country').value.toString().toLowerCase();
        var countries;
        if( searchedCountry.length > 0 ) {
          
          countries = this.allCountries.filter((country) => {
            
            return country['name'].toString().toLowerCase().includes(searchedCountry);
          });
        } else {
          
          countries = this.allCountries;
        }

        this.filteredCountries = countries.length == 1 ? this.allCountries : countries;
    });
  }

  /*****SAVE PREVIEW FORM FIELDS ON CHANGE******/ 
  onChanges(): void {
    
    // this.subAddForm = this.addStoryForm.get('title').valueChanges.subscribe(val => {
        
    //     typeof this.storyId == 'undefined' ? this.saveDraft() : this.updateDraft();
    // });

    // this.subAddForm = this.addStoryForm.get('description').valueChanges.subscribe(val => {
        
    //     typeof this.storyId == 'undefined' ? this.saveDraft() : this.updateDraft();
    // });
  }

	// convenience getter for easy access to form fields
  get addF() { return this.addStoryForm.controls; }    
  get pf() { return this.previewForm.controls; }    


  getCountries() {

    this.storyService.getCountries().subscribe((response) => {

      this.filteredCountries = this.allCountries = response;
    }, (error) => {

      this.filteredCountries = this.allCountries = [];
      console.log('error', error);
    });
  }

  getCompanies() {

    this.userService.getCompanies().subscribe((response) => {

      this.companies = response['data'];
    }, (error) => {
      
      this.companies = [];
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

  // saveDraft() {

  //   var draftStory = {
		// 	title: this.addStoryForm.get('title').value,
		// 	description: this.addStoryForm.get('description').value,
		// 	username: localStorage.getItem('username')
		// };

		// let description = this.addStoryForm.get('description').value;
		// let subTitle 		= description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);

		// // this.previewForm.patchValue({	

		// // 	previewTitle: this.addStoryForm.get('title').value,
		// // 	previewSubtitle: subTitle,
		// // });

  //   // stop here if form is invalid
  //   if (this.addStoryForm.invalid) {

  //   	console.log('Validation error.');
  //     return;
  //   } else {

  //   	this.storyService.saveDraft(draftStory).subscribe((response) => {

		// 		console.log('Data saved to draft');
    		
  //   		this.storyId = response['data']['story'];

  //   	}, (error) => {

  //   		console.log(error);
  //   	});

		// }
  // }

  // updateDraft() {

  //   let description = this.addStoryForm.get('description').value;
  //   let subTitle     = description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);

  //   this.previewForm.patchValue({  

  //     previewTitle: this.addStoryForm.get('title').value,
  //     previewSubtitle: subTitle,
  //   });

  //   var draftStory = {
  //     story_id: this.storyId,
  //     title: this.addStoryForm.get('title').value,
  //     description: this.addStoryForm.get('description').value,
  //     previewTitle: this.previewForm.get('previewTitle').value,
  //     previewSubtitle: this.previewForm.get('previewSubtitle').value,
  //     username: localStorage.getItem('username'),
  //   };

  //   // stop here if form is invalid
  //   if (this.addStoryForm.invalid) {

  //     console.log('Validation error.');
  //     return;
  //   } else {

  //     this.storyService.updateDraft(draftStory).subscribe((response) => {

  //       console.log('Data updated in draft');        
  //       this.storyId = response['data']['story']['story_id'];

  //     }, (error) => {

  //       console.log(error);
  //     });

  //   }
  // }


  submitStory(draft = false) {

    this.addStorySubmitted = true;
    this.storyErrors = [];

    let description = this.addStoryForm.get('description').value;

    let tag_ids = [];
    this.tags.forEach((tag) => {

      tag_ids.push(tag.tag_id) 
    });

    var customInValid = false;
    if ( this.addStoryForm.get('title').value == "" ) {

      customInValid = true;
      this.storyErrors.push("Story Title is required.");
    }

    if(description.length < 201) {

      customInValid = true;
      this.storyErrors.push("Story content should have at least 200 characters.");
    }
    
    if ( this.addStoryForm.get('previewTitle').value == "" ) {
      
        this.addStoryForm.patchValue({  

          previewTitle: this.addStoryForm.get('title').value,
        });      
    }

    if ( this.addStoryForm.get('previewSubtitle').value == "" ) {
          
        // let description = this.editStoryForm.get('description').value;
        let subTitle     = description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);
        
        this.addStoryForm.patchValue({  

          previewSubtitle: subTitle,
        });
    }

    var draftStory = {
      title: this.addStoryForm.get('title').value,
      description: this.addStoryForm.get('description').value,
      previewTitle: this.addStoryForm.get('previewTitle').value,
      previewSubtitle: this.addStoryForm.get('previewSubtitle').value,
      previewType: this.addStoryForm.get('previewType').value,
      previewImage: this.addStoryForm.get('previewImage').value,
      previewTags: tag_ids,
      haveCompany: this.addStoryForm.get('haveCompany').value,
      company: this.addStoryForm.get('company').value,
      country: this.addStoryForm.get('country').value,
      draft: draft,
      // story: this.storyId,
      username: localStorage.getItem('username')
    };

    console.log('draftStory', draftStory);

    // stop here if form is invalid
    if (this.addStoryForm.invalid || customInValid) {

      this.saveStoryError.nativeElement.click();
      console.log('Validation error.');
      return;
    } else {

      this.storyService.saveDraft(draftStory).subscribe((response) => {

        this.storyId = response['data']['story'];
        if( draft ) {
          
          this.saveDraftResponse.nativeElement.click();
        } else {

          this.router.navigate(["/user/story/list/"]);
        }
        // this.toggleView();
      }, (error) => {

        console.log(error);
      });

    }
  }

  savePreview() {

  	this.previewSubmitted = true;

    var draftStory = {
			previewTitle: this.previewForm.get('previewTitle').value,
			previewSubtitle: this.previewForm.get('previewSubtitle').value,
			story: this.storyId,
			username: localStorage.getItem('username')
		};

    // stop here if form is invalid
    if (this.previewForm.invalid) {

    	console.log('Validation error.');
      return;
    } else {

    	this.storyService.submitForReview(draftStory).subscribe((response) => {

				console.log('Data saved to draft');
    		console.log(response);
    		this.toggleView();
    	}, (error) => {

    		console.log(error);
    	});
			console.log('Preview data saved to draft');
		}
  }

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
      
      this.storyService.uploadImage(this.selectedFile.file, 0).subscribe(
        (response) => {

          this.addStoryForm.controls['previewImage'].setValue(response['data']);
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
        
        console.log('event.value', event.value);

        this.tags.push({
          tag_id:"",
          name:value.trim()
        });

      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
      
      // this.addStoryForm.controls['previewTags'].setValue(null);
    }

  }

  remove(tag, indx): void {
    
    this.tags.splice(indx, 1);
    this.allTags.push(tag);
    // this.addStoryForm.controls['previewTags'].setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    
    this.tags.push(event.option.value);

    this.allTags = this.allTags.filter((tag) => { return tag.tag_id != event.option.value.tag_id })
    
    this.tagInput.nativeElement.value = '';
    // this.addStoryForm.controls['previewTags'].setValue(null);

    // save form fields
    // this.storyService.addTagToStory(event.option.value.tag_id, this.story['story_id']).subscribe((response) => {

    //   console.log('response', response);
    // }, (error) => {

    //   console.log('error', error);
    // });
  }

  displayFnCountry(country): Object | undefined {
    
    console.log('display country', country);

    this.selectedCountry = country.name;

    return country ? country.name : undefined;
  }


  private _filterTags(value: string): string[] {
    
    const filterValue = value.toString().toLowerCase();
    
    return this.allTags.filter( tag => tag.name.toLowerCase().startsWith(filterValue) );
  }

  ngOnDestroy() {

    // this.subAddForm.unsubscribe();
  }


}
