import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { ForumService } from '../../../services/forum.service';


import { environment } from '../../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

@Component({
  selector: 'app-user-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.css']
})
export class ForumListComponent implements OnInit {

	public viewType: string;
	public allQuestions: Array<object>;
	public allAnswers: Array<object>;
  public questionLimitOffset: number = 0;
  public answerLimitOffset: number = 0;
  userSubscription: Subscription;


  constructor(private activatedRoute: ActivatedRoute, private forumService: ForumService) { }
 
  ngOnInit() {


    this.userSubscription = this.activatedRoute.params.subscribe( (routeParams: Params) => {
        
        if ( routeParams['viewType'] ) {
          
          this.viewType = routeParams['viewType'];
        } else {

          this.viewType = 'questions';
        }
    })

    
    this.getUserQuestions(DEFAULT_LISTING_COUNT, 0, false);
    this.getUserAnswers(DEFAULT_LISTING_COUNT, 0, false);
  }

  getUserQuestions(limit, offset, isOnScroll) {

  	this.forumService.getUserQuestions(limit, offset).subscribe((response) => {

      if ( isOnScroll == true ) {
        
        Array.prototype.push.apply(this.allQuestions, response['data']);
      } else {

        this.allQuestions = response['data'];
      }

  	}, (error) => {

      if ( isOnScroll == false ) {
        this.allQuestions = [];
      }
  		console.log('error', error);
  	});
  }


  onQuestionScroll() {

    console.log('question scrolled!!', this.viewType);
    if ( this.viewType == 'questions' ) {
      
      this.questionLimitOffset += DEFAULT_LISTING_COUNT;
      this.getUserQuestions(DEFAULT_LISTING_COUNT , this.questionLimitOffset, true);
    }
  }

  onAnswerScroll() {

    console.log('answer scrolled!!', this.viewType);
    if ( this.viewType == 'answers' ) {
      
      this.answerLimitOffset += DEFAULT_LISTING_COUNT;
      this.getUserAnswers(DEFAULT_LISTING_COUNT , this.answerLimitOffset, true);
    }
  }


  getUserAnswers(limit, offset, isOnScroll) {

    this.forumService.getUserAnswers(limit, offset).subscribe((response) => {

      var answers = [];
      var i = 0;
      response['data'].forEach((answer) => {

        answers[i] = answer;

        if ( answer['answer'] == null ) {
          
          answers[i]['answer'] = answer['answer'];
        } else {

          answers[i]['answer'] = answer['answer'].replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,250);
          answers[i]['answer'] = answers[i]['answer'].length > 249 ?  answers[i]['answer']+'...' : answers[i]['answer'];
        }
        i++;
      });

      if ( isOnScroll == true ) {
        
        Array.prototype.push.apply(this.allAnswers, answers);
      } else {

        this.allAnswers = answers;
      }

      console.log('this.allAnswers', this.allAnswers);

    }, (error) => {

      if ( isOnScroll == false ) {
        this.allAnswers = [];
      }
      console.log('error', error);
    });
  }

  // deleteQuestion(questionId, index) {

  //   this.forumService.deleteDraftStory(storyId).subscribe((response) => {

  //     this.draftStories.splice(index, 1);
  //   }, (error) => {

  //     console.log('error', error);
  //   });
  // }

  // deleteAnswer(answerId, index) {

  //   this.forumService.deleteDraftStory(storyId).subscribe((response) => {

  //     this.draftStories.splice(index, 1);
  //   }, (error) => {

  //     console.log('error', error);
  //   });
  // }

}
