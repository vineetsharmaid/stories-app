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

	public filterName: string;
	public users: Array<Object>;
	public allUsers: Array<Object>;
	public currentUser: number;
	public setStatus: number;
	public currentIndex: number;

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
	        this.allUsers = this.users = users;
	      }
	    }, error => {

	    	this.users = [];
	    	console.log('getUsers error', error);	    	
	    });
  	}

  	searchByName(name) {
  		const filterName = name.toString().toLowerCase();
  		console.log('filterName', filterName);

  		this.users = this.allUsers.filter((user) => {

  			var username = user['first_name']+' '+user['last_name'];
  			if( username.toLowerCase().includes(filterName) ) {
  				return true;
  			}
  		});
  	}

  	changeStatus(setStatus, currentUser, currentIndex) {

  		console.log('setStatus', setStatus);
  		console.log('currentUser', currentUser);
  		this.userService.updateStatus(currentUser, setStatus).subscribe((response) => {

  			this.users[currentIndex]['status_id'] = setStatus;
  			this.users[currentIndex]['status'] = setStatus == 1 ? 'Active' : 'Inactive';
  			console.log('response', response);
  		}, (error) => {
  			
  			console.log('error', error);
  		})
  	}

}
