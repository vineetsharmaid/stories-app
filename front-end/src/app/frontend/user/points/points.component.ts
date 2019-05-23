import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
// import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';

import { UserService } from '../../services/user.service';

import { environment } from '../../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-user-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  public points: Array<object> = [];
  public userInfo: Object;
  public avgEngagement: Array<object>;

  constructor( public location: Location, 
    private router: Router, 
    private userService: UserService) {}

  ngOnInit() {

    this.pointsLog();
    this.getUserInfo();
    this.getAvgEngagementData();
  }

  pointsLog() {

    this.userService.getUserPoints().subscribe((response) => {

      console.log('pointsLog response', response);
      this.points = response['data'];
    }, (error) => {

      console.log('error', error);
    });
  }

  getUserInfo() {

    this.userService.getUserInfo().subscribe( (response) => {

      console.log('response', response);
      this.userInfo = response['data'][0];
      this.userInfo['cover_pic'] = this.userInfo['cover_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.userInfo['cover_pic'];
      this.userInfo['profile_pic'] = this.userInfo['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.userInfo['profile_pic'];
      
    }, (error) => {

      console.log('error', error['code']);
      if ( error['code'] == 401 ) {
        // authentication error show login popup
      }
    });
  }

  getAvgEngagementData() {

    this.userService.getAvgEngagementData().subscribe((response) => {
      
      this.avgEngagement = response['data'];
      console.log('avgEngagement', this.avgEngagement);
    } , (error) => {

      this.avgEngagement = [];
      console.log(error);
    });
  }

  ngAfterViewInit() {

  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }

  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }

}
