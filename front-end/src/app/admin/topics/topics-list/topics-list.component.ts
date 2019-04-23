import { Component, OnInit } from '@angular/core';

import { TopicsService } from "../../../services/admin/topics.service";

@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.css']
})
export class TopicsListComponent implements OnInit {


	public topics: Array<Object>;
  	constructor(private topicsService: TopicsService) { }

  	ngOnInit() {

  		this.getTopics();
  	}

  	getTopics() {
	   
	    this.topicsService.getTopics().subscribe((response: Array<Object>) => {

	      console.log('getTopics response', response);
	      if ( response['status'] == true ) {
	        
	        this.topics = response['data'];
	      }

	    }, error => {

	    	this.topics = [];
	    	console.log('getTopics error', error);
	    });
  	}

}
