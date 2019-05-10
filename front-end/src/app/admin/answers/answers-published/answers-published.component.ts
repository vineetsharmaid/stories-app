import { Component, OnInit } from '@angular/core';

import { ForumService } from "../../../services/admin/forum.service";
declare var $: any;

@Component({
  selector: 'app-answers-published',
  templateUrl: './answers-published.component.html',
  styleUrls: ['./answers-published.component.scss']
})
export class AnswersPublishedComponent implements OnInit {

	public answers: Array<Object>;
  	constructor(private forumService: ForumService) { }

  	ngOnInit() {

  		this.getanswers();
  	}

  	getanswers() {
	   	
	   	// 0: value for status pending
	    this.forumService.getAnswers(1).subscribe((response: Array<Object>) => {

	      var answers = response['data'];	      
	      answers.forEach((answer) => {

		      answer['answer'] = answer['answer'].replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,250);
	        answer['answer'] = answer['answer'].length > 249 ?  answer['answer']+'...' : answer['answer'];
	      	
	      });
	      
	      this.answers = answers;
	    }, error => {

	    	this.answers = [];
	    	console.log('getanswers error', error);
	    });
  	}

  	unPublishAnswer(answerID, authorID, index) {
	   	
	   	// 0: value for status unpublish
	    this.forumService.updateAnswerstatus(answerID, authorID, 0).subscribe((response: Array<Object>) => {

	      this.answers.splice(index, 1);	      
	      this.showNotification('top','center', 'success', 'Status updated succesfully');
	    }, error => {

	    	console.log('updateAnswerstatus error', error);
	    	this.showNotification('top','center', 'danger', 'Unable to update status');
	    });
  	}

  	deleteAnswer(answerID, index) {
	   	
	   	// 0: value for status pending
	    this.forumService.deleteAnswer(answerID).subscribe((response: Array<Object>) => {

	      this.answers.splice(index, 1);
	      this.showNotification('top','center', 'success', 'Question deleted succesfully');
	    }, error => {

	    	console.log('deleteAnswer error', error);
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
