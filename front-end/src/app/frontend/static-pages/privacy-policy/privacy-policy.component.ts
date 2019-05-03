import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
})
export class PrivacyPolicyComponent implements OnInit {

	public showPrivacyPolicy: boolean = false;
	public showTermsAnsConditions: boolean = false;
	constructor(private router: Router) { }

	ngOnInit() {

    if(this.router.url == '/privacy-policy') {

    	this.showPrivacyPolicy = true;
    }

    if(this.router.url == '/terms-and-conditions') {

    	this.showTermsAnsConditions = true;
    }
	}

}
