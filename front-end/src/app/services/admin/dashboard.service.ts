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
export class DashboardService {
	
  constructor(private http: HttpClient) { }


  getDashboardData(): Observable<any>{
			
		let httpOptions = {
		  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};    	
    	
		return this.http.get(ADMIN_API_URL+'get_dashboard_data/', httpOptions);
	}


  getUserRegisterData(): Observable<any>{
			
		let httpOptions = {
		  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};    	
    	
		return this.http.get(ADMIN_API_URL+'get_user_register_data/', httpOptions);
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
