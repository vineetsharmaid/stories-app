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
import { UserService } from '../../../services/user.service';

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
  public customValidationPrompt: boolean = false;
	public customValidationMessages: Array<string> = [];
	public editStoryForm: FormGroup;
	public previewForm: FormGroup;
	public selectedFile: ImageSnippet;
	public subPreviewForm: any;
  public subGetStory: any;
  public filePath: string;
  public previousUrl: string;
	public storyId: number;
  public story: Object;
  public storyErrors: Array<string>;
  public companies: Array<object>;
  isNewStory: boolean;


  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<string[]>;
  tags: any = [];
  allTags: any = [];
  allCountries: Array<object>;
  filteredCountries: Array<object>;
  selectedCountry: any = "";

  visible    = true;
  removable  = true;
  addOnBlur  = true;
  selectable = true;
  fruitCtrl = new FormControl();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;  
  @ViewChild('confirmReviewSubmit') confirmReviewSubmit: ElementRef<HTMLInputElement>;
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

  constructor(private formBuilder: FormBuilder, private storyService: StoryService, private userService: UserService, 
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
      previewType: [''],
      haveCompany: ['0'],
      company: ['0'],
      country: [''],
  		// previewImage: ['', Validators.required],
  	});

    const routeParams = this.activatedRoute.snapshot.params;
    this.isNewStory = routeParams['new'] == "true" ? true : false;

    this.getStory();

    // this.filteredTags = this.previewForm.controls['previewTags'].valueChanges.pipe(
    //     startWith(''),        
    //     map((tag: string | null) => tag ? this._filterTags(tag) : [])
    // );


    this.userService.getCompanies().subscribe((response) => {

      this.companies = response['data'];
    }, (error) => {
      
      this.companies = [];
      console.log('error', error);
    });

    this.subscribeToCountry();

  }

  subscribeToCountry() {


    this.subPreviewForm = this.previewForm.get('country').valueChanges.subscribe(val => {
      
        var searchedCountry = this.previewForm.get('country').value.toString().toLowerCase();
        var countries
        if( searchedCountry.length > 0 ) {
          
          countries = this.allCountries.filter((country) => {
            
            return country['name'].toString().toLowerCase().includes(searchedCountry);
          });
        } else {
          
          countries = this.allCountries;
        }

        this.filteredCountries = countries;
    });
  }

  getStory() {

    this.storyId = +this.activatedRoute.snapshot.paramMap.get('storyId');

    this.subGetStory = this.storyService.getStory(this.storyId).subscribe(
      (response) => {

        this.story = response['data'][0];

        this.getTags();
        this.getCountries();

        // subscribe to changes on preview form
        this.onChanges();
        
        if ( this.story['preview_image'] != "" ) {
          
          this.filePath = APP_URL+'/assets/uploads/stories/'+this.story['preview_image'];
        }

        if ( this.story['type'] == "" || this.story['type'] == 0 ) {
          
          this.previewForm.patchValue({  

            previewType: '1',
          });
        } else {

          this.previewForm.patchValue({  

            previewType: this.story['type'],
          });  
        }

        this.previewForm.patchValue({  

          company: this.story['company_id'],
          haveCompany: this.story['have_company'],
          country: this.story['country'],
        });  

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


  getCountries() {

    this.storyService.getCountries().subscribe((response) => {

      console.log('response', response);
      this.filteredCountries = this.allCountries = response;
    }, (error) => {

      this.filteredCountries = this.allCountries = [];
      console.log('error', error);
    });
  }

  getTags() {

    this.storyService.getTags().subscribe((response) => {
            
      let allTags = response['data'];

      let storyTags = this.story['tag_ids'] ? this.story['tag_ids'].split(", ") : [];
      
      // this.filteredTags = allTags;
      
      console.log('filteredTags', this.filteredTags);

      this.allTags = allTags.filter((tag) => {
      
        if ( storyTags.includes(tag.tag_id) ) {
          
          this.tags.push(tag);
          return false;
        } else {

          return true;
        }

      });
      
    }, (error) => {

      this.allTags = [];
      console.log('error', error);
    });
  }

	// convenience getter for easy access to form fields
  get editF() { return this.editStoryForm.controls; }    
  get pf() { return this.previewForm.controls; }    



  updateDraft(event) {

    var draftStory = {
      story_id: this.story['story_id'],
      title: this.editStoryForm.get('title').value,
      description: this.editStoryForm.get('description').value,
      previewTitle: this.previewForm.get('previewTitle').value,
      previewSubtitle: this.previewForm.get('previewSubtitle').value,
      username: localStorage.getItem('username'),
    };

    console.log('draftStory', draftStory);

    // stop here if form is invalid
    if (this.editStoryForm.invalid) {

      console.log('Validation error.');
      return;
    } else {

      this.storyService.updateDraft(draftStory).subscribe((response) => {
        
        this.storyId = response['data']['story'];
        console.log('event', event);
        if( typeof event == 'undefined' ) {
          
          this.toggleView();
        } else if(event == 'manual') {

          this.saveDraftResponse.nativeElement.click();      
        }
      }, (error) => {

        console.log(error);
      });

    }
  }


  /*****SAVE PREVIEW FORM FIELDS ON CHANGE******/ 
  onChanges(): void {  
    
    this.subPreviewForm = this.previewForm.get('previewTitle').valueChanges.subscribe(val => {
      
        this.savePreview();        
    });

    this.subPreviewForm = this.previewForm.get('previewTitle').valueChanges.subscribe(val => {
      
        this.savePreview();
    });
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
    
    var draftStory = {
			previewTitle: this.previewForm.get('previewTitle').value,
			previewSubtitle: this.previewForm.get('previewSubtitle').value,
			story: this.story['story_id'],
			username: localStorage.getItem('username'),
		};

    // stop here if form is invalid
    if (this.previewForm.invalid) {

    	console.log('Validation error.');
      return;
    } else {

    	this.storyService.savePreview(draftStory).subscribe((response) => {

        // console.log('Preview data saved to draft');
    	}, (error) => {

    		console.log(error);
    	});
		}
  }

  submitPreview(confirmed: boolean = false) {

    this.previewSubmitted = true;
    
    var description = this.editStoryForm.get('description').value;
    description = description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").replace(/\&nbsp;/g, '');
    this.customValidationMessages = [];

    if(this.editStoryForm.get('title').value == "") {
      
      // this.customValidationPrompt = true;
      this.customValidationMessages.push("Title of the story is required.");
    }

    if(description.length < 201) {

      // this.customValidationPrompt = true;
      this.customValidationMessages.push("Story is shorter than 200 Characters.");
    }

    if(this.customValidationMessages.length > 0 && confirmed == false) {

      this.confirmReviewSubmit.nativeElement.click();      
      return;
    }
    

    if ( this.previewForm.get('previewTitle').value == "" ) {
      
        this.previewForm.patchValue({  

          previewTitle: this.story['title'],
        });      
    }

    if ( this.previewForm.get('previewSubtitle').value == "" ) {
          
        // let description = this.editStoryForm.get('description').value;
        let subTitle     = description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);
        
        this.previewForm.patchValue({  

          previewSubtitle: subTitle,
        });
    }
    
    var draftStory = {
      previewTitle: this.previewForm.get('previewTitle').value,
      previewSubtitle: this.previewForm.get('previewSubtitle').value,
      story: this.story['story_id'],
      username: localStorage.getItem('username'),
      type: this.previewForm.get('previewType').value,
      company_id: this.previewForm.get('company').value,
      have_company: this.previewForm.get('haveCompany').value,
      country: this.previewForm.get('country').value,
    };

    // stop here if form is invalid
    if (this.previewForm.invalid) {

      console.log('Validation error.');
      return;
    } else {

      this.closeReviewSubmit.nativeElement.click();
      this.storyService.submitForReview(draftStory).subscribe((response) => {

        // this.toggleView();
        this.router.navigate(['/user/story/list/drafts']);
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
        
        console.log('event.value', event.value);

        this.tags.push({
          tag_id:"",
          name:value.trim()
        });

        // save form fields
        this.storyService.addNewTagToStory(event.value, this.story['story_id']).subscribe((response) => {

          console.log('response', response);
        }, (error) => {

          console.log('error', error);
        });
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
      
      this.previewForm.controls['previewTags'].setValue(null);
    }

  }

  remove(tag, indx): void {
    
    this.tags.splice(indx, 1);
    this.allTags.push(tag);
    this.previewForm.controls['previewTags'].setValue(null);
    // save form fields

    // save form fields
    this.storyService.removeTagFromStory(tag.tag_id, this.story['story_id']).subscribe((response) => {

      console.log('response', response);
    }, (error) => {

      console.log('error', error);
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    
    this.tags.push(event.option.value);

    this.allTags = this.allTags.filter((tag) => { return tag.tag_id != event.option.value.tag_id })
    
    this.tagInput.nativeElement.value = '';
    this.previewForm.controls['previewTags'].setValue(null);

    // save form fields
    this.storyService.addTagToStory(event.option.value.tag_id, this.story['story_id']).subscribe((response) => {

      console.log('response', response);
    }, (error) => {

      console.log('error', error);
    });
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

    this.subGetStory.unsubscribe();
    this.subPreviewForm.unsubscribe();
  }
    
  
}
