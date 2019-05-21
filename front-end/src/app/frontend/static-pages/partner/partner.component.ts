import { Component, OnInit } from '@angular/core';

import { StoryService } from '../../services/story.service'

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css'],
})
export class PartnerComponent implements OnInit {

	public dataLoading: boolean = true;
	public page: Object;

	constructor(private storyService: StoryService) { }

	ngOnInit() {

		this.getPage('partner');
	}

	getPage(slug) {

		this.storyService.getPage(slug).subscribe((reponse) => {

			console.log('reponse', reponse);
			this.dataLoading  = false;
			this.page  = reponse['data'];
		}, (error) => {

			console.log('error', error);
			this.dataLoading  = false;
		});
	}
}
