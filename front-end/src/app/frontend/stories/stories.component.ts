import { Component, OnInit } from '@angular/core';

import { StoriesService } from '../services/stories.service'

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const WEB_URL  =  environment.webUrl;
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

	public stories: Array<object>;
	public featuredStories: Array<object>;

  	constructor( private storiesService : StoriesService ) { }
 
  	ngOnInit() {

  		this.getStories();
  		this.getFeaturedStories();
  	}

  	getStories() {
	   	
	    this.storiesService.getStories(DEFAULT_LISTING_COUNT, 0).subscribe((response: Array<Object>) => {

	      	var stories = [];
	      	response['data'].forEach((story) => {

	        	if ( story['preview_image'] != "" ) {
	          
	          		story['preview_image'] = APP_URL+'/assets/uploads/stories/'+story['preview_image'];
	          		story['shareSlug'] = WEB_URL+'/story/'+story['slug'];
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

	getFeaturedStories() {
	   	
	    this.storiesService.getfeaturedStories(1, 0).subscribe((response: Array<Object>) => {

	      	var featuredStories = [];
	      	response['data'].forEach((story) => {

	        	if ( story['preview_image'] != "" ) {
	          
	          		story['preview_image'] = APP_URL+'/assets/uploads/stories/'+story['preview_image'];
	          		story['shareSlug'] = WEB_URL+'/story/'+story['slug'];
	        	}

	        	featuredStories.push(story);

	      	})
	      	
	      	this.featuredStories = featuredStories;

	      console.log('getfeaturedStories this.featuredStories', this.featuredStories);
	      
	    }, error => {

	    	this.featuredStories = [];
	    	console.log('getfeaturedStories error', error);
	    });
	}


  like(storyId, index) {

    this.storiesService.likeStory(storyId).subscribe((response: Array<Object>) => {

      this.stories[index]['liked'] = true;
      this.stories[index]['likes'] = parseInt(this.stories[index]['likes']) + 1;
    }, error => {
      
      console.log('getstories error', error);
    });    
  }

  likeFeatured(storyId) {

    this.storiesService.likeStory(storyId).subscribe((response: Array<Object>) => {

      this.featuredStories[0]['liked'] = true;
      this.featuredStories[0]['likes'] = parseInt(this.featuredStories[0]['likes']) + 1;
    }, error => {
      
      console.log('getstories error', error);
    });
  }


}
