import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from "../../services/admin/user.service";

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

	public points: Array<object> = [];
	public stories: Array<object> = [];
  public userInfo = Object;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  	const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    this.getUserInfo(userId);
    this.pointsLog(userId);
    // this.getUserStories(userId);
  }

  pointsLog(userId) {

    this.userService.getUserPoints(userId).subscribe((response) => {

      this.points = response['data'];
    }, (error) => {

      console.log('error', error);
    });
  }

  getUserStories(userId) {

    this.userService.getUserStories(userId).subscribe((response) => {

      this.stories = response['data'];
    }, (error) => {

      console.log('error', error);
    });
  }

  getUserInfo(userId) {

    this.userService.getUserInfo(userId).subscribe( (response) => {

      this.userInfo = response['data'][0];
      this.userInfo['cover_pic'] = this.userInfo['cover_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.userInfo['cover_pic'];
      this.userInfo['profile_pic'] = this.userInfo['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.userInfo['profile_pic'];
      
    }, (error) => {

      console.log('error', error['code']);
      if ( error['code'] == 401 ) {
        // authentication error show login popup
      }
    });
  }

}
