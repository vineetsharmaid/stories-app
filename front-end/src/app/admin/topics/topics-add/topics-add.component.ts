import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { TopicsService } from "../../../services/admin/topics.service";

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

@Component({
  selector: 'app-topics-add',
  templateUrl: './topics-add.component.html',
  styleUrls: ['./topics-add.component.css']
})

export class TopicsAddComponent implements OnInit {

	public addTopicForm: FormGroup;
	public formSubmitted: boolean = false;
	public formErrors: Array<string>;

	public filteredTopics: Array<object>;
	public limitOffset: number = 0;
	public selectedTopic: any = "";
	public searchTopic: any;
	public iconClass: any;

  	constructor(private formBuilder: FormBuilder, private topicsService: TopicsService, private router: Router) { }

  	ngOnInit() {

  	}

  	addTopic() {

  		this.formSubmitted = true;
	  		
			// stop here if form is invalid
			if (this.selectedTopic != "") {

				console.log('Validation error.');
				return;
			} else {

				var topic = { 'name': this.searchTopic, 'class': this.iconClass };

				this.topicsService.addTopics(topic).subscribe((response: Array<Object>) => {

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
