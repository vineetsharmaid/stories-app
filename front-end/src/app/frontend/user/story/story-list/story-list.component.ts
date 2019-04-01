import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StoryService } from '../../../services/story.service';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {

	public viewType: string;
	public draftStories: Array<object>;
	public publishedStories: Array<object>;

  constructor(private activatedRoute: ActivatedRoute, private storyService: StoryService) { }
 
  ngOnInit() {

  	this.getDraftStories();

  	const routeParams = this.activatedRoute.snapshot.params;
  	if ( routeParams['viewType'] ) {
  		
  		this.viewType = routeParams['viewType'];
  	} else {

  		this.viewType = 'drafts';
  	}

  }

  getDraftStories() {

  	this.storyService.getDraftStories().subscribe((response) => {

  		console.log('response', response);
  		this.draftStories = response['data'];
  	}, (error) => {

  		console.log('error', error);
  	});
  }

}
