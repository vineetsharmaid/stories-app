import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const API_URL  =  environment.baseUrl+'/api/';
const ADMIN_API_URL  =  environment.baseUrl+'/auth/admin/';
const JWT_Token  =  localStorage.getItem('jwtToken');

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + JWT_Token })
// };


@Injectable({
  providedIn: 'root'
})
export class CommentsService {
	
  	constructor(private http: HttpClient) { }

  	getComments(status): Observable<any>{
			
		let httpOptions = {
		  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};    	
		
		return this.http.get(ADMIN_API_URL+'get_comments/'+status, httpOptions);
	}

  	getFlaggedForumComments(status=false): Observable<any>{
			
		let httpOptions = {
		  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};    	
		
		return this.http.get(ADMIN_API_URL+'get_flagged_comments/', httpOptions);
	}

  	getForumComments(status): Observable<any>{
			
		let httpOptions = {
		  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};    	
		
		return this.http.get(ADMIN_API_URL+'get_forum_comments/'+status, httpOptions);
	}

	updateCommentStatus(commentId, status): Observable<any>{

 		const formData = new FormData();
      	formData.append('comment_id', commentId);
      	formData.append('status', status);
			
		const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));
		
		return this.http.post(ADMIN_API_URL+'update_comment_status/', formData, {headers});
	}

	updateForumCommentStatus(commentId, status): Observable<any>{

 		const formData = new FormData();
      	formData.append('comment_id', commentId);
      	formData.append('status', status);
			
		const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));
		
		return this.http.post(ADMIN_API_URL+'update_forum_comment_status/', formData, {headers});
	}

	deleteComment(commentId): Observable<any>{

 		const formData = new FormData();
      	formData.append('comment_id', commentId);
			
		const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));
		
		return this.http.post(ADMIN_API_URL+'delete_comment/', formData, {headers});
	}

	deleteForumComment(commentId): Observable<any>{

 		const formData = new FormData();
      	formData.append('comment_id', commentId);
			
		const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));
		
		return this.http.post(ADMIN_API_URL+'delete_forum_comment/', formData, {headers});
	}

	/** POST: get story by story id to the database */
	getStory (storyId): Observable<any> {
			
		let httpOptions = {
		  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};    	
	  
	  return this.http.get(ADMIN_API_URL+'get_story/'+storyId, httpOptions);
	}

	/** POST: update status of story */
	changeStatus (status, story_id): Observable<any> {

 		const formData = new FormData();
      	formData.append('review', status);
      	formData.append('story_id', story_id);
			
		const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

	  return this.http.post(ADMIN_API_URL+'update_story_status', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
	}



	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError(error: HttpErrorResponse) {
	  if (error.error instanceof ErrorEvent) {
	    // A client-side or network error occurred. Handle it accordingly.
	    console.error('An error occurred:', error.error.message);
	  } else {
	    // The backend returned an unsuccessful response code.
	    // The response body may contain clues as to what went wrong,
	    console.error(
	      `Backend returned code ${error.status}, ` +
	      `body was: ${error.error}`);
	  }
	  // return an observable with a user-facing error message
	  return throwError(
	    'Something bad happened; please try again later.');
	};



}
