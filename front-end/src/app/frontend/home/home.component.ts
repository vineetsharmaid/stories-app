import { Component, OnInit } from '@angular/core';

import { StoriesService } from '../services/stories.service'

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public stories: Array<object>;
	public featuredStories: Array<object>;

  constructor( private storiesService : StoriesService ) { }
 
  ngOnInit() {

  	this.getStories();
  	this.getFeaturedStories();
  }


	getStories() {
   	
    this.storiesService.getStories().subscribe((response: Array<Object>) => {

      	var stories = [];
      	response['data'].forEach((story) => {

        	if ( story['preview_image'] != "" ) {
          
          		story['preview_image'] = APP_URL+'/assets/uploads/stories/'+story['preview_image'];
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


}
