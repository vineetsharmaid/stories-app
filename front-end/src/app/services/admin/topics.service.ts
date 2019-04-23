import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const API_URL  =  environment.baseUrl+'/api/';
const ADMIN_API_URL  =  environment.baseUrl+'/auth/admin/';
const JWT_Token  =  localStorage.getItem('jwtToken');

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + JWT_Token })
};


@Injectable({
  providedIn: 'root'
})
export class TopicsService {
	
  	constructor(private http: HttpClient) { }

  	getTopics(): Observable<any>{
	
		return this.http.get(ADMIN_API_URL+'get_topics', httpOptions);
	}

	/** POST: add a new topic to the database */
	addTopics (topic): Observable<any> {

		let httpOptions = {
		  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};

		const formData = new FormData();		
    formData.append('name', topic.name);
    formData.append('class', topic.class);

	  return this.http.post(ADMIN_API_URL+'add_topic/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
	}

	/** POST: edit topic in the database */
	editTopic(topic): Observable<any> {

		let httpOptions = {
		  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};

		const formData = new FormData();		
    formData.append('name', topic.name);
    formData.append('class', topic.class);
    formData.append('topic_id', topic.topic_id);

	  return this.http.post(ADMIN_API_URL+'edit_topic/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
	}

	searchTopics(searchTopic): Observable<any>{

		let httpOptions = {
		  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};

		return this.http.get(API_URL+'search_topic/'+searchTopic, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
	}

	getTopic(topicId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_topic/'+topicId, httpOptions)
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
