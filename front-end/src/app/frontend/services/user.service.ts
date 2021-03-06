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


  	getSettings(): Observable<any>{
			
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_settings', httpOptions);
		}

  	verifyToken(): Observable<any>{
    	
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'verify_token/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	registerUser(User): Observable<any>{
    	
    	// return  this.http.get(`${API_URL}`);

			return this.http.post(API_URL+'register_user', User, httpOptions).pipe(
				tap((newUser: Object) => console.log('newUser', newUser)),
				catchError(this.handleError)
			);
		}

  	getUserPoints(): Observable<any>{
    	    	
			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_user_points', httpOptions).pipe(
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

  	updateMetaInfo(key, value): Observable<any>{
    	

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append(key, value);

			return this.http.post(USER_API_URL+'update_meta_info/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	saveCompany(company): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('name', company.name);
      formData.append('email', company.email);

			return this.http.post(USER_API_URL+'save_company/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	transferPoints(transfer): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('points', transfer.points);
      formData.append('username', transfer.username);

			return this.http.post(USER_API_URL+'transfer_points/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	updateName(firstName, lastName): Observable<any>{
    	

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);

			return this.http.post(USER_API_URL+'update_user_name/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	submitContactForm(data): Observable<any>{

	 		const formData = new FormData();
      formData.append('first_name', data.firstName);
      formData.append('last_name', data.lastName);
      formData.append('message', data.message);
      formData.append('email', data.email);

			return this.http.post(API_URL+'submit_contact_form/', formData)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	updatePassword(passwordData): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('currentPassword', passwordData.currentPassword);
      formData.append('newPassword', passwordData.newPassword);
      formData.append('confirmPassword', passwordData.confirmPassword);

			return this.http.post(USER_API_URL+'update_password/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	submitNewsletter(data): Observable<any>{

	 		const formData = new FormData();
      formData.append('first_name', data.firstName);
      formData.append('last_name', data.lastName);
      formData.append('email', data.email);

			return this.http.post(API_URL+'add_newsletter_subscriber/', formData)
	    .pipe(
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

	  getAvgEngagementData(): Observable<any>{
				
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
	    	
			return this.http.get(USER_API_URL+'get_average_post_engagement/', httpOptions);
		}

  	getAuthorInfo(username): Observable<any>{
			
			let httpAuthOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', 
			  	"Authorization": "Bearer " + localStorage.getItem('jwtToken')
			  })
			};
			
			return this.http.get(API_URL+'get_user_info/'+username, httpAuthOptions).pipe(
				tap((emailSent: Object) => console.log('emailSent', emailSent)),
				catchError(this.handleError)
			);
		}

  	getCompanies(): Observable<any>{
			
			return this.http.get(API_URL+'get_companies', httpOptions).pipe(
				tap((companies: Object) => console.log('companies', companies)),
				catchError(this.handleError)
			);
		}

		public uploadImage(image: File, type: string): Observable<string> {
	    

 			const formData = new FormData();
      
      formData.append('image', image);
      formData.append('type', type);

      const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));
      
      return this.http.post(USER_API_URL+'user_image_upload', formData, {
          headers,
          responseType: 'text'
      });
	  }





handleError(error) {
	console.log('service error', error);
	
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
