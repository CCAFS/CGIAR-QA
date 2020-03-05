import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from "../../services/authentication.service";
import { IndicatorsService } from "../../services/indicators.service";
import { AlertService } from '../../services/alert.service';



import { User } from '../../_models/user.model';
import { Role } from '../../_models/roles.model';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  currentUser: User;
  allRoles = Role;
  indicators = [];

  constructor(private authenticationService: AuthenticationService, private router: Router, private indicatorService: IndicatorsService, private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.getHeaderLinks()
  }

  goToView(view: string, primary_column: string) {
    this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
  }

  getHeaderLinks() {
    if (this.currentUser) {
      this.indicatorService.getIndicatorsByUser(this.currentUser.id).subscribe(
        res => {
          this.indicators = res.data;
        },
        error => {
          console.log("getHeaderLinks", error);
          this.alertService.error(error);
        }
      )
    }

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
