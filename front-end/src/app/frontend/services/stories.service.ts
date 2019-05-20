import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const API_URL  =  environment.baseUrl+'/api/';
const USER_API_URL  =  environment.baseUrl+'/auth/users/';
// const JWT_Token  =  localStorage.getItem('jwtToken');

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + JWT_Token })
// };


@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  	constructor(private http: HttpClient) { }

  	getStories(limit, offset): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_stories/'+limit+'/'+offset, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getUserStories(limit, offset): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_user_stories/'+limit+'/'+offset, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getAuthorStories(username, limit, offset): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_author_stories/'+username+'/'+limit+'/'+offset, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getfeaturedStories(limit, offset): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_featured_stories/'+limit+'/'+offset, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	searchStories(searchData, limit, offset): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			const formData = new FormData();
			console.log(searchData['search_tag']);
      formData.append('search_tag', searchData['search_tag']);
      formData.append('search_type', searchData['search_type']);
      formData.append('search_text', searchData['search_text']);
      // formData.append('search_author', searchData['search_author']);
      formData.append('search_country', searchData['search_country']);

			return this.http.post(API_URL+'search_stories/'+limit+'/'+offset, formData,httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	searchTags(searchTag): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'search_tags/'+searchTag, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getTag(tagId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_tag/'+tagId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getTags(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_tags/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getCountries(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get('assets/json/countries.json', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}
		

  	getAuthor(authorId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_author/'+authorId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}
  	searchAuthors(searchAuthor): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'search_authors/'+searchAuthor, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getUserStoriesCount(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_user_stories_count/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getStoryData(slug): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_story_data/'+slug, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}


		/** GET: get comments by story id to the database */
		getStoryComments (storyId): Observable<any> {
				
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
		  
		  return this.http.get(API_URL+'get_story_comments/'+storyId, httpOptions);
		}		

  	likeStory(story_id): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('story_id', story_id);

			return this.http.post(USER_API_URL+'like_story/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	shareStory(story_id, platform): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('story_id', story_id);
      formData.append('platform', platform);

			return this.http.post(API_URL+'share_story/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	updateStoryViewCount(story_id): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('story_id', story_id);

			return this.http.post(USER_API_URL+'viewed_story/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	reportStory(story_id): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('post_id', story_id);

			return this.http.post(USER_API_URL+'report_story/', formData, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	addStoryComment(comment): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

	 		const formData = new FormData();
      formData.append('comment', comment.content);
      formData.append('story_id', comment.story_id);
      formData.append('parent', comment.parent);

			return this.http.post(USER_API_URL+'add_story_comment/', formData, httpOptions)
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
