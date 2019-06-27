import { Component, OnInit } from '@angular/core';

import { StoryService } from '../../services/story.service'

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {

	public dataLoading: boolean = true;
	public page: Object;

	constructor(private storyService: StoryService) { }

	ngOnInit() {

		this.getPage('companies');
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
