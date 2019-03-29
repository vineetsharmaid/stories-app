import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

import { StoryService } from '../../../services/story.service';

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
	public storyTitle;
	public editStoryForm: FormGroup;
	public previewForm: FormGroup;
	public selectedFile: ImageSnippet;
	public filePath: string;
  public previousUrl: string;
	public storyId: number;
  public story: Object;


	public editorTitleOptions: Object = {
  	toolbarInline: true,  
  	placeholderText: null,
    // quickInsertButtons: ['image', 'table', 'ol', 'ul'],
  	toolbarButtons: [
	  	'bold', 'italic', 'underline', 'strikeThrough', 'align', 'quote', 'undo', 'redo', 'selectAll', 'clearFormatting', 'fontSize'
  	],
  	toolbarButtonsSM: [
	  	'bold', 'italic', 'underline', 'strikeThrough', 'align', 'quote', 'undo', 'redo', 'selectAll', 'clearFormatting', 'fontSize'
  	],
  	fontSize: ['18', '20', '24'],
  	fontSizeSelection: true,
  	fontSizeDefaultSelection: '24',
  	heightMin: 100,
    heightMax: 100,
  	charCounterCount: false,
    quickInsertTags: [], //to disable quick button
		// toolbarVisibleWithoutSelection: true, // shows toolbar when click anywhere on editor
	}

	public editorStoryOptions: Object = {
  	toolbarInline: true,  
  	placeholderText: null,
    quickInsertButtons: ['image', 'table', 'ol', 'ul'],
  	toolbarButtons: [
	  	'bold', 'italic', 'underline', 'strikeThrough', 
	  	'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 
	  	'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
  	],
  	toolbarButtonsSM: [
	  	'bold', 'italic', 'underline', 'strikeThrough', 
	  	'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 
	  	'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
  	],
  	heightMin: 400,
    heightMax: 600,
  	charCounterCount: false,
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

  		previewTitle: ['', Validators.required],
  		previewSubtitle: ['', Validators.required],
  		// previewImage: ['', Validators.required],
  	});
    
    this.getStory();
  }

  getStory() {


    this.storyId = +this.activatedRoute.snapshot.paramMap.get('storyId');

    this.storyService.getStory(this.storyId).subscribe(
      (response) => {

        console.log('response', response);
        this.story = response['data'][0];
        console.log('this.story', this.story);

        this.editStoryForm.patchValue({  

          title: this.story['title'],
          description: this.story['description'],
        });


        if ( this.story['preview_title'] == "" && this.story['preview_subtitle'] == "" ) {
            
            this.showPreview = true;          
            this.showNewForm = false;
        } else {
            
            this.showPreview = true;          
            this.showNewForm = false;           
        }

      }, (error) => {

        console.log('error', error);
      });
  }

	// convenience getter for easy access to form fields
  get as() { return this.editStoryForm.controls; }    
  get pf() { return this.previewForm.controls; }    

  saveDraft() {

    var draftStory = {
			title: this.editStoryForm.get('title').value,
			description: this.editStoryForm.get('description').value,
			username: localStorage.getItem('username')
		};

		let description = this.editStoryForm.get('description').value;
		let subTitle 		= description.replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,140);

		this.previewForm.patchValue({	

			previewTitle: this.editStoryForm.get('title').value,
			previewSubtitle: subTitle,
		});

		console.log('draftStory', draftStory);
		console.log('subTitle', subTitle);

    // stop here if form is invalid
    if (this.editStoryForm.invalid) {

    	console.log('Validation error.');
      return;
    } else {

    	this.storyService.saveDraft(draftStory).subscribe((response) => {

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

}
