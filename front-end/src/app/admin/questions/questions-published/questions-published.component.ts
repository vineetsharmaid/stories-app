import { Component, OnInit } from '@angular/core';

import { ForumService } from "../../../services/admin/forum.service";
declare var $: any;

@Component({
  selector: 'app-questions-published',
  templateUrl: './questions-published.component.html',
  styleUrls: ['./questions-published.component.scss']
})
export class QuestionsPublishedComponent implements OnInit {

	public questions: Array<Object>;
  	constructor(private forumService: ForumService) { }

  	ngOnInit() {

  		this.getQuestions();
  	}

  	getQuestions() {
	   	
	   	// 1: value for status published
	    this.forumService.getQuestions(1).subscribe((response: Array<Object>) => {

	      this.questions = response['data'];
	      console.log('getQuestions this.questions', this.questions);
	      
	    }, error => {

	    	this.questions = [];
	    	console.log('getQuestions error', error);
	    });
  	}


  	unPublishQuestion(questionID, index) {
	   	
	   	// 0: value for status unpublish
	    this.forumService.updateQuestionStatus(questionID, 0).subscribe((response: Array<Object>) => {

	      this.questions.splice(index, 1);	      
	      this.showNotification('top','center', 'success', 'Status updated succesfully');
	    }, error => {

	    	console.log('updateQuestionStatus error', error);
	    	this.showNotification('top','center', 'danger', 'Unable to update status');
	    });
  	}

  	deleteQuestion(questionID, index) {
	   	
	   	// 0: value for status pending
	    this.forumService.deleteQuestion(questionID).subscribe((response: Array<Object>) => {

	      this.questions.splice(index, 1);
	      this.showNotification('top','center', 'success', 'Question deleted succesfully');
	    }, error => {

	    	console.log('deleteQuestion error', error);
	    	this.showNotification('top','center', 'danger', 'Unable to delete question');
	    });
  	}

		showNotification(from, align, color, message){

			$.notifyClose();

		  $.notify({
		      icon: "notifications",
		      message: message

		  },{
		  		newest_on_top: true,
		      type: color,
		      delay:1000,
		      timer: 3000,
		      placement: {
		          from: from,
		          align: align
		      },
		      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
		        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
		        '<i class="material-icons" data-notify="icon">notifications</i> ' +
		        '<span data-notify="title">{1}</span> ' +
		        '<span data-notify="message">{2}</span>' +
		        '<div class="progress" data-notify="progressbar">' +
		          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
		        '</div>' +
		        '<a href="{3}" target="{4}" data-notify="url"></a>' +
		      '</div>'
		  });
		}  	  	

}
