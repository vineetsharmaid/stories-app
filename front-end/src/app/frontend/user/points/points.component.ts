import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public maxTransferPoints: number;
  public avgEngagement: Array<object>;

  public pointTransferForm: FormGroup;
  public submitted: boolean = false;
  public hideErrors: boolean = false;
  public transferErrors: Array<string> = [];
  public loading: any;
  public transferSuccess: boolean = false;

  @ViewChild('closeTransferPopup')  closeTransferPopup: ElementRef;

  constructor( private formBuilder: FormBuilder,
    public location: Location, 
    private router: Router, 
    private userService: UserService) {}

  ngOnInit() {

    this.pointsLog();
    this.getUserInfo();
    this.getAvgEngagementData();
  }

  pointsLog() {

    this.userService.getUserPoints().subscribe((response) => {

      this.points = response['data'];
    }, (error) => {

      console.log('error', error);
    });
  }

  // convenience getter for easy access to form fields
  get fields() { return this.pointTransferForm.controls; }  

  getUserInfo() {

    this.userService.getUserInfo().subscribe( (response) => {

      this.userInfo = response['data'][0];
      this.userInfo['cover_pic'] = this.userInfo['cover_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.userInfo['cover_pic'];
      this.userInfo['profile_pic'] = this.userInfo['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+this.userInfo['profile_pic'];
      this.maxTransferPoints = this.userInfo['points'];
      this.pointTransferForm = this.formBuilder.group({
        points: ['', Validators.compose( [Validators.required, Validators.min(1), Validators.max(this.maxTransferPoints)] ) ],
        username: ['', Validators.required]
      });
      
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
    } , (error) => {

      this.avgEngagement = [];
      console.log(error);
    });
  }


  transferPoints() {

      this.submitted = true;

      // stop here if form is invalid
      if (this.pointTransferForm.invalid) {

        console.log('Validation error.');
        return;
      } else {

        var transfer = {
            points: this.pointTransferForm.get('points').value,
            username: this.pointTransferForm.get('username').value,
          };

        this.loading = true;
        this.userService.transferPoints(transfer).subscribe((response: Array<Object>) => {

          this.loading = false;
          this.submitted = false;
          this.transferSuccess = true;

          this.userInfo['points'] = this.userInfo['points'] - transfer.points;
          this.pointTransferForm.reset();
          // this.closeTransferPopup.nativeElement.click();
          
        }, error => {

          console.log('error', error);
          this.transferErrors = [];
          // this.errorNewsletterBtn.nativeElement.click();
          this.loading = false;
          this.transferErrors.push(error['errorData']['message']);
          
        });

      }

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
