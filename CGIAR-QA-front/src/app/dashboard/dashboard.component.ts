import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../_models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard-home',
  templateUrl: './dashboard.component.html',
  //   styleUrls: ['./dashboard.component.scss']
})
export class DashBoardComponent implements OnInit {
  currentUser: User;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      if (x) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    // console.log(this.currentUser)
    if(this.currentUser){
      this.router.navigate([`dashboard/${this.currentUser.roles[0].description.toLowerCase()}`]);
    }else{
      this.router.navigate([`login`]);
    }
  }

}
