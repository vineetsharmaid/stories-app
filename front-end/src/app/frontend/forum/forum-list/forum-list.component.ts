import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable }         from 'rxjs';
import { map, startWith }     from 'rxjs/operators';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { ForumService } from '../../services/forum.service'

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const API_URL  =  environment.baseUrl+'/api/';
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.css']
})
export class ForumListComponent implements OnInit {

	public stories: Array<object>;
	public featuredStories: Array<object>;
	public addQuestionForm: FormGroup;
	public addAnswerForm: FormGroup;


	public separatorKeysCodes: number[] = [ENTER, COMMA];
	public filteredTopics: Observable<string[]>;
  public topics: any = [];
  public allTopics: any = [];
  public allQuestions: Array<object>;

	public visible    = true;
	public removable  = true;
	public addOnBlur  = true;
	public selectable = true;

  @ViewChild('auto') matAutocomplete: MatAutocomplete;  
	@ViewChild('closeQuestionModal') closeQuestionModal: ElementRef;
  @ViewChild('topicsInput') topicsInput: ElementRef<HTMLInputElement>;

  	public editorAnswerOptions: Object = {
  	// toolbarInline: true,  
  	placeholderText: null,
    // quickInsertButtons: ['image', 'table', 'ol', 'ul'],
  	toolbarButtons: [
	  	'bold', 'italic', 'underline', 'strikeThrough', 'formatOL', 'formatUL',
	  	'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 
	  	'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
  	],
  	toolbarButtonsSM: [
	  	'bold', 'italic', 'underline', 'strikeThrough', 'formatOL', 'formatUL',
	  	'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 
	  	'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
  	],
  	heightMin: 100,
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
      }, 
      'froalaEditor.image.error':  function  (e,  editor, error, images) {
        
        console.log('error', error);
      },

    },
    quickInsertTags: [], //to disable quick button
		// toolbarVisibleWithoutSelection: true, // shows toolbar when click anywhere on editor
	}


  	constructor( private formBuilder: FormBuilder, private forumService : ForumService, private router: Router ) { }
 
  	ngOnInit() {

	  	this.addQuestionForm = this.formBuilder.group({

	  		title: ['', Validators.required],
	  		topics: [''],
	  	});

	  	this.addAnswerForm = this.formBuilder.group({

	  		subject: [''],
	  		threadId: [''],
	  	});

	  	this.getTopics();
	  	this.getQuestionsList();

  		this.filteredTopics = this.addQuestionForm.controls['topics'].valueChanges.pipe(
        	startWith(''),        
        	map((topic: string | null) => topic ? this._filterTopics(topic) : [])
    	);
  	}
	
  	getTopics() {

	    this.forumService.getTopics().subscribe((response) => {
	            
	      this.allTopics = response['data'];	      
	    }, (error) => {

	      this.allTopics = [];
	      console.log('error', error);
	    });
  	}

  	getQuestionsList() {

	    this.forumService.getQuestionsList().subscribe((response) => {
				
				var questions = [];
				var i = 0;
	     	response['data'].forEach((question) => {

	     		questions[i] = question;
					questions[i]['profile_pic'] = question['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+question['profile_pic'];

					questions[i]['answer'] = question['answer'] == null ? question['answer'] : question['answer'].replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,250)+'...';
	     		i++;
	     	});

	      // this.allQuestions = response['data'];
	      this.allQuestions = questions;
	     	console.log('this.allQuestions', this.allQuestions);
	    }, (error) => {

	      this.allQuestions = [];
	      console.log('error', error);
	    });
  	}

  saveAnswer(threadId, questionIndex) {

  	var tempAnswer = this.allQuestions[questionIndex]['tempAnswer'];
  	tempAnswer = tempAnswer.replace(/<[^>]*>/g, ''); // remove html tags
  	tempAnswer = tempAnswer.replace(/\&nbsp;/g, ''); // remove &nbsp;

    // stop here if form is invalid
    if ( tempAnswer.trim() == "" ) {

      console.log('Validation error.');
      return;
    } else {
    	
    	let answer = {
    		'subject': this.allQuestions[questionIndex]['tempAnswer'],
    		'slug': this.allQuestions[questionIndex]['slug'],
    		'question_id': threadId,
    	}

      this.forumService.saveAnswer(answer).subscribe((response) => {

      		console.log('response', response);
      		console.log('Added question');
      		// Close login modal
  			this.closeQuestionModal.nativeElement.click();
      	this.router.navigateByUrl('/forum/question/'+response['data']['slug']);
      }, (error) => {

        console.log(error);
      });
    }
  }

  changeLikeStatus(answerId, index) {

    this.forumService.changeLikeStatus(answerId).subscribe((response) => {
	
    	console.log('response', response);
    	this.allQuestions[index]['likes'] = parseInt(this.allQuestions[index]['likes']) + 1;
    	this.allQuestions[index]['user_liked'] = 1;
    }, (error) => {

      console.log(error);
    });
  }


  addQuestion() {

    // stop here if form is invalid
    if (this.addQuestionForm.invalid) {

      console.log('Validation error.');
      return;
    } else {
    	
    	let topic_ids = [];
    	this.topics.forEach((topic) => { topic_ids.push(topic.topic_id) });

    	let question = {
    		'title': this.addQuestionForm.get('title').value,
    		'topics': topic_ids,
    	}

      this.forumService.addQuestion(question).subscribe((response) => {

      		console.log('response', response);
      		console.log('Added question');
      		// Close login modal
  			this.closeQuestionModal.nativeElement.click();
      		this.router.navigateByUrl('/forum/question/'+response['data']['slug']);
      }, (error) => {

        console.log(error);
      });
    }
  }


	add(event: MatChipInputEvent): void {

		// Add tag only when MatAutocomplete is not open
		// To make sure this does not conflict with OptionSelected Event
		if (!this.matAutocomplete.isOpen) {    

		  const input = event.input;
		  const value = event.value;

		  // Add new topic
		  if ((value || '').trim()) {

		    this.forumService.addNewTopic(value.trim()).subscribe((response) => {

		    	this.topics.push({
		    		'topic_id': response['data']['topic_id'], 
		    		'name': response['data']['topic_name']
		    	});
		    }, (error) => {

		      console.log('error', error);
		    });
		  }

		  // Reset the input value
		  if (input) {
		    input.value = '';
		  }
		  
		  this.addQuestionForm.controls['topics'].setValue(null);
		}

	}

	remove(tag, indx): void {

		this.topics.splice(indx, 1);
		this.allTopics.push(tag);
		this.addQuestionForm.controls['topics'].setValue(null);		
	}

	selected(event: MatAutocompleteSelectedEvent): void {

		this.topics.push(event.option.value);

		this.allTopics = this.allTopics.filter((topic) => { return topic.topic_id != event.option.value.topic_id })

		this.topicsInput.nativeElement.value = '';
		this.addQuestionForm.controls['topics'].setValue(null);
	}


	private _filterTopics(value: string): string[] {
		    
    	const filterValue = value.toString().toLowerCase();
    	console.log('filterValue', filterValue);
    	console.log('this.filteredTopics', this.filteredTopics);
    
    	return this.allTopics.filter( topic => topic.name.toLowerCase().startsWith(filterValue) );
  	}

}
