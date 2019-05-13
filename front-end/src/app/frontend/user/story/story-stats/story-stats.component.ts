import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { StoryService } from '../../../services/story.service';

@Component({
  selector: 'app-story-stats',
  templateUrl: './story-stats.component.html',
  styleUrls: ['./story-stats.component.css']
})
export class StoryStatsComponent implements OnInit {

  public viewType: string;
	public storyId: number;
  public story: object;
  public storyViews: Array<object>;
	public dataLoading: boolean = true;
  
  constructor(private activatedRoute: ActivatedRoute, private storyService: StoryService) { }
 
  ngOnInit() {
    
    this.getUserStoryDetails();
    this.getstoryViews();
  }

  getUserStoryDetails() {
  
    this.storyId = +this.activatedRoute.snapshot.paramMap.get('storyId');

    this.storyService.getUserStoryDetails(this.storyId).subscribe((response) => {

      this.story = response['data'][0];
      console.log('getUserStoryDetails response', response);
    }, (error) => {

      this.story = [];
      console.log('getUserStoryDetails error', error);
    });
  }

  getstoryViews() {
  
    this.storyId = +this.activatedRoute.snapshot.paramMap.get('storyId');

  	this.storyService.getstoryViews(this.storyId).subscribe((response) => {
      this.dataLoading = false;
      this.storyViews = response['data'];
      console.log('getstoryViews response', response);
    }, (error) => {

      this.storyViews = [];
      this.dataLoading = false;
      console.log('getstoryViews error', error);
  	});
  }

}
