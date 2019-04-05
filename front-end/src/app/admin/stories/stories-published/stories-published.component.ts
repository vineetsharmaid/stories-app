import { Component, OnInit } from '@angular/core';

import { StoriesService } from "../../../services/admin/stories.service";

@Component({
  selector: 'app-stories-published',
  templateUrl: './stories-published.component.html',
  styleUrls: ['./stories-published.component.scss']
})
export class StoriesPublishedComponent implements OnInit {

	public stories: Array<Object>;
  	constructor(private storiesService: StoriesService) { }

  	ngOnInit() {

  		this.getStories();
  	}

  	getStories() {
	   	
	   	// 2: value for "submitted for review" in db
	    this.storiesService.getStories(1).subscribe((response: Array<Object>) => {

	      this.stories = response['data'];
	      console.log('getStories this.stories', this.stories);
	      
	    }, error => {

	    	this.stories = [];
	    	console.log('getstories error', error);
	    });
  	}

  	updateFeatured(storyId, index) {

  		

  		// this.stories.forEach((story, storyIndex) => {

  		// 	if(this.stories[index]['story_id'] == ) {

  		// 	}
  		// });
	   	
	    this.storiesService.updateFeatured(storyId).subscribe((response: Array<Object>) => {

	      	console.log('updateFeatured response', response);
  			this.stories[index]['featured'] = this.stories[index]['featured'] == 1 ? 0 : 1;
	      
	    }, error => {

	    	console.log('updateFeatured error', error);
	    });
  	}

}
