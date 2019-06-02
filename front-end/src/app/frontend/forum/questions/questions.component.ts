import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const WEB_URL  =  environment.webUrl;
const API_URL  =  environment.baseUrl+'/api/';
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

import { ForumService } from '../../services/forum.service'
import { SharedService } from "../../services/shared.service";

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
  public dataLoading: boolean = true;
  public currentUserId: string = localStorage.getItem('user_id');
  public editor:any;
  
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
      private sharedService: SharedService,
      private formBuilder: FormBuilder ) { }
 
  	ngOnInit() {

  		const slug = this.activatedRoute.snapshot.paramMap.get('slug');

      this.isLoggedIn = localStorage.getItem('isLoggedIn');
      this.sharedService.currentMessage.subscribe(message => console.log('detail message', message) );

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
            comment['helpful'] = 0;

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

            var comment = response['data'];
            comment['profile_pic'] = comment['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+comment['profile_pic'];
            comment['helpful'] = 0;

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

  			
  			this.questionData = response['data'];

        this.questionData['profile_pic'] = this.questionData['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+this.questionData['profile_pic'];
        if( this.questionData['hasAnswered'] == 1) {

          this.getAnswerByUser(this.questionData['question_id']);
        } else {

          this.answerByUser = {};
        }
        
        this.questionData['shareSlug'] = WEB_URL+'/forum/question/'+this.questionData['slug'];
        this.getAnswers(this.questionData['question_id']);
        
  		}, (error) => {

  			console.log('error', error);
  		});
  	}

    getAnswerByUser(threadId) {

      this.forumService.getAnswerByUser(threadId).subscribe((response) => {

        
        var answer = response['data'];
      
        answer['tempAnswer'] = ""; // for frontend purpose
        answer['showAnswerBox'] = false; // for frontend purpose
        answer['showAnswerEditBox'] = false; // for frontend purpose
        answer['profile_pic'] = answer['profile_pic'] == "" ? "" : APP_URL+'/assets/uploads/users/'+answer['profile_pic'];
      
        this.answerByUser = answer;
      }, (error) => {

        this.answerByUser = {};
        console.log('error', error);
      });
    }

    getAnswers(threadId) {

      this.forumService.getAnswers(threadId).subscribe((response) => {

        
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
        // hide loader
        this.dataLoading = false;
      }, (error) => {

        this.allAnswers = [];
        // hide loader
        this.dataLoading = false;
        console.log('error', error);
      });
    }


    loadComments(answerId, index) {

      this.forumService.getComments(answerId).subscribe((response) => {

        
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
      
      // remove froala text
      if(this.questionData['tempAnswer'].indexOf('<p data-f-id="pbf"') > 0) {
        
        this.questionData['tempAnswer'] = this.questionData['tempAnswer'].substring(0, this.questionData['tempAnswer'].indexOf('<p data-f-id="pbf"'));
      }

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

      // remove froala text
      if(this.answerByUser['answer'].indexOf('<p data-f-id="pbf"') > 0) {
        
        this.answerByUser['answer'] = this.answerByUser['answer'].substring(0, this.answerByUser['answer'].indexOf('<p data-f-id="pbf"'));
      }
            
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
    
      this.allAnswers[index]['likes'] = parseInt(this.allAnswers[index]['likes']) + 1;
      this.allAnswers[index]['user_liked'] = 1;
    }, (error) => {

      console.log(error);
    });
  }

  changeHelpfulStatus(answerId, index, byUser=false) {

    this.forumService.changeHelpfulStatus(answerId).subscribe((response) => {
      
      if( byUser ) {

        this.answerByUser['helpful'] = parseInt(this.answerByUser['helpful']) + 1;
        this.answerByUser['user_helpful'] = 1;        
      } else {

        this.allAnswers[index]['helpful'] = parseInt(this.allAnswers[index]['helpful']) + 1;
        this.allAnswers[index]['user_helpful'] = 1;
      }       
    }, (error) => {

      console.log(error);
    });
  }

  reportForumAnswer(answerId, index, byUser=false) {


    if( this.answerByUser['author_id'] == this.currentUserId || this.allAnswers[index]['author_id'] == this.currentUserId ) {
      
      return;
    }

    this.forumService.reportForumAnswer(answerId).subscribe((response) => {
      
      if( byUser ) {

        this.answerByUser['flagged'] = true;
      } else {

        this.allAnswers[index]['flagged'] = true;
      }
    }, (error) => {

      console.log(error);
    });
  }

  changeCommentHelpfulStatus(commentId, answerIndex, index, parentIndex, answerType) {


    let commentAuthor;
    if(answerType == 'userAnswer') {
      
      commentAuthor = parentIndex >= 0 ? this.answerByUser['comments'][parentIndex]['children'][index]['user_id'] : this.answerByUser['comments'][index]['user_id'];
    } else {

      commentAuthor = parentIndex >= 0 ? this.allAnswers[answerIndex]['comments'][parentIndex]['children'][index]['user_id'] : this.allAnswers[answerIndex]['comments'][index]['user_id'];
    } 

    if( commentAuthor == this.currentUserId ) {
      
      return;
    }

    this.forumService.changeCommentHelpfulStatus(commentId).subscribe((response) => {
      
      if(answerType == 'userAnswer') {
        
        if(parentIndex >= 0) {
          
          this.answerByUser['comments'][parentIndex]['children'][index]['helpful'] = parseInt(this.answerByUser['comments'][parentIndex]['children'][index]['helpful']) + 1;
          this.answerByUser['comments'][parentIndex]['children'][index]['user_helpful'] = 1;
        } else {

          this.answerByUser['comments'][index]['helpful'] = parseInt(this.answerByUser['comments'][index]['helpful']) + 1;
          this.answerByUser['comments'][index]['user_helpful'] = 1;
        }
      }

      if(answerType == 'publicAnswer') {
        
        if(parentIndex >= 0) {
          
          this.allAnswers[answerIndex]['comments'][parentIndex]['children'][index]['helpful'] = parseInt(this.allAnswers[answerIndex]['comments'][parentIndex]['children'][index]['helpful']) + 1;
          this.allAnswers[answerIndex]['comments'][parentIndex]['children'][index]['user_helpful'] = 1;
        } else {

        this.allAnswers[answerIndex]['comments'][index]['helpful'] = parseInt(this.allAnswers[answerIndex]['comments'][index]['helpful']) + 1;
        this.allAnswers[answerIndex]['comments'][index]['user_helpful'] = 1;
        } 

      }
    }, (error) => {

      console.log(error);
    });
  }

  reportAnswerComment(commentId, answerIndex, index, parentIndex, answerType) {

    let commentAuthor;
    if(answerType == 'userAnswer') {
      
      commentAuthor = parentIndex >= 0 ? this.answerByUser['comments'][parentIndex]['children'][index]['user_id'] : this.answerByUser['comments'][index]['user_id'];
    } else {

      commentAuthor = parentIndex >= 0 ? this.allAnswers[answerIndex]['comments'][parentIndex]['children'][index]['user_id'] : this.allAnswers[answerIndex]['comments'][index]['user_id'];
    } 

    if( commentAuthor == this.currentUserId ) {
      
      return;
    }

    this.forumService.reportAnswerComment(commentId).subscribe((response) => {
      
      if(answerType == 'userAnswer') {
        
        if(parentIndex >= 0) {
          
          this.answerByUser['comments'][parentIndex]['children'][index]['flagged'] = true;
        } else {

          this.answerByUser['comments'][index]['flagged'] = true;
        }
      }

      if(answerType == 'publicAnswer') {
        
        if(parentIndex >= 0) {
          
          this.allAnswers[answerIndex]['comments'][parentIndex]['children'][index]['flagged'] = 1;
        } else {

        this.allAnswers[answerIndex]['comments'][index]['flagged'] = 1;
        } 

      }
    }, (error) => {

      console.log(error);
    });
  }

  showLoginPopup() {

    this.sharedService.changeMessage("show_login");
  }


  EditorCreated(quill) {

      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', this.imageHandler.bind(this));
      this.editor = quill;
  }

  imageHandler() {
    const Imageinput = document.createElement('input');
    Imageinput.setAttribute('type', 'file');
    Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
    Imageinput.classList.add('ql-image');

    Imageinput.addEventListener('change', () =>  {
      const file = Imageinput.files[0];
      console.log('file', file);
      if (Imageinput.files != null && Imageinput.files[0] != null) {
          this.forumService.uploadAnswerImage(file).subscribe(res => {
            
            console.log('res', res);
            this.pushImageToEditor(res['link']);
          });
      }
  });

    Imageinput.click();
  }
  pushImageToEditor(returnedURL) {
    const range = this.editor.getSelection(true);
    const index = range.index + range.length;
    this.editor.insertEmbed(range.index, 'image', returnedURL, 'user');
  }

}
