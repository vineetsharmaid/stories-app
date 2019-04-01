import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const API_URL  =  environment.baseUrl+'/auth/users/';
// const JWT_Token  =  localStorage.getItem('jwtToken');

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + JWT_Token })
// };


@Injectable({
  providedIn: 'root'
})
export class StoryService {

  	constructor(private http: HttpClient) { }

  	saveDraft(story): Observable<any>{
			
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	

			return this.http.post(API_URL+'save_story', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	updateDraft(story): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
    	
			return this.http.post(API_URL+'update_story', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}


  	submitForReview(story): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
    	
			return this.http.post(API_URL+'submit_story_for_review', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	saveReview(story): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
    	
			return this.http.post(API_URL+'save_review_data', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}


  	getStory(storyId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_story/'+storyId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getDraftStories(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_user_draft_stories/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

		public uploadImage(image: File, story_id): Observable<string> {
	    

 			const formData = new FormData();
      formData.append('story_id', story_id);
      formData.append('image', image);

      const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));
      
      return this.http.post(API_URL+'image_upload', formData, {
          headers,
          responseType: 'text'
      });	    
	  }






handleError(error) {
   let errorMessage;
   if (error.error instanceof ErrorEvent) {
     // client-side error
     errorMessage = {'message': error.error.message};
   } else {
     // server-side error
     errorMessage = {'code': error.status, 'message': error.message, 'errorData': error.error};
   }

   return throwError(errorMessage);
 }




}