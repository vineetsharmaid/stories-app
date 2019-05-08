import { Component, OnInit } from '@angular/core';

import { StoriesService } from "../../../services/admin/stories.service";
declare var $: any;

@Component({
  selector: 'app-stories-published',
  templateUrl: './stories-published.component.html',
  styleUrls: ['./stories-published.component.scss']
})
export class StoriesPublishedComponent implements OnInit {

	public stories: Array<Object>;
  	constructor(private storiesService: StoriesService) { }

  	ngOnInit() {

  		this.getStories();
  	}

  	getStories() {
	   	
	   	// 2: value for "submitted for review" in db
	    this.storiesService.getStories(1).subscribe((response: Array<Object>) => {

	      this.stories = response['data'];
	      console.log('getStories this.stories', this.stories);
	      
	    }, error => {

	    	this.stories = [];
	    	console.log('getstories error', error);
	    });
  	}

  	updateFeatured(storyId, index) {

  		

  		// this.stories.forEach((story, storyIndex) => {

  		// 	if(this.stories[index]['story_id'] == ) {

  		// 	}
  		// });
	   	
	    this.storiesService.updateFeatured(storyId).subscribe((response: Array<Object>) => {

	      	console.log('updateFeatured response', response);
  			this.stories[index]['featured'] = this.stories[index]['featured'] == 1 ? 0 : 1;
	      
	    }, error => {

	    	console.log('updateFeatured error', error);
	    });
  	}


  	changeStatus(status, storyID, authorId, storyIndex) {

	    this.storiesService.changeStatus(status, storyID, authorId).subscribe((response: Array<Object>) => {

	    	this.stories.splice(storyIndex, 1);
	    	this.showNotification('top','center', 'success', 'Status updated succesfully');
	    }, error => {

	    	console.log('changeStatus error', error);
	    	this.showNotification('top','center', 'danger', 'Unable to update status');
	    });
  	}
  	
		showNotification(from, align, color, message){

			$.notifyClose();
			
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


}
