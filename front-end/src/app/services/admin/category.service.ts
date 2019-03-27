import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const API_URL  =  'http://localhost/stories-app/back-end/api/';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
	
  	constructor(private http: HttpClient) { }

  	getCategories(): Observable<any>{
    	
			// return this.http.get(API_URL+'get_categories', httpOptions).pipe(
			// 	tap((categories: Object) => console.log('categories', categories)),
			// 	catchError(this.handleError<any>('getCategories'))
			// );

			return this.http.get(API_URL+'get_categories', httpOptions);

		}

	/** POST: add a new hero to the database */
	addCategory (category): Observable<any> {
	  return this.http.post(API_URL+'add_category', category, httpOptions)
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
