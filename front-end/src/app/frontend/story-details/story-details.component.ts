import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StoriesService } from '../services/stories.service'
import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.css']
})
export class StoryDetailsComponent implements OnInit {

	public storyData: object;
  public comments: Array<object>;
  public commentsForm: FormGroup;
	public displayStory: boolean = false;
	public displayStoryError: boolean = false;
  public isLoggedIn: string = 'false';

	constructor(private activatedRoute: ActivatedRoute, private storiesService : StoriesService, private formBuilder : FormBuilder) { }

	ngOnInit() {

    this.commentsForm = this.formBuilder.group({
      'comment': ['', Validators.required],
      'parent': [0],
    })

    this.isLoggedIn = localStorage.getItem('isLoggedIn');

		const slug = this.activatedRoute.snapshot.paramMap.get('slug');
		this.getStory(slug);
	}

	getStory(slug) {

    this.storiesService.getStoryData(slug).subscribe((response: Array<Object>) => {

      	this.storyData = response['data'];
        this.getStoryComments();
      	
       	this.storyData['preview_image'] = APP_URL+'/assets/uploads/'+this.storyData['preview_image'];
      	
      	this.displayStory = true;

      console.log('getStories this.storyData', this.storyData);
      
    }, error => {

    	this.storyData = {};
    	this.displayStoryError = true;
    	console.log('getstories error', error);
    });
  }

  getStoryComments() {

    this.storiesService.getStoryComments(this.storyData['story_id']).subscribe((response: Array<Object>) => {

      this.comments = response['data'];
      console.log('getStoryComments this.comments', this.comments);
      
    }, error => {

      this.comments = [];        
      console.log('getStoryComments error', error);
    });
  }

  addComment(parent_id, index) {


    // stop here if form is invalid
    if (this.commentsForm.invalid) {

      console.log('Validation error.');
      return;
    } else {
      
      console.log('Comment added.');
      console.log('index', index);

      var comment = {
          content: this.commentsForm.get('comment').value,
          story_id: this.storyData['story_id'],
          parent: parent_id,
        };

      this.storiesService.addStoryComment(comment).subscribe((response: Array<Object>) => {

        console.log('response', response);
        this.commentsForm.reset();
        
        // set position of new comment in the comments json
        typeof index == 'undefined' ? this.comments.push(response['data']) : this.comments[index]['children'].push(response['data']);
        console.log('this.comments', this.comments);
        
      }, error => {

        console.log('error', error);
      });

    }
  }

  like() {

  	console.log('here', this.storyData['story_id']);

    this.storiesService.likeStory(this.storyData['story_id']).subscribe((response: Array<Object>) => {

      console.log('response likeStory', response);
      
    }, error => {
    	
    	console.log('getstories error', error);
    });  	
  }

}
