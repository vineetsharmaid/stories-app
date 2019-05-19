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
export class StoryService {

  	constructor(private http: HttpClient) { }

  	saveDraft(story): Observable<any>{
			
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	

			return this.http.post(USER_API_URL+'save_story', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	updateStory(story): Observable<any>{
			
			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	

			return this.http.post(USER_API_URL+'edit_story', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	updateDraft(story): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
    	
			return this.http.post(USER_API_URL+'update_story', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	deleteDraftStory(storyId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
    	
			return this.http.get(USER_API_URL+'delete_story/'+storyId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	submitForReview(story): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
    	
			return this.http.post(USER_API_URL+'submit_story_for_review', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	savePreview(story): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
    	
			return this.http.post(USER_API_URL+'save_preview', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	addQuestion(question): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('title', question.title);
      formData.append('topics', question.topics);

      console.log('question.topics', question.topics);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'add_question', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	saveReview(story): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};    	
    	
			return this.http.post(USER_API_URL+'save_review_data', story, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	addTagToStory(tag_id, story_id): Observable<any>{
    	
 			const formData = new FormData();
      formData.append('tag_id', tag_id);
      formData.append('story_id', story_id);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'add_tag_to_story', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	addNewTopic(topic_name): Observable<any>{
    	
 			const formData = new FormData();
      formData.append('topic_name', topic_name);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'add_new_topic', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	addNewTagToStory(tag_name, story_id): Observable<any>{
    	
 			const formData = new FormData();
      formData.append('tag_name', tag_name);
      formData.append('story_id', story_id);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'add_new_tag_to_story', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	removeTagFromStory(tag_id, story_id): Observable<any>{
    	
 			const formData = new FormData();
      formData.append('tag_id', tag_id);
      formData.append('story_id', story_id);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'remove_tag_from_story', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getStory(storyId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_story/'+storyId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getPage(slug): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
			};

			return this.http.get(API_URL+'get_page/'+slug, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getUserStoryDetails(storyId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_user_story_details/'+storyId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getstoryViews(storyId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_story_views/'+storyId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getStories(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_stories/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getTags(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_tags/', httpOptions)
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

		getTopics(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_topics/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getDraftStories(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_user_draft_stories/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	getPublishedStories(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_user_published_stories/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

		public uploadImage(image: File, story_id): Observable<object> {
	    

 			const formData = new FormData();
      formData.append('story_id', story_id);
      formData.append('image', image);

      const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));
      
      return this.http.post(USER_API_URL+'image_upload', formData, {headers});
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
