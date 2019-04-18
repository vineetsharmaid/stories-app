import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;
const DEFAULT_LISTING_COUNT  =  environment.defaultListingCount;

import { ForumService } from '../../services/forum.service'


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

	public questionData = Object;
  	constructor( private router: Router, private activatedRoute: ActivatedRoute, private forumService: ForumService ) { }
 
  	ngOnInit() {

  		const slug = this.activatedRoute.snapshot.paramMap.get('slug');
  		this.getQuestionInfo(slug);
  	}

  	getQuestionInfo(slug) {

  		this.forumService.getQuestionInfo(slug).subscribe((response) => {

  			console.log('response', response);
  			this.questionData = response['data'];
  		}, (error) => {

  			console.log('error', error);
  		})
  	}
}
