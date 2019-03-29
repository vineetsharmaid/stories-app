import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const API_URL  =  'http://localhost/stories-app/back-end/api/';

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


  	submitForReview(story): Observable<any>{
    	
			return this.http.post(API_URL+'submit_story_for_review', story, httpOptions)
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
