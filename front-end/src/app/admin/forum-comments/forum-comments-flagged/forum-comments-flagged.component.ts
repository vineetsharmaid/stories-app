import { Component, OnInit } from '@angular/core';

import { CommentsService } from "../../../services/admin/comments.service";
declare var $: any;

@Component({
  selector: 'app-forum-comments-flagged',
  templateUrl: './forum-comments-flagged.component.html',
  styleUrls: ['./forum-comments-flagged.component.scss']
})
export class ForumCommentsFlaggedComponent implements OnInit {

	public comments: Array<Object>;
  	constructor(private commentsService: CommentsService) { }

  	ngOnInit() {

  		this.getFlaggedForumComments();
  	}

  	getFlaggedForumComments() {
	   	
	    this.commentsService.getFlaggedForumComments().subscribe((response: Array<Object>) => {

	      this.comments = response['data'];
	      
	    }, error => {

	    	this.comments = [];
	    	console.log('getForumComments error', error);
	    });
  	}

  	unPublish(commentId, index) {

	    this.commentsService.updateForumCommentStatus(commentId, 0).subscribe((response: Array<Object>) => {

	    	this.comments.splice(index, 1);
	      	console.log('updateForumCommentStatus response', response);	      
	    }, error => {

	    	console.log('updateForumCommentStatus error', error);
	    });
  	}
  	
  	delete(commentId, index) {

	    this.commentsService.deleteForumComment(commentId).subscribe((response: Array<Object>) => {

	    	this.comments.splice(index, 1);
	      this.showNotification('top','center', 'success', 'Comment deleted succesfully');
	    }, error => {

	    	console.log('deleteForumComment error', error);
	    	this.showNotification('top','center', 'danger', 'Unable to delete comment');
	    });
  	}

  	
		showNotification(from, align, color, message){

			$.notifyClose();
			
		  $.notify({
		      icon: "notifications",
		      message: message

		  },{
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
