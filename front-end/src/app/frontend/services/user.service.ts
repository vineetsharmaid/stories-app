import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const API_URL  	 	=  environment.baseUrl+'/api/';
const USER_API_URL  =  environment.baseUrl+'/auth/users/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class UserService {
	
  	constructor(private http: HttpClient) { }

  	registerUser(User): Observable<any>{
    	
    	// return  this.http.get(`${API_URL}`);

			return this.http.post(API_URL+'register', User, httpOptions).pipe(
				tap((newUser: Object) => console.log('newUser', newUser)),
				catchError(this.handleError)
			);
		}

  	loginUser(User): Observable<any>{
    	
    	// return  this.http.get(`${API_URL}`);

			return this.http.post(API_URL+'login', User, httpOptions).pipe(
				tap((userLoggedIn: Object) => console.log('userLoggedIn', userLoggedIn)),
				catchError(this.handleError)
			);
		}


  	forgotPassword(User): Observable<any>{
    	
    	// return  this.http.get(`${API_URL}`);

			return this.http.post(API_URL+'forgot_password', User, httpOptions).pipe(
				tap((emailSent: Object) => console.log('emailSent', emailSent)),
				catchError(this.handleError)
			);
		}

  	getUserInfo(): Observable<any>{
			
			let httpAuthOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', 
			  	"Authorization": "Bearer " + localStorage.getItem('jwtToken')
			  })
			};
			
			return this.http.get(USER_API_URL+'get_user_info', httpAuthOptions).pipe(
				tap((emailSent: Object) => console.log('emailSent', emailSent)),
				catchError(this.handleError)
			);
		}




handleError(error) {
   let errorMessage;
   if (error.error instanceof ErrorEvent) {
     // client-side error
     errorMessage = {'message': error.error.message};
   } else {
     // server-side error
     errorMessage = {'code': error.status, 'message': error.message};
   }

   return throwError(errorMessage);
 }


}
