import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from  '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const API_URL  =  'http://localhost/stories-app/back-end/api/';
const ADMIN_API_URL  =  'http://localhost/stories-app/back-end/api/admin/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	
  	constructor(private http: HttpClient) { }

  	getUsers(): Observable<any>{
    	
			// return this.http.get(API_URL+'get_users', httpOptions).pipe(
			// 	tap((newUser: Object) => console.log('newUser', newUser)),
			// 	catchError(this.handleError<any>('registerUser'))
			// );

			return this.http.get(API_URL+'get_users', httpOptions);
		}

  	loginUser(User): Observable<any>{
    	
    	// return  this.http.get(`${API_URL}`);

			return this.http.post(API_URL+'login', User, httpOptions).pipe(
				tap((userLoggedIn: Object) => console.log('userLoggedIn', userLoggedIn)),
				catchError(this.handleError<any>('registerUser'))
			);
		}


  	forgotPassword(User): Observable<any>{
    	
    	// return  this.http.get(`${API_URL}`);

			return this.http.post(API_URL+'forgot_password', User, httpOptions).pipe(
				tap((emailSent: Object) => console.log('emailSent', emailSent)),
				catchError(this.handleError<any>('registerUser'))
			);
		}





	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {
	 
	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead
	 
	    // TODO: better job of transforming error for user consumption
	    // this.log(`${operation} failed: ${error.message}`);
	 
	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}	




}
