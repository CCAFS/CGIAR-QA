import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';

import { AuthenticationService } from "../../services/authentication.service";
import { IndicatorsService } from "../../services/indicators.service";
import { AlertService } from '../../services/alert.service';



import { User } from '../../_models/user.model';
import { Role } from '../../_models/roles.model';
import { GeneralStatus } from '../../_models/general-status.model';
import { filter, pairwise } from 'rxjs/operators';

// import { filter, pairwise } from 'rxjs'

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

  isHome;

  chatRooms = null;

  assessorsChat = {
    isOpen: false
  }

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

  constructor(private activeRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public router: Router,
    private indicatorService: IndicatorsService,
    private alertService: AlertService) {

    this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      pairwise()
    )
      .subscribe((e: any[]) => {
        e.forEach(element => {
          if (element.url != '/login') {
            this.authenticationService.currentUser.subscribe(x => {
              this.currentUser = x;
              if (x) {
                this.currentRole = x.roles[0].description.toLowerCase()
                this.ngOnInit();
                this.getHeaderLinks();
                this.isHome = `/dashboard/${this.currentUser}`;
              }
            },
              err => { console.log(err) });
          }
        });
      });
  }

  getCurrentRoute() {
    return this.router.isActive(`/dashboard/${this.currentRole}`, true);
  }

  ngOnInit() {
    this.indicators = this.authenticationService.userHeaders;
    // console.log('NAV INDICATORS', this.indicators);
  }

  getIndicators() {
    // console.log('NAV INDICATORS', this.indicators);
  }

  goToView(indicator: any) {
    if (indicator === 'logo' || indicator === 'home') {
      this.router.navigate([`dashboard/${this.currentUser.roles[0].description.toLowerCase()}`]);
      return
    }


    let view = indicator.indicator.name;
    let primary_column = indicator.indicator.primary_field;

  }

  goToAssessorsChat() {
    window.open('./assessors-chat');
  }

  getHeaderLinks() {
    if (this.indicators && !this.indicators.length && this.currentUser && !this.isCRP()) {
      this.indicatorService.getIndicatorsByUser(this.currentUser.id).subscribe(
        res => {
          console.log("getHeaderLinks", res);
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
      return this.currentUser.crp ? true : false;
    }
    return false;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * validate current route.url to show header bar
   */
   headerAvailable() {
    const urlAdd = this.router.url;
    let r = true;
    switch (true) {
      case (urlAdd == '/'):
        r = false;
        break;
      case urlAdd.indexOf('login') != -1:
        r = false;
        break;
      case urlAdd.indexOf('crp') != -1:
        r = false;
        break;
      case urlAdd.indexOf('qa-close') != -1:
        r = false;
        break;

      default:
        break;
    }
    console.log(r)

    return r;
  }


}
