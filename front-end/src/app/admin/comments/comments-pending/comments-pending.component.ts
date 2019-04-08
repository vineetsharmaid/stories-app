import { Component, OnInit } from '@angular/core';

import { CommentsService } from "../../../services/admin/comments.service";

@Component({
  selector: 'app-comments-pending',
  templateUrl: './comments-pending.component.html',
  styleUrls: ['./comments-pending.component.css']
})
export class CommentsPendingComponent implements OnInit {

	public comments: Array<Object>;
  	constructor(private commentsService: CommentsService) { }

  	ngOnInit() {

  		this.getComments();
  	}

  	getComments() {
	   	
	   	// 0: value for pending approval in db
	    this.commentsService.getComments(0).subscribe((response: Array<Object>) => {

	      this.comments = response['data'];
	      console.log('getComments this.comments', this.comments);
	      
	    }, error => {

	    	this.comments = [];
	    	console.log('getComments error', error);
	    });
  	}

  	publish(commentId, index) {

	    this.commentsService.updateCommentStatus(commentId, 1).subscribe((response: Array<Object>) => {

	    	this.comments.splice(index, 1);
	      	console.log('updateCommentStatus response', response);	      
	    }, error => {

	    	console.log('updateCommentStatus error', error);
	    });
  	}

  	delete(commentId, index) {

	    this.commentsService.deleteComment(commentId).subscribe((response: Array<Object>) => {

	    	this.comments.splice(index, 1);
	      	console.log('deleteComment response', response);	      
	    }, error => {

	    	console.log('deleteComment error', error);
	    });
  	}

}
