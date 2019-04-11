import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { StoriesService } from '../../services/stories.service'

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	public userInfo = Object;
  public stories: Array<object>;
  public storiesCount: number;
  public enableNameEdit: boolean = false;
  public enableWebsiteEdit: boolean = false;
  public enableShortInfoEdit: boolean = false;

  constructor(private userService: UserService, private storiesService : StoriesService) { }
 
  ngOnInit() {

  	this.getUserInfo();
    this.getUserStories();
    this.getUserStoriesCount();
  }

  getUserInfo() {

  	this.userService.getUserInfo().subscribe( (response) => {

  		console.log('response', response);
			this.userInfo = response['data'][0];
  	}, (error) => {

  		console.log('error', error['code']);
  		if ( error['code'] == 401 ) {
  			// authentication error show login popup
  		}
  	});
  }

  getUserStories() {

    this.storiesService.getUserStories(5, 0).subscribe((response: Array<Object>) => {

        var stories = [];
        response['data'].forEach((story) => {

          if ( story['preview_image'] != "" ) {
          
              story['preview_image'] = APP_URL+'/assets/uploads/'+story['preview_image'];
          }

          stories.push(story);

        })
        
        this.stories = stories;

      console.log('getStories this.stories', this.stories);
      
    }, error => {

      this.stories = [];
      console.log('getstories error', error);
    });
  }

  getUserStoriesCount() {

    this.storiesService.getUserStoriesCount().subscribe((response: Array<Object>) => {
  
      this.storiesCount = response['data'];

      console.log('getStories this.stories', this.stories);
      
    }, error => {

      this.storiesCount = 0;
      console.log('getstories error', error);
    });
  }

  updateMetaInfo(key, value) {

    console.log('key - value', key+' - '+value);
    
    this.userService.updateMetaInfo(key, value).subscribe((response) => {

      console.log('response', response);

      this.userInfo[key] = value;
      this.enableShortInfoEdit = false;
      this.enableWebsiteEdit = false;
    }, (error) => {

      console.log('error', error);
    });
  }

  updateName(firstName, lastName) {

    this.userService.updateName(firstName, lastName).subscribe((response) => {

      console.log('response', response);

      this.userInfo['first_name'] = firstName;
      this.userInfo['last_name'] = lastName;
      
      this.enableNameEdit = false;
      this.enableWebsiteEdit = false;
      this.enableShortInfoEdit = false;
    }, (error) => {

      console.log('error', error);
    });
  }

}
