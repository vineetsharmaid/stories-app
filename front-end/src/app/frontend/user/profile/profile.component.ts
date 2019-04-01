import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	public userInfo = Object;

  constructor(private userService: UserService) { }
 
  ngOnInit() {

  	this.getUserInfo();
  }

  getUserInfo() {

  	this.userService.getUserInfo().subscribe( (response) => {

  		console.log('response', response);
			this.userInfo = response['data'];
  	}, (error) => {

  		console.log('error', error['code']);
  		if ( error['code'] == 401 ) {
  			// authentication error show login popup
  		}
  	});
  }

}
