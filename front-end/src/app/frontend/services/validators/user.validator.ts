import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap  } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

const API_URL  =  environment.baseUrl+'/api/';

@Injectable({
  providedIn: 'root'
})
export class UserValidators {
  constructor(private http: HttpClient) {}

  searchUser(text) {
    // debounce
    return timer(1000)
      .pipe(
        switchMap(() => {
          // Check if username is available
          return this.http.get<any>(`${API_URL}/check_username?username=${text}`)
        })
      );
  }

  searchCompanyEmail(text) {
    // debounce
    return timer(1000)
      .pipe(
        switchMap(() => {
          // Check if username is available
          return this.http.get<any>(`${API_URL}/check_company_email?email=${text}`)
        })
      );
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchUser(control.value)
        .pipe(
          map(res => {
            console.log('control.value', control.value);
            // if username is already taken
            if (res.message > 0) {
              // return error
              return { 'userNameExists': true};
            }
          })
        );
    };

  }

  companyEmailValidator(company): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchCompanyEmail(control.value)
        .pipe(
          map(res => {
            console.log('control.value', control.value);
            console.log('company', company);
            // if username is already taken
            if (res.message > 0) {
              // return error
              return { 'emailConfirmed': true};
            }
          })
        );
    };

  }

}
