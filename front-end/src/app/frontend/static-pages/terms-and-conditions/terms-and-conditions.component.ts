import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { StoryService } from '../../services/story.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css'],
})
export class TermsAndConditionsComponent implements OnInit {

  public dataLoading: boolean = true;
  public page: Object;

  constructor(private storyService: StoryService) { }

  ngOnInit() {

    this.getPage('terms-and-conditions');
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
