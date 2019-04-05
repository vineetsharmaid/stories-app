import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

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
  userSubscription: Subscription;


  constructor(private activatedRoute: ActivatedRoute, private storyService: StoryService) { }
 
  ngOnInit() {


    this.userSubscription = this.activatedRoute.params.subscribe( (routeParams: Params) => {
        
        if ( routeParams['viewType'] ) {
          
          this.viewType = routeParams['viewType'];
        } else {

          this.viewType = 'drafts';
        }
    })

    
    this.getDraftStories(); 
    this.getPublishedStories();
  }

  getDraftStories() {

  	this.storyService.getDraftStories().subscribe((response) => {

  		this.draftStories = response['data'];
  	}, (error) => {

      this.draftStories = [];
  		console.log('error', error);
  	});
  }

  getPublishedStories() {

    this.storyService.getPublishedStories().subscribe((response) => {

      this.publishedStories = response['data'];
    }, (error) => {

      this.publishedStories = [];
      console.log('error', error);
    });
  }

}
