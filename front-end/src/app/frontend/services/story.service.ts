import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const API_URL  =  environment.baseUrl+'/api/';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  	constructor(private http: HttpClient) { }

  	saveDraft(story): Observable<any>{
    	
			return this.http.post(API_URL+'save_story', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	updateDraft(story): Observable<any>{
    	
			return this.http.post(API_URL+'update_story', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}


  	submitForReview(story): Observable<any>{
    	
			return this.http.post(API_URL+'submit_story_for_review', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	saveReview(story): Observable<any>{
    	
			return this.http.post(API_URL+'save_review_data', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}


  	getStory(storyId): Observable<any>{
    	
			return this.http.get(API_URL+'get_story/'+storyId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

		public uploadImage(image: File, story_id): Observable<Response> {
	    // const formData = new FormData();

	    // formData.append('image', image);

	    // return this.http.post(API_URL+'image_upload', formData);

			// return this.http.post(API_URL+'image_upload', image, httpOptions)
	  //   .pipe(
	  //     catchError(this.handleError)
	  //   );	    

      console.log('image', image);

 			const formData = new FormData();
      formData.append('story_id', story_id);
      formData.append('image', image);

      const headers = new HttpHeaders().set('Content-Type', []);

      // responseType 'text' is necessary for IE
      return this.http.post(API_URL+'image_upload', formData, {
          headers,
          responseType: 'text'
      });	    
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
