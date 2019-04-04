import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';

import { StoriesService } from '../services/stories.service'
import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.css']
})
export class StoryDetailsComponent implements OnInit {

	public storyData: object;
	public displayStory: boolean = false;

  	constructor(private activatedRoute: ActivatedRoute, private storiesService : StoriesService) { }
 
  	ngOnInit() {

  		const slug = this.activatedRoute.snapshot.paramMap.get('slug');
  		this.getStory(slug);
  	}

  	getStory(slug) {

	    this.storiesService.getStoryData(slug).subscribe((response: Array<Object>) => {

	      	this.storyData = response['data'];
	      	
	       	this.storyData['preview_image'] = APP_URL+'/assets/uploads/'+this.storyData['preview_image'];
	      	
	      	this.displayStory = true;

	      console.log('getStories this.storyData', this.storyData);
	      
	    }, error => {

	    	this.storyData = {};
	    	this.displayStory = true;
	    	console.log('getstories error', error);
	    });
  }

  like() {

  	console.log('here', this.storyData['story_id']);

    this.storiesService.likeStory(this.storyData['story_id']).subscribe((response: Array<Object>) => {

      console.log('response likeStory', response);
      
    }, error => {
    	
    	console.log('getstories error', error);
    });  	
  }

}
