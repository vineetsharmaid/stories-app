import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

	public questionData: Object;
  public commentForm: FormGroup;
  public allAnswers: Array<Object>;
  public answerByUser: Object;
  public isLoggedIn: string = 'false';

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
    imageUploadParam: 'answer_image',

    // Set the image upload URL.
    imageUploadURL: API_URL+'forum_answer_image_upload',

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


  	constructor( private router: Router, 
      private activatedRoute: ActivatedRoute, 
      private forumService: ForumService,
      private formBuilder: FormBuilder ) { }
 
  	ngOnInit() {

  		const slug = this.activatedRoute.snapshot.paramMap.get('slug');

      this.isLoggedIn = localStorage.getItem('isLoggedIn');

      this.commentForm = this.formBuilder.group({

        comment: ['', Validators.required],
        parent: [''],
      });
  		this.getQuestionInfo(slug);
  	}

    addComment(answerId, parentId, answerIndex, commentIndex) {
  
      // stop here if form is invalid
      if (this.commentForm.invalid) {

        console.log('Validation error.');
        return;
      } else {

        let comment = {
          'content': this.commentForm.get('comment').value,
          'parent': parentId,
          'answer_id': answerId,
        }

        this.forumService.addComment(comment).subscribe((response) => {

            var comment = response['data'];
            comment['profile_pic'] = comment['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+comment['profile_pic'];

            // Top level comment
            if ( typeof commentIndex == 'undefined' ) {
              
              // check for first comment
              if ( typeof this.allAnswers[answerIndex]['comments'] == 'undefined' ) {
                
                this.allAnswers[answerIndex]['comments'] = [];
              }
              
              this.allAnswers[answerIndex]['comments'].push(comment);              
              this.allAnswers[answerIndex]['comments_count']++;

            } else { // Child comments

              this.allAnswers[answerIndex]['comments'][commentIndex].children.push(comment);
              // hide comment box
              this.allAnswers[answerIndex]['comments'][commentIndex].addReply = false;
              this.allAnswers[answerIndex]['comments_count']++;
            }
            
            // reset form
            this.commentForm.patchValue({
                comment: ""
            });

            
        }, (error) => {

          console.log(error);
        });
      }
        

    }

    addCommentUserAnswer(answerId, parentId, answerIndex, commentIndex) {
  
      // stop here if form is invalid
      if (this.commentForm.invalid) {

        console.log('Validation error.');
        return;
      } else {

        let comment = {
          'content': this.commentForm.get('comment').value,
          'parent': parentId,
          'answer_id': answerId,
        }

        this.forumService.addComment(comment).subscribe((response) => {

            console.log('response', response);
            var comment = response['data'];
            comment['profile_pic'] = comment['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+comment['profile_pic'];

            // Top level comment
            if ( typeof commentIndex == 'undefined' ) {
              
              // check for first comment
              if ( typeof this.answerByUser['comments'] == 'undefined' ) {
                
                this.answerByUser['comments'] = [];
              }
              
              this.answerByUser['comments'].push(comment);
              this.answerByUser['comments_count']++;

            } else { // Child comments

              this.answerByUser['comments'][commentIndex].children.push(comment);
              // hide comment box
              this.answerByUser['comments'][commentIndex].addReply = false;
              this.answerByUser['comments_count']++;
            }
            
            // reset form
            this.commentForm.patchValue({
                comment: ""
            });
        }, (error) => {

          console.log(error);
        });
      }
    }

  	getQuestionInfo(slug) {

  		this.forumService.getQuestionInfo(slug).subscribe((response) => {

  			console.log('response', response);
  			this.questionData = response['data'];
        if( this.questionData['hasAnswered'] == 1) {

          this.getAnswerByUser(this.questionData['question_id']);
        }
        this.getAnswers(this.questionData['question_id']);
  		}, (error) => {

  			console.log('error', error);
  		});
  	}

    getAnswerByUser(threadId) {

      this.forumService.getAnswerByUser(threadId).subscribe((response) => {

        console.log('response', response);
        var answer = response['data'];
      
        answer['tempAnswer'] = ""; // for frontend purpose
        answer['showAnswerBox'] = false; // for frontend purpose
        answer['showAnswerEditBox'] = false; // for frontend purpose
        answer['profile_pic'] = answer['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+answer['profile_pic'];
      
        this.answerByUser = answer;
      }, (error) => {

        this.answerByUser = [];
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
          answers[i]['tempAnswer'] = ""; // for frontend purpose
          answers[i]['showAnswerBox'] = false; // for frontend purpose
          answers[i]['showAnswerEditBox'] = false; // for frontend purpose
          answers[i]['profile_pic'] = answer['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+answer['profile_pic'];
          i++;
         });
        this.allAnswers = answers;
      }, (error) => {

        this.allAnswers = [];
        console.log('error', error);
      });
    }


    loadComments(answerId, index) {

      this.forumService.getComments(answerId).subscribe((response) => {

        console.log('response', response);
        var comments = response['data'];
        comments.forEach((comment) => {

          comment['profile_pic'] = comment['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+comment['profile_pic'];
          comment.children.forEach((childComment) => {

            childComment['profile_pic'] = childComment['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+childComment['profile_pic'];
          }); 
        });

        this.allAnswers[index]['comments'] = comments;
        this.allAnswers[index]['showComments'] = true;
        console.log("this.allAnswers[index]['comments']", this.allAnswers[index]['comments']);
      }, (error) => {

        this.allAnswers[index]['comments'] = [];
        console.log('error', error);
      });
    }

    loadCommentsUserAnswer(answerId, index) {

      this.forumService.getComments(answerId).subscribe((response) => {

        console.log('response', response);
        var comments = response['data'];
        comments.forEach((comment) => {

          comment['profile_pic'] = comment['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+comment['profile_pic'];
          comment.children.forEach((childComment) => {

            childComment['profile_pic'] = childComment['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+childComment['profile_pic'];
          }); 
        });

        this.answerByUser['comments'] = comments;
        this.answerByUser['showComments'] = true;
      }, (error) => {

        this.answerByUser['comments'] = [];
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

            answers = answer;
            answers['tempAnswer'] = ""; // for frontend purpose
            answers['showAnswerBox'] = false; // for frontend purpose
            answers['showAnswerEditBox'] = false; // for frontend purpose
            answers['profile_pic'] = answer['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+answer['profile_pic'];
            answers['isEditable'] = true;
            i++;
           });
          this.answerByUser = answers;
          this.questionData['hasAnswered'] = 1;
        // this.router.navigateByUrl('/forum/question/'+response['data']['slug']);
      }, (error) => {

        console.log(error);
      });
    }
  }

  updateAnswer(answerId, index) {

    var tempAnswer = this.answerByUser['answer'];
    tempAnswer = tempAnswer.replace(/<[^>]*>/g, ''); // remove html tags
    tempAnswer = tempAnswer.replace(/\&nbsp;/g, ''); // remove &nbsp;

    // stop here if form is invalid
    if ( tempAnswer.trim() == "" ) {

      console.log('Validation error.');
      return;
    } else {
      
      let answer = {
        'subject': this.answerByUser['answer'],
        'slug': this.questionData['slug'],
        'answer_id': answerId,
      }

      this.forumService.updateAnswer(answer).subscribe((response) => {

          this.questionData['showAnswerBox'] = false;          
          this.answerByUser['showAnswerEditBox'] = false; // for frontend purpose
         
      }, (error) => {

        console.log(error);
      });
    }
  }

  changeLikeStatus(answerId, index) {

    this.forumService.changeLikeStatus(answerId).subscribe((response) => {
  
      console.log('response', response);
      this.allAnswers[index]['likes'] = parseInt(this.allAnswers[index]['likes']) + 1;
      this.allAnswers[index]['user_liked'] = 1;
    }, (error) => {

      console.log(error);
    });
  }



}
