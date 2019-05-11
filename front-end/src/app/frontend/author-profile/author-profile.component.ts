import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { StoriesService } from '../services/stories.service'
import { StoryService } from '../services/story.service'
import { UserService } from '../services/user.service'

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

@Component({
  selector: 'app-author-profile',
  templateUrl: './author-profile.component.html',
  styleUrls: ['./author-profile.component.css']
})
export class AuthorProfileComponent implements OnInit {

	public stories: Array<object> = [];
	public limitOffset: number = 0;
	public username: string;
	public author: Array<object>;

  	constructor( 
  		private storiesService : StoriesService, 
  		private storyService : StoryService, 
  		private userService : UserService, 
  		private router: Router, 
  		private activatedRoute: ActivatedRoute ) { }
 
  	ngOnInit() {

  		this.username = this.activatedRoute.snapshot.paramMap.get('username');
  		this.getAuthorInfo();
  		this.getAuthorStories(DEFAULT_LISTING_COUNT , this.limitOffset, false);
  	}

	  like(storyId, index) {

	    this.storiesService.likeStory(storyId).subscribe((response: Array<Object>) => {

	      this.stories[index]['liked'] = true;
	      this.stories[index]['likes'] = parseInt(this.stories[index]['likes']) + 1;
	    }, error => {
	      
	      console.log('like error', error);
	    });    
	  }

  	onScroll() {
	    
	    this.limitOffset += DEFAULT_LISTING_COUNT;
	    this.getAuthorStories(DEFAULT_LISTING_COUNT , this.limitOffset, true);
		}

  	getAuthorStories(limit, offset, isOnScroll) {
	   	
	    this.storiesService.getAuthorStories(this.username, limit, offset).subscribe((response: Array<Object>) => {

	      	if ( response['data'].length > 0 ) {
	      		
	      		var stories = [];
		      	response['data'].forEach((story) => {

		        	if ( story['preview_image'] != "" ) {
		          
		          		story['preview_image'] = APP_URL+'/assets/uploads/stories/'+story['preview_image'];
		        	}

		        	stories.push(story);

		      	})
		      	
		      	if ( isOnScroll == true ) {
		      		
		      		Array.prototype.push.apply(this.stories, stories);
		      	} else {

		      		this.stories = stories;
		      	}
	      	}
	      
	    }, error => {


	      	if ( isOnScroll == false ) {	      		
	      		
	    		this.stories = [];
	      	}
	    	console.log('getAuthorStories error', error);
	    });
  	}


  getAuthorInfo() {

  	this.userService.getAuthorInfo(this.username).subscribe( (response) => {

  		console.log('response', response);
			this.author = response['data'][0];
      this.author['cover_pic'] = this.author['cover_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.author['cover_pic'];
      this.author['profile_pic'] = this.author['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.author['profile_pic'];
      
  	}, (error) => {

  		console.log('error', error['code']);
  		if ( error['code'] == 401 ) {
  			// authentication error show login popup
  		}
  	});
  }

}
