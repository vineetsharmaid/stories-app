import { Component, OnInit } from '@angular/core';

import { StoriesService } from "../../../services/admin/stories.service";

@Component({
  selector: 'app-stories-pending',
  templateUrl: './stories-pending.component.html',
  styleUrls: ['./stories-pending.component.css']
})
export class StoriesPendingComponent implements OnInit {

	public stories: Array<Object>;
  	constructor(private storiesService: StoriesService) { }

  	ngOnInit() {

  		this.getStories();
  	}

  	getStories() {
	   	
	   	// 2: value for "submitted for review" in db
	    this.storiesService.getStories(2).subscribe((response: Array<Object>) => {

	      this.stories = response['data'];
	      console.log('getStories this.stories', this.stories);
	      
	    }, error => {

	    	this.stories = [];
	    	console.log('getstories error', error);
	    });
  	}

}
