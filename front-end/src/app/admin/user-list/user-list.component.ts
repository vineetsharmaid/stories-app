import { Component, OnInit } from '@angular/core';

import { UserService } from "../../services/admin/user.service";

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {


	public users: Array<Object>;
  	constructor(private userService: UserService) { }

  	ngOnInit() {

  		this.getUsers();
  	}

  	getUsers() {
	   
	    this.userService.getUsers().subscribe((response: Array<Object>) => {

	      console.log('getUsers response', response);
	      if ( response['status'] == true ) {
	        
	        var users = response['data'];
	        users.forEach((user) => {

	        	user['profile_pic'] = user['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+user['profile_pic'];
	        })
	        this.users = users;
	      }
	    }, error => {

	    	this.users = [];
	    	console.log('getUsers error', error);	    	
	    });
  	}

}
