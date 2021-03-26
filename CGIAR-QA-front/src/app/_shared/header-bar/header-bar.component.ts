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
  currentRole = '';
  params;

  isHome ;

  
  indicatorsName = [
    { name: 'SLOs', viewname: 'qa_slo' },
    { name: 'Policies', viewname: 'qa_policies' },
    { name: 'OICRs', viewname: 'qa_oicr' },
    { name: 'Innovations', viewname: 'qa_innovations' },
    { name: 'Milestones', viewname: 'qa_milestones' },
    { name: 'Peer Reviewed Papers', viewname: 'qa_publications' },
    { name: 'CapDevs', viewname: 'qa_capdev' },
    { name: 'MELIAs', viewname: 'qa_melia' },
    // qa_outcomes: 'Outcomes',
  ]

  constructor(private activeRoute: ActivatedRoute, private authenticationService: AuthenticationService, public router: Router, private indicatorService: IndicatorsService, private alertService: AlertService) {
    this.activeRoute.params.subscribe(routeParams => {
      this.params = routeParams;
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
        if (x) {
          this.currentRole = x.roles[0].description.toLowerCase()
          this.ngOnInit();
          this.getHeaderLinks();
          this.isHome =`/dashboard/${this.currentUser}`;
          // this.isHome = this.router.isActive( `/dashboard/${this.currentUser}` , true)
        }
      });
    })

  }

  getCurrentRoute(){
    return this.router.isActive( `/dashboard/${this.currentRole}` , true);
  }

  ngOnInit() {
    this.indicators = this.authenticationService.userHeaders;
    console.log('NAV INDICATORS', this.indicators);
    
    // this.getHeaderLinks();
  }

  goToView(indicator: any) {
    // //console.log(this.router.navigate(['/reload']), this.activeRoute.pathFromRoot.toString(), this.router.url.toString().indexOf('/indicator'))

    if (indicator === 'logo' || indicator === 'home') {
      this.router.navigate([`dashboard/${this.currentUser.roles[0].description.toLowerCase()}`]);
      return
    }


    let view = indicator.indicator.name;
    let primary_column = indicator.indicator.primary_field;

  }

  goToAssessorsChat() {
    this.router.navigate([`assessors-chat`]);

  }

  getHeaderLinks() {
    if (this.indicators && !this.indicators.length && this.currentUser && !this.isCRP()) {
      this.indicatorService.getIndicatorsByUser(this.currentUser.id).subscribe(
        res => {
          // console.log("getHeaderLinks", res);
          this.indicators = res.data.filter(indicator => indicator.indicator.type = indicator.indicator.name.toLocaleLowerCase());
          this.authenticationService.userHeaders = this.indicators;
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
      // let mapped_roles = this.currentUser.roles.map(role => { return role.description });
      // let has_roles = mapped_roles.find(role_ => {
      //   return this.allRoles.crp.indexOf(role_) > -1
      // });
      // return has_roles
      return this.currentUser.crp ? true : false;
    }
    return false;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
