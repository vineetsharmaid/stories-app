import { Component, OnInit } from '@angular/core';

import { StoriesService } from '../services/stories.service'

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public stories: Array<object>;
	public featuredStories: Array<object>;
  public dataLoading: boolean = true;
  public isLoggedIn: string = 'false';

  constructor( private storiesService : StoriesService ) { }
 
  ngOnInit() {

    this.isLoggedIn = localStorage.getItem('isLoggedIn');
  	this.getFeaturedStories();
  	this.getStories();
  }


	getStories() {
   	
    this.storiesService.getStories(DEFAULT_LISTING_COUNT, 0).subscribe((response: Array<Object>) => {

      	var stories = [];
      	response['data'].forEach((story) => {

        	if ( story['preview_image'] != "" ) {
          
          		story['preview_image'] = APP_URL+'/assets/uploads/stories/'+story['preview_image'];
        	}

        	stories.push(story);

      	})
      	
      this.stories = stories;
      this.dataLoading = false;
      
    }, error => {

    	this.stories = [];
      this.dataLoading = false;
    	console.log('getstories error', error);
    });
	}

	getFeaturedStories() {
   	
    this.storiesService.getfeaturedStories(4, 0).subscribe((response: Array<Object>) => {

      	var featuredStories = [];
      	response['data'].forEach((story) => {

        	if ( story['preview_image'] != "" ) {
          
          		story['preview_image'] = APP_URL+'/assets/uploads/stories/'+story['preview_image'];
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


  featuredLike(storyId, index) {

    this.storiesService.likeStory(storyId).subscribe((response: Array<Object>) => {

      this.featuredStories[index]['liked'] = true;
      this.featuredStories[index]['likes'] = parseInt(this.featuredStories[index]['likes']) + 1;
    }, error => {
      
      console.log('getstories error', error);
    });    
  }



}
