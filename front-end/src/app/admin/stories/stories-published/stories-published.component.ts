import { Component, OnInit } from '@angular/core';

import { StoriesService } from "../../../services/admin/stories.service";

@Component({
  selector: 'app-stories-published',
  templateUrl: './stories-published.component.html',
  styleUrls: ['./stories-published.component.css']
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

}
