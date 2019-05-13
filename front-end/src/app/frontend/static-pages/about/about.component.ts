import { Component, OnInit } from '@angular/core';

import { StoryService } from '../../services/story.service'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {

	public dataLoading: boolean = true;
	public page: Object;

	constructor(private storyService: StoryService) { }

	ngOnInit() {

		this.getPage('about');
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
