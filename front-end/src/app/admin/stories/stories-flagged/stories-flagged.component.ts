import { Component, OnInit } from '@angular/core';

import { StoriesService } from "../../../services/admin/stories.service";
declare var $: any;

@Component({
  selector: 'app-stories-flagged',
  templateUrl: './stories-flagged.component.html',
  styleUrls: ['./stories-flagged.component.scss']
})
export class StoriesFlaggedComponent implements OnInit {

	public stories: Array<Object>;
  	constructor(private storiesService: StoriesService) { }

  	ngOnInit() {

  		this.getFlaggedStories();
  	}

  	getFlaggedStories() {
	   	
	    this.storiesService.getFlaggedStories().subscribe((response: Array<Object>) => {

	      this.stories = response['data'];
	    }, error => {

	    	this.stories = [];
	    	console.log('getFlaggedStories error', error);
	    });
  	}

  	changeStatus(status, storyID, authorId, storyIndex) {

	    this.storiesService.changeStatus(status, storyID, authorId).subscribe((response: Array<Object>) => {

	    	this.stories[storyIndex]['status'] = status;
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
