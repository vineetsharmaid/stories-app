import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  public deleteStoryId: number;
  public deleteStoryIndex: number;
  userSubscription: Subscription;

  @ViewChild('deleteStoryModal')  deleteStoryModal: ElementRef;

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

  deleteStory(storyId, index) {

    this.storyService.deleteDraftStory(storyId).subscribe((response) => {

      this.draftStories.splice(index, 1);
    }, (error) => {

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

  confirmStoryDelete(deleteStoryId, deleteIndex) {

    this.deleteStoryId     = deleteStoryId;
    this.deleteStoryIndex  = deleteIndex;
    
    this.deleteStoryModal.nativeElement.click();
  }

}
