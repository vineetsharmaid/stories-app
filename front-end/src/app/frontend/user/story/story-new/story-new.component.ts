import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';

import { trigger, transition, animate, style } from '@angular/animations'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StoryService } from '../../../services/story.service';

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

  constructor(private formBuilder: FormBuilder, private storyService: StoryService, private router: Router) {


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
  	});

  	this.previewForm = this.formBuilder.group({

  		previewTitle: ['', Validators.required],
  		previewSubtitle: ['', Validators.required],
  		// previewImage: ['', Validators.required],
  	});

    // subscribe to changes on add story form
    this.onChanges();
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
  get as() { return this.addStoryForm.controls; }    
  get pf() { return this.previewForm.controls; }    

  saveDraft() {

    var draftStory = {
			title: this.addStoryForm.get('title').value,
			description: this.addStoryForm.get('description').value,
			username: localStorage.getItem('username')
		};

		let description = this.addStoryForm.get('description').value;
		let subTitle 		= description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);

		this.previewForm.patchValue({	

			previewTitle: this.addStoryForm.get('title').value,
			previewSubtitle: subTitle,
		});

    // stop here if form is invalid
    if (this.addStoryForm.invalid) {

    	console.log('Validation error.');
      return;
    } else {

    	this.storyService.saveDraft(draftStory).subscribe((response) => {

				console.log('Data saved to draft');
    		
    		this.storyId = response['data']['story'];

    	}, (error) => {

    		console.log(error);
    	});

		}
  }

  updateDraft() {

    let description = this.addStoryForm.get('description').value;
    let subTitle     = description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);

    this.previewForm.patchValue({  

      previewTitle: this.addStoryForm.get('title').value,
      previewSubtitle: subTitle,
    });

    var draftStory = {
      story_id: this.storyId,
      title: this.addStoryForm.get('title').value,
      description: this.addStoryForm.get('description').value,
      previewTitle: this.previewForm.get('previewTitle').value,
      previewSubtitle: this.previewForm.get('previewSubtitle').value,
      username: localStorage.getItem('username'),
    };

    // stop here if form is invalid
    if (this.addStoryForm.invalid) {

      console.log('Validation error.');
      return;
    } else {

      this.storyService.updateDraft(draftStory).subscribe((response) => {

        console.log('Data updated in draft');        
        this.storyId = response['data']['story']['story_id'];

      }, (error) => {

        console.log(error);
      });

    }
  }


  submitDraft() {

    this.addStorySubmitted = true;

    let description = this.addStoryForm.get('description').value;
    let subTitle     = description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);

    this.previewForm.patchValue({  

      previewTitle: this.addStoryForm.get('title').value,
      previewSubtitle: subTitle,
    });

    var draftStory = {
      title: this.addStoryForm.get('title').value,
      description: this.addStoryForm.get('description').value,
      previewTitle: this.previewForm.get('previewTitle').value,
      previewSubtitle: this.previewForm.get('previewSubtitle').value,
      story: this.storyId,
      username: localStorage.getItem('username')
    };

    console.log('draftStory', draftStory);    

    // stop here if form is invalid
    if (this.addStoryForm.invalid) {

      console.log('Validation error.');
      return;
    } else {

      this.storyService.saveDraft(draftStory).subscribe((response) => {

        console.log('Data saved to draft');
        
        this.storyId = response['data']['story'];

        this.router.navigate(["/user/story/edit/"+this.storyId, {'new': 'true'}]);
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
      console.log('this.selectedFile', this.selectedFile);

      // this.imageService.uploadImage(this.selectedFile.file).subscribe(
      //   (res) => {
        
      //   },
      //   (err) => {
        
      //   })
    });

    reader.readAsDataURL(file);
  }  


  ngOnDestroy() {

    // this.subAddForm.unsubscribe();
  }


}
