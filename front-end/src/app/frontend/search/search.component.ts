import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { StoriesService } from '../services/stories.service'
import { StoryService } from '../services/story.service'

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const WEB_URL  =  environment.webUrl;
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	public stories: Array<object> = [];
	public filteredTags: Array<object>;
	public filteredTypes: Array<object>;
	public filteredAuthors: Array<object>;
	public allTypes: Array<object>;
  public allCountries: Array<object>;
  public allTags: Array<object>;
  public selectedCountry: string;  	
	public typingTimer: any;
	public searchText: any;
	public searchTag: any;
	public searchType: any;
	public selectedTag: any = "";
	public selectedType: any = "";
	public searchAuthor: any;
	public selectedAuthor: string = "";
	public doneTypingInterval: number = 5000;
	public limitOffset: number = 0;

  	constructor( private storyService : StoryService,private storiesService : StoriesService, private router: Router, private activatedRoute: ActivatedRoute ) { }
 
  	ngOnInit() {

  		this.allTypes = [
  				{type_id: 1, name: 'Workplace Stories'},
  				{type_id: 2, name: 'Business Stories'},
  			];

  		this.filteredTypes = this.allTypes;
  		this.getCountries();
  		this.getTags();
  		// Look for changes in the query params
  		this.trackQueryParams();
  	}



	  like(storyId, index) {

	    this.storiesService.likeStory(storyId).subscribe((response: Array<Object>) => {

	      this.stories[index]['liked'] = true;
	      this.stories[index]['likes'] = parseInt(this.stories[index]['likes']) + 1;
	    }, error => {
	      
	      console.log('getstories error', error);
	    });    
	  }


  	trackQueryParams() {

  		this.activatedRoute.queryParams.subscribe(queryParams => {
		    
		    if ( typeof queryParams['q'] !== 'undefined' && queryParams['q'] != '' ) {
		    	
		    	this.searchText = queryParams['q'];
		    }

		    if ( typeof queryParams['type'] !== 'undefined' && queryParams['type'] != '' ) {
		    	
		    	this.selectedType = queryParams['type'];		    	
  				
				let type = this.allTypes.filter((type) => this.selectedType == type['type_id']);
		    	if ( type.length > 0 ) {
		    		
		    		this.searchType = type[0];
		    	}
		    }

		    if ( typeof queryParams['tag'] !== 'undefined' && queryParams['tag'] != '' ) {
		    	
		    	this.selectedTag = queryParams['tag'];

				this.storiesService.getTag(this.selectedTag).subscribe((response: Array<Object>) => {

					this.filteredTags = response['data'];
					this.searchTag = this.filteredTags[0];

				}, (error) => {

					console.log('get tag error', error);
					this.filteredTags = [];
				});

		    }

		    if ( typeof queryParams['author'] !== 'undefined' && queryParams['author'] != '' ) {
		    	
		    	this.selectedAuthor = queryParams['author'];

		    	this.storiesService.getAuthor(this.selectedAuthor).subscribe((response) => {

		    		this.filteredAuthors = response['data'];
					this.searchAuthor = this.filteredAuthors[0];
		    	}, (error) => {

		    		console.log('error', error);
		    		this.filteredAuthors = [];
		    	});		    	
  				
		    }
		    
		    this.limitOffset = 0;
  			this.getStories(DEFAULT_LISTING_COUNT , this.limitOffset, false);
		});  		
  	}

  	onScroll() {
	    
	    this.limitOffset += DEFAULT_LISTING_COUNT;
	    this.getStories(DEFAULT_LISTING_COUNT , this.limitOffset, true);
	}

  	getStories(limit, offset, isOnScroll) {
	   	
	   	var searchData = { 
	   		'search_tag': typeof this.selectedTag == 'undefined' ? "" : this.selectedTag,
	   		'search_type': typeof this.selectedType == 'undefined' ? "" : this.selectedType, 
	   		'search_text': typeof this.searchText == 'undefined' ? "" : this.searchText, 
	   		// 'search_author': typeof this.selectedAuthor == 'undefined' ? "" : this.selectedAuthor,
	   		'search_country': typeof this.selectedCountry == 'undefined' ? "" : this.selectedCountry,
	   	};
  	
	    this.storiesService.searchStories(searchData, limit, offset).subscribe((response: Array<Object>) => {

	      	if ( response['data'].length > 0 ) {
	      		
	      		var stories = [];
		      	response['data'].forEach((story) => {

		        	if ( story['preview_image'] != "" ) {
		          
		          		story['preview_image'] = APP_URL+'/assets/uploads/stories/'+story['preview_image'];
		          		story['shareSlug'] = WEB_URL+'/story/'+story['slug'];
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
	    	console.log('getstories error', error);
	    });
  	}


  	typeSearchChanged(event: any) {

  		if ( typeof event == 'object' ) {
  			
  			this.selectedType = event.type_id;
  			this.limitOffset = 0;
  			this.getStories(DEFAULT_LISTING_COUNT , this.limitOffset, false);
  		} else {

  			this.selectedType  = "";
		    const filterValue = this.searchType.toString().toLowerCase();
		    if ( filterValue != '' ) {

		    	this.filteredTypes = this.allTypes.filter(type => type['name'].toLowerCase().indexOf(filterValue) === 0);
		    } else {

		    	this.filteredTypes = [];
		    }
  		}
  	}


	displayFnType(type): Object | undefined {
		
		return type ? type.name : undefined;
	}

  getCountries() {

    this.storiesService.getCountries().subscribe((response) => {

      this.allCountries = response;
    }, (error) => {

      this.allCountries = [];
      console.log('error', error);
    });
  }

  getTags() {

    this.storiesService.getTags().subscribe((response) => {

      this.allTags = this.filteredTags = response['data'];
    }, (error) => {

      this.allTags = this.filteredTags = [];
      console.log('error', error);
    });
  }

  countryChanged(country) {
    
    this.selectedCountry = country;
    this.limitOffset = 0;
    this.getStories(DEFAULT_LISTING_COUNT , this.limitOffset, false);
  }


  tagSearchChanged(event: any) {

    if ( typeof event == 'object' ) {
      
      this.selectedTag = event.tag_id;
      this.limitOffset = 0;
      this.getStories(DEFAULT_LISTING_COUNT , this.limitOffset, false);
    } else {
      // this.selectedTag  = "";
      const filterValue = event.toString().toLowerCase();
      if ( filterValue != '' ) {
        
        this.filteredTags = this.allTags.filter((tag) => {

          return tag['name'].toString().toLowerCase().includes(filterValue);
        });
      } else {

        this.filteredTags = this.allTags;
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
  			this.limitOffset = 0;
  			this.getStories(DEFAULT_LISTING_COUNT , this.limitOffset, false);
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

  		this.limitOffset = 0;
  		this.router.navigate(['search'], { queryParams: { q: this.searchText } });
  	}



}
