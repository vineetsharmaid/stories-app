import { Component, OnInit } from '@angular/core';

import { StoryService } from '../../services/story.service'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {


	constructor(private storyService: StoryService) { }

	ngOnInit() {

		this.getPage('contact');
	}

	getPage(slug) {

		this.storyService.getPage(slug).subscribe((reponse) => {

			console.log('reponse', reponse);
		}, (error) => {

			console.log('error', error);
		});
	}

}
