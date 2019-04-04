import { Component, OnInit } from '@angular/core';

import { StoriesService } from '../services/stories.service'

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;


@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

	public stories: Array<object>;

  	constructor( private storiesService : StoriesService ) { }
 
  	ngOnInit() {

  		this.getStories();
  	}

  	getStories() {
	   	
	    this.storiesService.getStories().subscribe((response: Array<Object>) => {

	      	var stories = [];
	      	response['data'].forEach((story) => {

	        	if ( story['preview_image'] != "" ) {
	          
	          		story['preview_image'] = APP_URL+'/assets/uploads/'+story['preview_image'];
	        	}

	        	stories.push(story);

	      	})
	      	
	      	this.stories = stories;

	      console.log('getStories this.stories', this.stories);
	      
	    }, error => {

	    	this.stories = [];
	    	console.log('getstories error', error);
	    });
  	}


}
