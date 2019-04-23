import { Component, OnInit } from '@angular/core';

import { CommentsService } from "../../../services/admin/comments.service";

@Component({
  selector: 'app-forum-comments-pending',
  templateUrl: './forum-comments-pending.component.html',
  styleUrls: ['./forum-comments-pending.component.css']
})
export class ForumCommentsPendingComponent implements OnInit {

	public comments: Array<Object>;
  	constructor(private commentsService: CommentsService) { }

  	ngOnInit() {

  		this.getForumComments();
  	}

  	getForumComments() {
	   	
	   	// 0: value for pending approval in db
	    this.commentsService.getForumComments(0).subscribe((response: Array<Object>) => {

	    	var comments = response['data'];
	    	comments.forEach((comment) => {

					comment['answer'] = comment['answer'] == null ? comment['answer'] : comment['answer'].replace(/<\/?.+?>/ig, ' ').replace(/\s+/g, " ").substring(0,250);
					comment['answer'] = comment['answer'].length > 249 ?  comment['answer']+'...' : comment['answer'];
	    	})
	      this.comments = comments;
	      console.log('getForumComments this.comments', this.comments);
	      
	    }, error => {

	    	this.comments = [];
	    	console.log('getForumComments error', error);
	    });
  	}

  	publish(commentId, index) {

	    this.commentsService.updateForumCommentStatus(commentId, 1).subscribe((response: Array<Object>) => {

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
