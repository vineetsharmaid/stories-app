import { Component, OnInit } from '@angular/core';

import { CommentsService } from "../../../services/admin/comments.service";

@Component({
  selector: 'app-comments-published',
  templateUrl: './comments-published.component.html',
  styleUrls: ['./comments-published.component.scss']
})
export class CommentsPublishedComponent implements OnInit {

	public comments: Array<Object>;
  	constructor(private commentsService: CommentsService) { }

  	ngOnInit() {

  		this.getComments();
  	}

  	getComments() {
	   	
	   	// 0: value for pending approval in db
	    this.commentsService.getComments(1).subscribe((response: Array<Object>) => {

	      this.comments = response['data'];
	      console.log('getComments this.comments', this.comments);
	      
	    }, error => {

	    	this.comments = [];
	    	console.log('getComments error', error);
	    });
  	}

  	unPublish(commentId, index) {

	    this.commentsService.updateCommentStatus(commentId, 0).subscribe((response: Array<Object>) => {

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
