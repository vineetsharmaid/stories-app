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
export class CompaniesService {
	
  	constructor(private http: HttpClient) { }

	/** POST: get category by cat id to the database */
	getCompanies (): Observable<any> {
	  
	  return this.http.get(ADMIN_API_URL+'get_companies/', httpOptions);
	}

	/** POST: get category by cat id to the database */
	getCompany (companyId): Observable<any> {
	  
	  return this.http.get(ADMIN_API_URL+'get_company/'+companyId, httpOptions);
	}

	/** POST: add a new category to the database */
	addCompany (company): Observable<any> {


		let httpOptions = {
		  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};

		const formData = new FormData();		
    	formData.append('name', company);

	  	return this.http.post(ADMIN_API_URL+'add_company', formData, httpOptions)
    	.pipe(
      		catchError(this.handleError)
    	);
	}

	/** POST: add a new category to the database */
	editcompany (company): Observable<any> {

		let httpOptions = {
		  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
		};

		const formData = new FormData();		
    	formData.append('name', company.name);
    	formData.append('company_id', company.company_id);
	  	
	  	return this.http.post(ADMIN_API_URL+'edit_company', formData, httpOptions)
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
