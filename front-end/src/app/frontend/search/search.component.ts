import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { StoriesService } from '../services/stories.service'
import { StoryService } from '../services/story.service'

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	public stories: Array<object>;	
	public filteredTags: Array<object>;
	public filteredAuthors: Array<object>;
	public typingTimer: any;
	public searchText: any;
	public searchTag: any;
	public selectedTag: any = "";
	public searchAuthor: any;
	public selectedAuthor: string = "";
	public doneTypingInterval: number = 5000;

  	constructor( private storyService : StoryService,private storiesService : StoriesService, private router: Router, private activatedRoute: ActivatedRoute ) { }
 
  	ngOnInit() {

  		this.activatedRoute.queryParams.subscribe(queryParams => {
		    
		    if ( queryParams['q'] != '' ) {
		    	
		    	this.searchText = queryParams['q'];
  				this.getStories(5, 0);
		    }
		});

  	}


  	getStories(limit, offset) {
	   	
	   	var searchData = { 
	   		'search_tag': this.selectedTag, 
	   		'search_text': this.searchText, 
	   		'search_author': this.selectedAuthor,
	   	};

	    this.storiesService.searchStories(searchData, limit, offset).subscribe((response: Array<Object>) => {

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

  	tagSearchChanged(event: any) {


  		if ( typeof event == 'object' ) {
  			
  			this.selectedTag = event.tag_id;
  			this.getStories(5, 0);
  		} else {

  			this.selectedTag  = "";
		    const filterValue = this.searchTag.toString().toLowerCase();
		    if ( filterValue != '' ) {
		    	
		    	this.storiesService.searchTags(filterValue).subscribe((response) => {

		    		this.filteredTags = response['data'];
		    	}, (error) => {

		    		console.log('error', error);
		    		this.filteredTags = [];
		    	});
		    } else {

		    	this.filteredTags = [];
		    }
  		}
  	}


	displayFn(tag): Object | undefined {
		
		return tag ? tag.name : undefined;
	}

  	authorSearchChanged(event: any) {
  		
  		console.log('authorSearchChanged event', event);

  		if ( typeof event == 'object' ) {
  			
  			this.selectedAuthor = event.author_id;
  			this.getStories(5, 0);
  		} else {

  			this.selectedAuthor = "";
		    const filterValue = this.searchAuthor.toString().toLowerCase();
		    if ( filterValue != '' ) {
		    	
		    	this.storiesService.searchAuthors(filterValue).subscribe((response) => {

		    		this.filteredAuthors = response['data'];
		    	}, (error) => {

		    		console.log('error', error);
		    		this.filteredAuthors = [];
		    	});
		    } else {

		    	this.selectedAuthor  = "";
		    	this.filteredAuthors = [];
		    }	
		}
  	}

	displayFnAuthor(author): Object | undefined {
		
		return author ? author.first_name+' '+author.last_name : undefined;
	}

  	startCountDown(event: any) {

  		if(event.keyCode == 13) {
			
			this.doneTyping();
		} else {

	  		// clearTimeout(this.typingTimer);
	  		// this.typingTimer = setTimeout(() => {
	  		// 	this.doneTyping()
	  		// }, this.doneTypingInterval);
		}
  	}

  	clearCountDown() {

  		clearTimeout(this.typingTimer);
  	}

  	doneTyping() {

  		console.log('search now', this.searchText);
  		this.router.navigate(['search'], { queryParams: { q: this.searchText } });
  	}



}
