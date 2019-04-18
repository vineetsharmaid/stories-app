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

import { StoryService } from '../../services/story.service'

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
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


	separatorKeysCodes: number[] = [ENTER, COMMA];
	filteredTopics: Observable<string[]>;
  	topics: any = [];
  	allTopics: any = [];

	visible    = true;
	removable  = true;
	addOnBlur  = true;
	selectable = true;  	

  	@ViewChild('auto') matAutocomplete: MatAutocomplete;  
	@ViewChild('closeQuestionModal') closeQuestionModal: ElementRef;
  	@ViewChild('topicsInput') topicsInput: ElementRef<HTMLInputElement>;


  	constructor( private formBuilder: FormBuilder, private storyService : StoryService, private router: Router ) { }
 
  	ngOnInit() {

	  	this.addQuestionForm = this.formBuilder.group({

	  		title: ['', Validators.required],
	  		topics: [''],
	  	});

	  	this.getTopics();

  		this.filteredTopics = this.addQuestionForm.controls['topics'].valueChanges.pipe(
        	startWith(''),        
        	map((topic: string | null) => topic ? this._filterTopics(topic) : [])
    	);
  	}
	
  	getTopics() {

	    this.storyService.getTopics().subscribe((response) => {
	            
	      this.allTopics = response['data'];	      
	    }, (error) => {

	      this.allTopics = [];
	      console.log('error', error);
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

      this.storyService.addQuestion(question).subscribe((response) => {

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

		    this.storyService.addNewTopic(value.trim()).subscribe((response) => {

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
