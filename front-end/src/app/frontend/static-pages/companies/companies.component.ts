import { Component, OnInit } from '@angular/core';

import { StoryService } from '../../services/story.service'

import { environment } from '../../../../environments/environment';
const API_URL  =  environment.baseUrl+'/api/';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})

export class CompaniesComponent implements OnInit {

	public dataLoading: boolean = true;
	public page: Object;
	public companies: Array<object>;

	constructor(private storyService: StoryService) { }

	ngOnInit() {

		this.getPage('companies');
		this.getCompanies();
	}

	getPage(slug) {

		this.storyService.getPage(slug).subscribe((reponse) => {

			this.dataLoading  = false;
			this.page  = reponse['data'];
		}, (error) => {

			console.log('error', error);
			this.dataLoading  = false;
		});
	}

	getCompanies() {

		this.storyService.getCompanies().subscribe((reponse) => {

			this.dataLoading  = false;
			let companies  = reponse['data'];
			companies.forEach((company) => {

				company['logo'] = APP_URL+'/assets/uploads/companies/'+company['logo'];
			});

			this.companies  = companies;
		}, (error) => {

			console.log('error', error);
			this.dataLoading  = false;
		});
	}
}
