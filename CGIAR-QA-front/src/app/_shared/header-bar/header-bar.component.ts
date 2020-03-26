import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from "../../services/authentication.service";
import { IndicatorsService } from "../../services/indicators.service";
import { AlertService } from '../../services/alert.service';



import { User } from '../../_models/user.model';
import { Role } from '../../_models/roles.model';
import { GeneralStatus } from '../../_models/general-status.model';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  currentUser: User;
  allRoles = Role;
  generalStatus = GeneralStatus;
  indicators = [];

  constructor(private authenticationService: AuthenticationService, private router: Router, private indicatorService: IndicatorsService, private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      // console.log(x)
      this.currentUser = x;
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.getHeaderLinks()
  }

  goToView(indicator: any) {
    let view = indicator.indicator.name;
    let primary_column = indicator.indicator.primary_field;
    // console.log(indicator, view, primary_column,this.currentUser.roles[0])

    switch (this.currentUser.roles[0].description) {
      case this.allRoles.admin:
        this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
        break;
      case this.allRoles.asesor:
        if (indicator.enable_assessor) {
          this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
        }
        break;

      default:
        break;
    }


  }

  getHeaderLinks() {
    if (this.currentUser) {
      this.indicatorService.getIndicatorsByUser(this.currentUser.id).subscribe(
        res => {
          this.indicators = res.data;
          // console.log(res.data)
        },
        error => {
          console.log("getHeaderLinks", error);
          this.alertService.error(error);
        }
      )
    }

  }

  isCRP() {
    if (this.currentUser) {
      let mapped_roles = this.currentUser.roles.map(role => { return role.description });
      let has_roles = mapped_roles.find(role_ => {
        return this.allRoles.crp.indexOf(role_) > -1
      });
      return has_roles
    }
    return false;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
