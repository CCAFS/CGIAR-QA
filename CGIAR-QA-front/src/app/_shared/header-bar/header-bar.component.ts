import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private activeRoute: ActivatedRoute, private authenticationService: AuthenticationService, private router: Router, private indicatorService: IndicatorsService, private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      if (x) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.getHeaderLinks();
  }

  goToView(indicator: any) {
    if (indicator === 'logo') {
      this.router.navigate(['/reload']).then(() => { this.router.navigate([`dashboard/${this.currentUser.roles[0].description.toLowerCase()}`]); });
      return
    }


    let view = indicator.indicator.name;
    let primary_column = indicator.indicator.primary_field;


    switch (this.currentUser.roles[0].description) {
      case this.allRoles.admin:
        this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]);
        // this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
        // this.router.navigate(['/reload']).then(() => { this.router.navigate([`dashboard/${this.allRoles.admin.toLocaleLowerCase()}/indicator`, view.toLocaleLowerCase(), primary_column]) });
        break;
      case this.allRoles.asesor:
        if (indicator.indicator.enable_assessor) {
          this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]);
          // this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
        }
        break;

      default:
        break;
    }


  }

  getHeaderLinks() {
    if (this.currentUser && !this.isCRP()) {
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
