import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const API_URL  =  environment.baseUrl+'/api/';
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

import { ForumService } from '../../services/forum.service'


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

	public questionData = Object;
  public allAnswers = Array<Object>;

  public editorAnswerOptions: Object = {
    // toolbarInline: true,  
    placeholderText: null,
    // quickInsertButtons: ['image', 'table', 'ol', 'ul'],
    toolbarButtons: [
      'bold', 'italic', 'underline', 'strikeThrough', 'formatOL', 'formatUL',
      'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 
      'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
    ],
    toolbarButtonsSM: [
      'bold', 'italic', 'underline', 'strikeThrough', 'formatOL', 'formatUL',
      'insertImage', 'insertLink', 'link', '-', 'paragraphFormat', 
      'align' , 'quote', 'undo', 'redo', 'paragraphStyle', 'insertHR', 'selectAll', 'clearFormatting'
    ],
    heightMin: 200,
    charCounterCount: false,

    // Set the image upload parameter.
    imageUploadParam: 'description_image',

    // Set the image upload URL.
    imageUploadURL: API_URL+'story_description_image_upload',

    // Additional upload params.
    imageUploadParams: {id: 'my_editor'},

    // Set request type.
    imageUploadMethod: 'POST',

    // Set max image size to 5MB.
    imageMaxSize: 5 * 1024 * 1024,

    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    events:  {
      'froalaEditor.initialized':  function () {
        console.log('initialized');
      },
      'froalaEditor.image.beforeUpload':  function  (e,  editor,  images) {
        
        //Your code 
      }, 
      'froalaEditor.image.error':  function  (e,  editor, error, images) {
        
        console.log('error', error);
      },

    },
    quickInsertTags: [], //to disable quick button
    // toolbarVisibleWithoutSelection: true, // shows toolbar when click anywhere on editor
  }


  	constructor( private router: Router, private activatedRoute: ActivatedRoute, private forumService: ForumService ) { }
 
  	ngOnInit() {

  		const slug = this.activatedRoute.snapshot.paramMap.get('slug');
  		this.getQuestionInfo(slug);
  	}

  	getQuestionInfo(slug) {

  		this.forumService.getQuestionInfo(slug).subscribe((response) => {

  			console.log('response', response);
  			this.questionData = response['data'];
        this.getAnswers(this.questionData['question_id']);
  		}, (error) => {

  			console.log('error', error);
  		});
  	}

    getAnswers(threadId) {

      this.forumService.getAnswers(threadId).subscribe((response) => {

        console.log('response', response);
        var answers = [];
        var i = 0;
        response['data'].forEach((answer) => {

          answers[i] = answer;
          answers[i]['profile_pic'] = answer['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+answer['profile_pic'];
          i++;
         });
        this.allAnswers = answers;
      }, (error) => {

        this.allAnswers = [];
        console.log('error', error);
      });
    }

  saveAnswer(threadId) {

    var tempAnswer = this.questionData['tempAnswer'];
    tempAnswer = tempAnswer.replace(/<[^>]*>/g, ''); // remove html tags
    tempAnswer = tempAnswer.replace(/\&nbsp;/g, ''); // remove &nbsp;

    // stop here if form is invalid
    if ( tempAnswer.trim() == "" ) {

      console.log('Validation error.');
      return;
    } else {
      
      let answer = {
        'subject': this.questionData['tempAnswer'],
        'slug': this.questionData['slug'],
        'question_id': threadId,
      }

      this.forumService.saveAnswer(answer).subscribe((response) => {

          this.questionData['showAnswerBox'] = false;
          
          var answers = [];
          var i = 0;
          response['data']['answer'].forEach((answer) => {

            answers[i] = answer;
            answers[i]['profile_pic'] = answer['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+answer['profile_pic'];
            i++;
           });
          this.allAnswers = answers;
        // this.router.navigateByUrl('/forum/question/'+response['data']['slug']);
      }, (error) => {

        console.log(error);
      });
    }
  }    
}
