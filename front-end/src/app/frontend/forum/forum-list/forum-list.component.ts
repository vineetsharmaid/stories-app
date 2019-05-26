import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable }         from 'rxjs';
import { map, startWith }     from 'rxjs/operators';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { ForumService } from '../../services/forum.service'
import { SharedService } from "../../services/shared.service";

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const WEB_URL  =  environment.webUrl;
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
  public dataLoading: boolean = true;
  public loggedIn: boolean = false;
  public currentUserId: string = localStorage.getItem('user_id');


	public separatorKeysCodes: number[] = [ENTER, COMMA];
	public filteredTopics: Observable<string[]>;
  public topics: any = [];
  public allTopics: any = [];
  public searchedTopics: any;
  public searchedQuestion: any;
  public sidebarTopics: Array<object>;
  public allQuestions: Array<object>;
  public limitOffset: number = 0;

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
    imageUploadParam: 'answer_image',

    // Set the image upload URL.
    imageUploadURL: API_URL+'forum_answer_image_upload',

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


  	constructor( private formBuilder: FormBuilder, 
      private forumService : ForumService, 
      private sharedService: SharedService,
      private activatedRoute : ActivatedRoute, 
      private router: Router ) { }
 
  	ngOnInit() {


      if( localStorage.getItem('isLoggedIn') == 'true' ) {

        this.loggedIn = true;
      }

	  	this.getTopics();
      this.getSidebarTopics();
      this.sharedService.currentMessage.subscribe(message => console.log('detail message', message) );

	  	this.addQuestionForm = this.formBuilder.group({

	  		title: ['', Validators.required],
	  		topics: [''],
	  	});

	  	this.addAnswerForm = this.formBuilder.group({

	  		subject: [''],
	  		threadId: [''],
	  	});


      this.activatedRoute.queryParams.subscribe(queryParams => {
        
        if ( typeof queryParams['q'] !== 'undefined' && queryParams['q'] != '' ) {
          
          this.searchedQuestion = queryParams['q']
        }

        if ( typeof queryParams['topic'] !== 'undefined' && queryParams['topic'] != '' ) {
          
          this.searchedTopics = queryParams['topic'];
        }
  	  	
        this.limitOffset = 0;
        this.getQuestionsList(DEFAULT_LISTING_COUNT , this.limitOffset, false);
      });

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

    getSidebarTopics() {

      this.forumService.getSidebarTopics().subscribe((response) => {
              
        this.sidebarTopics = response['data'];        
      }, (error) => {

        this.sidebarTopics = [];
        console.log('error', error);
      });
    }

    onScroll() {

      console.log('scrolled!!');
      this.limitOffset += DEFAULT_LISTING_COUNT;
      this.getQuestionsList(DEFAULT_LISTING_COUNT , this.limitOffset, true);
    }

  	getQuestionsList(limit, offset, isOnScroll) {


      var searchData = { 
        'search_question': typeof this.searchedQuestion == 'undefined' ? "" : this.searchedQuestion,
        'search_topic': typeof this.searchedTopics == 'undefined' ? "" : this.searchedTopics,
      };

	    this.forumService.getQuestionsList(searchData, limit, offset).subscribe((response) => {
				
				var questions = [];
				var i = 0;
	     	response['data'].forEach((question) => {

	     		questions[i] = question;
					questions[i]['profile_pic'] = question['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+question['profile_pic'];
          questions[i]['shareSlug'] = WEB_URL+'/forum/question/'+questions[i]['slug'];

          if ( question['answer'] == null ) {
            
            questions[i]['answer'] = question['answer'];
          } else {

					  questions[i]['answer'] = question['answer'].replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,250);
            questions[i]['answer'] = questions[i]['answer'].length > 249 ?  questions[i]['answer']+'...' : questions[i]['answer'];
          }
	     		i++;
	     	});

	      // this.allQuestions = response['data'];
	      
        if ( isOnScroll == true ) {
          
          Array.prototype.push.apply(this.allQuestions, questions);
        } else {

          this.allQuestions = questions;
        }

        // hide loader
	     	this.dataLoading = false;
	    }, (error) => {

        if ( isOnScroll == false ) {            
          
	        this.allQuestions = [];
        }
        // hide loader
        this.dataLoading = false;
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

      // remove froala text
      if(this.allQuestions[questionIndex]['tempAnswer'].indexOf('<p data-f-id="pbf"') > 0) {
        
        this.allQuestions[questionIndex]['tempAnswer'] = this.allQuestions[questionIndex]['tempAnswer'].substring(0, this.allQuestions[questionIndex]['tempAnswer'].indexOf('<p data-f-id="pbf"'));
      }
          	
    	let answer = {
    		'subject': this.allQuestions[questionIndex]['tempAnswer'],
    		'slug': this.allQuestions[questionIndex]['slug'],
    		'question_id': threadId,
    	}

      this.forumService.saveAnswer(answer).subscribe((response) => {

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
  
      
      this.allQuestions[index]['likes'] = parseInt(this.allQuestions[index]['likes']) + 1;
      this.allQuestions[index]['user_liked'] = 1;
    }, (error) => {

      console.log(error);
    });
  }


  changeHelpfulStatus(answerId, index) {

    this.forumService.changeHelpfulStatus(answerId).subscribe((response) => {
  
      
      this.allQuestions[index]['helpful'] = parseInt(this.allQuestions[index]['helpful']) + 1;
      this.allQuestions[index]['user_helpful'] = 1;
    }, (error) => {

      console.log(error);
    });
  }

  reportForumAnswer(answerId, index) {

    this.forumService.reportForumAnswer(answerId).subscribe((response) => {
	  	
    	this.allQuestions[index]['flagged'] = true;
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

  showLoginPopup() {

    this.sharedService.changeMessage("show_login");
  }
}
