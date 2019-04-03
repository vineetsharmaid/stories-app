import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';


import { StoriesService } from "../../../services/admin/stories.service";

@Component({
  selector: 'app-stories-view',
  templateUrl: './stories-view.component.html',
  styleUrls: ['./stories-view.component.css']
})
export class StoriesViewComponent implements OnInit {

	public story: object;
	public reviewStatus: number;
	public previousUrl: any;
  	constructor(private formBuilder: FormBuilder, 
  		private storiesService: StoriesService, 
  		private router: Router,
  		private activatedRoute: ActivatedRoute,
  		private _location: Location,) { 

  	}

  	ngOnInit() {

  		this.getCategory();

  		this.router.events
		    .filter(e => e instanceof RoutesRecognized)
		    .pairwise()
		    .subscribe((event: any[]) => {
		      console.log(event[0].urlAfterRedirects);
		      this.previousUrl = event[0].urlAfterRedirects;
		});  		
  	}

  	getCategory() {
	   	
	   	const storyId = +this.activatedRoute.snapshot.paramMap.get('storyId');
	   	
	    this.storiesService.getStory(storyId).subscribe((response: Array<Object>) => {

	    	console.log('getStory response', response);
	    	this.story = response['data'];
	    	this.reviewStatus = this.story['review'];
	    }, error => {

	    	this.story = [];
	    	console.log('getStory error', error);
	    });
  	}

  	changeStatus(status) {
	   	
	   	console.log('status', status);

	    this.storiesService.changeStatus(status, this.story['story_id']).subscribe((response: Array<Object>) => {

	    	console.log('changeStatus response', response);
	    	this.reviewStatus = status;
	    }, error => {

	    	console.log('changeStatus error', error);
	    });
  	}

  	back() {

  		console.log('this.previousUrl', this.previousUrl);
  		this._location.back();
  		// this.router.navigate([this.previousUrl]);
  	}


}
