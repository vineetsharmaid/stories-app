import { Component, OnInit } from '@angular/core';

import { UserService } from "../../services/admin/user.service";
import { CompaniesService } from "../../services/admin/companies.service";

import { environment } from '../../../environments/environment';
const APP_URL  =  environment.baseUrl;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public filterName: string = "";
	public filterCompany: string = "";
	public users: Array<Object>;
	public allUsers: Array<Object>;
	public currentUser: number;
	public setStatus: number;
	public currentIndex: number;
  public companies: Array<Object>;

  	constructor(private userService: UserService, private companiesService: CompaniesService) { }

  	ngOnInit() {

  		this.getUsers();
      this.getCompanies();
    }

    getCompanies() {
     
      this.companiesService.getCompanies().subscribe((response: Array<Object>) => {

        if ( response['status'] == true ) {
          
          var companies = response['data'] 
          companies.forEach((company) => {

              company['logo'] = company['logo'] == '' ? '' : APP_URL+'/assets/uploads/companies/'+company['logo'];
          });
          this.companies = companies;
        }

      }, error => {

        this.companies = [];
        console.log('getCompanies error', error);
      });
    }

  	getUsers() {
	   
	    this.userService.getUsers().subscribe((response: Array<Object>) => {

	      console.log('getUsers response', response);
	      if ( response['status'] == true ) {
	        
	        var users = response['data'];
	        users.forEach((user) => {

	        	user['profile_pic'] = user['profile_pic'] == '' ? '' : APP_URL+'/assets/uploads/users/'+user['profile_pic'];
	        })
	        this.allUsers = this.users = users;
	      }
	    }, error => {

	    	this.users = [];
	    	console.log('getUsers error', error);	    	
	    });
  	}

    searchByName(name) {
      const filterName = name.toString().toLowerCase();
      this.filterName  = filterName;
      console.log('filterCompany', this.filterCompany);

      if( filterName == "" && this.filterCompany == "" ) {
        this.users = this.allUsers;
        return;
      }

      this.users = this.allUsers.filter((user) => {

        var username = user['first_name']+' '+user['last_name'];
        if( this.filterCompany == "" ) {
          
          if( username.toLowerCase().includes(filterName) ) {
            return true;
          }
        } else {

          if( username.toLowerCase().includes(filterName) && user['company_id'] == this.filterCompany ) {
            return true;
          }
        }
      });
    }

  	searchByCompany(companId) {
      this.filterCompany = companId;
      
      if( this.filterCompany == "") {
        // this.users = this.allUsers;
        this.searchByName(this.filterName);
        return;
      }
  		this.users = this.allUsers.filter((user) => {

        if( this.filterName == "" ) {
          
          if( user['company_id'] == companId ) {
            return true;
          }
        } else {
          var filterName = this.filterName.toString().toLowerCase();  
          var username = user['first_name']+' '+user['last_name'];
          if( username.toLowerCase().includes(filterName) && user['company_id'] == companId ) {
            return true;
          }
        }
  		});
  	}

  	changeStatus(setStatus, currentUser, currentIndex) {

  		this.userService.updateStatus(currentUser, setStatus).subscribe((response) => {

  			this.users[currentIndex]['status_id'] = setStatus;
  			this.users[currentIndex]['status'] = setStatus == 1 ? 'Active' : 'Inactive';

  		}, (error) => {
  			
  			console.log('error', error);
  		})
  	}

}
