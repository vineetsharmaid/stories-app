import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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
	public storyTitle;
	public addStoryForm: FormGroup;

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

  constructor(private formBuilder: FormBuilder) { }
 
  ngOnInit() {

  	this.addStoryForm = this.formBuilder.group({

  		title: [' <p style="font-size: 24px;">  </p>', Validators.required],
  		description: [' ', Validators.required],
  	});
  }

  saveDraft() {

    // stop here if form is invalid
    if (this.addStoryForm.invalid) {

    	console.log('Validation error.');
      return;
    } else {

    	this.toggleView();
			console.log('Data saved to draft');
		}
  }

  toggleView() {

  	this.showNewForm = this.showNewForm == false ? true : false;
  	this.showPreview = this.showPreview == false ? true : false;
  }

}
