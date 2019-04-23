import { Component, OnInit } from '@angular/core';

import { CommentsService } from "../../../services/admin/comments.service";

@Component({
  selector: 'app-forum-comments-published',
  templateUrl: './forum-comments-published.component.html',
  styleUrls: ['./forum-comments-published.component.scss']
})
export class ForumCommentsPublishedComponent implements OnInit {

	public comments: Array<Object>;
  	constructor(private commentsService: CommentsService) { }

  	ngOnInit() {

  		this.getForumComments();
  	}

  	getForumComments() {
	   	
	   	// 0: value for pending approval in db
	    this.commentsService.getForumComments(1).subscribe((response: Array<Object>) => {

	      this.comments = response['data'];
	      console.log('getForumComments this.comments', this.comments);
	      
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
	      	console.log('deleteForumComment response', response);	      
	    }, error => {

	    	console.log('deleteForumComment error', error);
	    });
  	}

}
