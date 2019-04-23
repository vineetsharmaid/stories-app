import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { TopicsService } from "../../../services/admin/topics.service";

@Component({
  selector: 'app-topics-edit',
  templateUrl: './topics-edit.component.html',
  styleUrls: ['./topics-edit.component.css']
})

export class TopicsEditComponent implements OnInit {

	public formSubmitted: boolean = false;
	public formErrors: Array<string>;

	public filteredTopics: Array<object>;
	public limitOffset: number = 0;
	public selectedTopic: any = "";
	public searchTopic: any;
	public iconClass: any;
	public topic: object;

  	constructor(private formBuilder: FormBuilder, 
  		private topicsService: TopicsService, 
  		private router: Router,
  		private activatedRoute: ActivatedRoute,) { }

  	ngOnInit() {
  		
  		this.getTopic();
  	}

  	getTopic() {
	   	
	   	const topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
	   	console.log('topicId', topicId);

	    this.topicsService.getTopic(topicId).subscribe((response: Array<Object>) => {

	      console.log('getTopic response', response);
	      this.topic = response['data'];
	      this.searchTopic = this.topic;
	      // this.displayFn(this.topic);
	      this.iconClass = this.topic['icon_class'];

	      console.log('this.searchTopic', this.searchTopic);
	      
	    }, error => {

	    	console.log('getTopic error', error);
	    });
  	}


  	editTopic() {

  		this.formSubmitted = true;
	  		
			// stop here if form is invalid
			if (this.searchTopic == "") {

				console.log('Validation error.');
				return;
			} else {

				var topicName = typeof this.searchTopic['name'] == 'undefined' ? this.searchTopic : this.searchTopic['name'];
				var topic = { 'name': topicName, 'class': this.iconClass, 'topic_id': this.topic['topic_id'] };

				this.topicsService.editTopic(topic).subscribe((response: Array<Object>) => {

					console.log('response', response);
					if ( response['status'] == true ) {
						
			      this.router.navigateByUrl('/admin/topics');
			    } else {

						this.formErrors = response['error'];
			    }
					
				}, error => {

					console.log('error', error);
				});

			}
		}


  	topicSearchChanged(event: any) {

  		if ( typeof event == 'object' ) {

  			this.selectedTopic = event.tag_id;
  			this.limitOffset = 0;
  			
  		} else {

  			this.selectedTopic  = "";
		    const filterValue = this.searchTopic.toString().toLowerCase();
		    if ( filterValue != '' ) {
		    	
		    	this.topicsService.searchTopics(filterValue).subscribe((response) => {

		    		this.filteredTopics = response['data'];
		    	}, (error) => {

		    		console.log('error', error);
		    		this.filteredTopics = [];
		    	});
		    } else {

		    	this.filteredTopics = [];
		    }
  		}
  	}

	displayFn(topic): Object | undefined {
		
		console.log('display topic', topic);
		return topic ? topic.name : undefined;
	}



}
