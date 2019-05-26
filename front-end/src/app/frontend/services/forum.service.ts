import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from  '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const API_URL  =  environment.baseUrl+'/api/';
const USER_API_URL  =  environment.baseUrl+'/auth/users/';


@Injectable({
  providedIn: 'root'
})
export class ForumService {

  	constructor(private http: HttpClient) { }

  	addQuestion(question): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('title', question.title);
      formData.append('topics', question.topics);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'add_question', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	addComment(comment): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('content', comment.content);
			formData.append('parent', comment.parent);
      formData.append('answer_id', comment.answer_id);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'add_answer_comment', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	saveAnswer(answer): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('slug', answer.slug);
			formData.append('subject', answer.subject);
      formData.append('question_id', answer.question_id);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'save_answer', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	updateAnswer(answer): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('slug', answer.slug);
			formData.append('subject', answer.subject);
      formData.append('answer_id', answer.answer_id);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'update_answer', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	changeLikeStatus(answerId): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('answer_id', answerId);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'change_like_status', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	changeHelpfulStatus(answerId): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('answer_id', answerId);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'change_helpful_status', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	reportForumAnswer(answerId): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('answer_id', answerId);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'report_forum_answer', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	reportAnswerComment(commentId): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('comment_id', commentId);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'report_forum_comment', formData, {headers})
	    .pipe(
	      catchError(this.handleError)
	    );
		}

  	changeCommentHelpfulStatus(commentId): Observable<any>{
			
			const formData = new FormData();
    	
			formData.append('comment_id', commentId);
			
			const headers = new HttpHeaders().set('Authorization', "Bearer " + localStorage.getItem('jwtToken'));

			return this.http.post(USER_API_URL+'change_comment_helpful_status', formData, {headers})
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

		getTopics(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_topics/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}


		getSidebarTopics(): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_sidebar_topics/', httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}


		getComments(answerId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_answer_comments/'+answerId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

		getQuestionsList(searchData, limit, offset): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			const formData = new FormData();			
      formData.append('search_question', searchData['search_question']);
      formData.append('search_topic', searchData['search_topic']);

			return this.http.post(API_URL+'get_questions_list/'+limit+'/'+offset, formData,httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

		getAnswers(threadId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_answers/'+threadId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

		getUserQuestions(limit, offset): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_user_questions_list/'+limit+'/'+offset, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

		getUserAnswers(limit, offset): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_user_answers_list/'+limit+'/'+offset, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}
		
		getAnswerByUser(threadId): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(USER_API_URL+'get_answer_by_user/'+threadId, httpOptions)
	    .pipe(
	      catchError(this.handleError)
	    );
		}

		getQuestionInfo(slug): Observable<any>{

			let httpOptions = {
			  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem('jwtToken') })
			};

			return this.http.get(API_URL+'get_question_info/'+slug, httpOptions)
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
