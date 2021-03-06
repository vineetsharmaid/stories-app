import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { StoryService } from '../../services/story.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
})
export class PrivacyPolicyComponent implements OnInit {

  public dataLoading: boolean = true;
  public page: Object;

  constructor(private storyService: StoryService) { }

  ngOnInit() {

    this.getPage('privacy-policy');
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

}
