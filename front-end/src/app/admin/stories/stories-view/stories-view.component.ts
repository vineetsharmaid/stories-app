import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';


import { StoriesService } from "../../../services/admin/stories.service";
declare var $: any;

@Component({
  selector: 'app-stories-view',
  templateUrl: './stories-view.component.html',
  styleUrls: ['./stories-view.component.css']
})
export class StoriesViewComponent implements OnInit {

	public story: object;
	public reviewStatus: number;
	public previousUrl: any;
	public setStatus: any;
  	constructor(private formBuilder: FormBuilder, 
  		private storiesService: StoriesService, 
  		private router: Router,
  		private activatedRoute: ActivatedRoute,
  		private _location: Location,) { 

  	}

	showNotification(from, align, color, message){

	  $.notify({
	      icon: "notifications",
	      message: message

	  },{
	      type: color,
	      delay:1000,
	      timer: 3000,
	      placement: {
	          from: from,
	          align: align
	      },
	      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
	        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
	        '<i class="material-icons" data-notify="icon">notifications</i> ' +
	        '<span data-notify="title">{1}</span> ' +
	        '<span data-notify="message">{2}</span>' +
	        '<div class="progress" data-notify="progressbar">' +
	          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
	        '</div>' +
	        '<a href="{3}" target="{4}" data-notify="url"></a>' +
	      '</div>'
	  });
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
	    	this.showNotification('top','center', 'success', 'Status updated succesfully');
	    }, error => {

	    	console.log('changeStatus error', error);
	    	this.showNotification('top','center', 'danger', 'Unable to update status');
	    });
  	}

  	back() {

  		console.log('this.previousUrl', this.previousUrl);
  		this._location.back();
  		// this.router.navigate([this.previousUrl]);
  	}


}
