import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

import { environment } from '../../../environments/environment';

const API_URL  =  environment.baseUrl+'/api/';
const ADMIN_API_URL  =  environment.baseUrl+'/auth/admin/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	
  	constructor(private http: HttpClient) { }

  	getUsers(): Observable<any>{
			
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(ADMIN_API_URL+'get_users', httpOptions);
		}
		
  	getSettings(): Observable<any>{
			
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_settings', httpOptions);
		}

  	updateSettings(settings): Observable<any>{
			
			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('contact_email', settings.contact_email);
			formData.append('email', settings.email);
			formData.append('fb_url', settings.fb_url);
			formData.append('insta_url', settings.insta_url);
			formData.append('ln_url', settings.ln_url);

			return this.http.post(ADMIN_API_URL+'update_settings/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getSubscribers(): Observable<any>{
			
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(ADMIN_API_URL+'get_subscribers', httpOptions);
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

  	getUserPoints(userId): Observable<any>{
    	    	
			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			// return this.http.get(ADMIN_API_URL+'get_user_points/'+userId, httpOptions).pipe(
			// 	tap((userPoints: any) => console.log('userPoints', userPoints)),
			// 	catchError(this.handleError)
			// );
			return this.http.get(ADMIN_API_URL+'get_user_points/'+userId, httpOptions);
		}

  	getUserStories(userId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			// return this.http.get(ADMIN_API_URL+'get_user_stories/'+userId, httpOptions).pipe(
			// 	tap((userPoints: any) => console.log('userPoints', userPoints)),
			// 	catchError(this.handleError)
			// );

			return this.http.get(ADMIN_API_URL+'get_user_stories/'+userId, httpOptions);
		}

  	getUserInfo(userId): Observable<any>{
			
			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};
			
			// return this.http.get(ADMIN_API_URL+'get_user_info/'+userId, httpAuthOptions).pipe(
			// 	tap((userInfo: Object) => console.log('userInfo', userInfo)),
			// 	catchError(this.handleError)
			// );
			return this.http.get(ADMIN_API_URL+'get_user_info/'+userId, httpOptions);
		}


  	updateStatus(currentUser, setStatus): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('user_id', currentUser);
      formData.append('status', setStatus);

			return this.http.post(ADMIN_API_URL+'update_user_status/', formData, httpOptions)
	    .pipe(
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
     errorMessage = {'code': error.status, 'message': error.message, 'errorData': error.error};
   }

   return throwError(errorMessage);
 }




}
