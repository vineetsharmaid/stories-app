import { Component} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { UserService } from './frontend/services/user.service';
import { SharedService } from "./frontend/services/shared.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	private tokenInterval: any;
	constructor(private router: Router, private userService: UserService, private sharedService: SharedService) {

	}

	ngOnInit() {

 //   	this.router.events.subscribe((evt) => {
 //            if (!(evt instanceof NavigationEnd)) {
 //                return;
 //            }
 //            window.scrollTo(0, 0)
 //        });
 		this.sharedService.currentMessage.subscribe(message => console.log('detail message', message) );

 		if ( localStorage.getItem('isLoggedIn') ) {
 			
 			// Single hit on load of applications
			this.userService.verifyToken().subscribe((response) => {
				// update token
				localStorage.setItem('jwtToken', response['data']['token']); 				
			}, (error) => {

				console.log('verifyToken error', error);
				// login token expired
				if ( error.code == 401 ) {
						
						localStorage.removeItem('isLoggedIn');
						localStorage.removeItem('userType');
				    localStorage.removeItem('jwtToken');
				}
			});

 		}

			// continuous hits to update token after fixed interval
	 		this.tokenInterval = setInterval(() => {

 				if ( localStorage.getItem('isLoggedIn') ) {
		 		
		 			this.userService.verifyToken().subscribe((response) => {

		 				localStorage.setItem('jwtToken', response['data']['token']); 				
		 			}, (error) => {

		 				console.log('verifyToken error', error);
						// login token expired
		 				if ( error.code == 401 ) {

							localStorage.removeItem('isLoggedIn');
							localStorage.removeItem('userType');
					    localStorage.removeItem('jwtToken');
							
							clearInterval( this.tokenInterval );
									    
			 				// show login popup
			 				// this.sharedService.changeMessage("show_login");
			 			}
		 			});
		 		
		 		}

	 		}, 1000*60*20); // 20 minutes

	}

	ngOnDestroy() {
		
		clearInterval( this.tokenInterval );
	}
}
