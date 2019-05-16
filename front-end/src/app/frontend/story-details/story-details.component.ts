import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StoriesService } from '../services/stories.service'
import { SharedService } from "../services/shared.service";
import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const WEB_URL  =  environment.webUrl;

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.css'],
})
export class StoryDetailsComponent implements OnInit {

	public storyData: object;
  public comments: Array<object>;
  public commentsForm: FormGroup;
	public displayStory: boolean = false;
  public dataLoading: boolean = true;
	public displayStoryError: boolean = false;
  public showCommentBox: boolean = false;
  public isLoggedIn: string = 'false';

	constructor(private activatedRoute: ActivatedRoute, 
    private sharedService: SharedService,
    private storiesService : StoriesService, 
    private formBuilder : FormBuilder) { }

	ngOnInit() {

    this.commentsForm = this.formBuilder.group({
      'comment': ['', Validators.required],
      'parent': [0],
    })

    this.sharedService.currentMessage.subscribe(message => console.log('detail message', message) );

    this.isLoggedIn = localStorage.getItem('isLoggedIn');

		const slug = this.activatedRoute.snapshot.paramMap.get('slug');
		this.getStory(slug);
	}

	getStory(slug) {

    this.storiesService.getStoryData(slug).subscribe((response: Array<Object>) => {

      	this.storyData = response['data'];
        this.getStoryComments();
      	
       	this.storyData['preview_image'] = APP_URL+'/assets/uploads/stories/'+this.storyData['preview_image'];
        this.storyData['profile_pic'] = APP_URL+'/assets/uploads/users/'+this.storyData['profile_pic'];
        this.storyData['shareSlug'] = WEB_URL+'/story/'+this.storyData['slug'];

      	this.displayStory = true;
        this.dataLoading  = false;
            
        if( this.isLoggedIn == 'true' ) {

          this.updateStoryViewCount();
        }
      
    }, error => {

    	this.storyData = {};
    	this.displayStoryError = true;
      this.dataLoading  = false;
    	console.log('getstories error', error);
    });
  }

  getStoryComments() {

    this.storiesService.getStoryComments(this.storyData['story_id']).subscribe((response: Array<Object>) => {

      this.comments = response['data'];
      this.comments.forEach((comment) => {

        comment['profile_pic'] = comment['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+comment['profile_pic'];

        if( comment['children'].length > 0 ) {
          comment['children'].forEach((childComment) => {
            
            childComment['profile_pic'] = childComment['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+childComment['profile_pic'];
          });          
        }
      });

      console.log('getStoryComments this.comments', this.comments);
      
    }, error => {

      this.comments = [];        
      console.log('getStoryComments error', error);
    });
  }

  updateStoryViewCount() {

    this.storiesService.updateStoryViewCount(this.storyData['story_id']).subscribe((response: Array<Object>) => {
      
      console.log('updateStoryViewCount response', response);
    }, error => {

      console.log('updateStoryViewCount error', error);
    });
  }

  addComment(parent_id, index) {


    // stop here if form is invalid
    if (this.commentsForm.invalid) {

      console.log('Validation error.');
      return;
    } else {
      
      var comment = {
          content: this.commentsForm.get('comment').value,
          story_id: this.storyData['story_id'],
          parent: parent_id,
        };

      this.storiesService.addStoryComment(comment).subscribe((response: Array<Object>) => {

        this.commentsForm.reset();
        
        var comment = response['data'];
        // set position of new comment in the comments json
        if (typeof index == 'undefined') {
          // set children for child comments
          comment['children'] = [];
          comment['profile_pic'] = APP_URL+'/assets/uploads/users/'+comment['profile_pic'];
          
          this.comments.push(comment)
          // update property to hide comment box in frontend
          this.showCommentBox = false;
        } else {

          comment['profile_pic'] = APP_URL+'/assets/uploads/users/'+comment['profile_pic'];
          this.comments[index]['children'].push(comment);
          // update property to hide comment box in frontend
          this.comments[index]['addReply'] = false;
        }
      }, error => {

        console.log('error', error);
      });

    }
  }

  like() {

    this.storiesService.likeStory(this.storyData['story_id']).subscribe((response: Array<Object>) => {

      this.storyData['liked'] = true;
    }, error => {
      
      console.log('likeStory error', error);
    });    
  }

  reportStory() {

    this.storiesService.reportStory(this.storyData['story_id']).subscribe((response: Array<Object>) => {

      this.storyData['flagged'] = true;
    	console.log('reportStory response', response);
    }, error => {
      
      console.log('reportStory error', error);
    });  	
  }

  showLoginPopup() {

    this.sharedService.changeMessage("show_login");
  }

}
