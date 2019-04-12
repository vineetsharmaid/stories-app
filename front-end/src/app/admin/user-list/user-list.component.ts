import { Component, OnInit } from '@angular/core';

import { UserService } from "../../services/admin/user.service";

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
	        
	        this.users = response['data'];
	      }
	    }, error => {

	    	this.users = [];
	    	console.log('getUsers error', error);	    	
	    });
  	}

}
