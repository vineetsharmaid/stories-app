import { Component, OnInit } from '@angular/core';

import { UserService } from "../../services/admin/user.service";

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {


		public subscribers: Array<Object>;
  	
  	constructor(private userService: UserService) { }

  	ngOnInit() {

  		this.getSubscribers();
  	}

  	getSubscribers() {
	   
	    this.userService.getSubscribers().subscribe((response: Array<Object>) => {

	      console.log('getSubscribers response', response);
	      if ( response['status'] == true ) {
	        
	        this.subscribers = response['data'];
	      }
	    }, error => {

	    	this.subscribers = [];
	    	console.log('getSubscribers error', error);	    	
	    });
  	}

}
