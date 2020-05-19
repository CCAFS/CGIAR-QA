import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../services/authentication.service";
import { IndicatorsService } from "../services/indicators.service";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../services/alert.service';

import { User } from '../_models/user.model';
import { Role } from '../_models/roles.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crp',
  templateUrl: './crp.component.html',
  styleUrls: ['./crp.component.scss']
})
export class CrpComponent implements OnInit {
  currentUser: User;
  indicators = [];
  params;
  spinner_name = 'sp1';
  allRoles = Role;
  env = environment;

  constructor(private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private indicatorService: IndicatorsService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService, ) {

    this.route.queryParamMap.subscribe(params => {
      this.params = params;
      this.currentUser = this.authenticationService.currentUserValue;
      // this.indicators = this.authenticationService.userHeaders;
      console.log(this.params, this.currentUser)
      // this.validateToken(this.params['params']);
      if (!this.currentUser) {
        this.validateToken(this.params['params']);
      } 
      else {
        // this.router.navigate([`/crp/dashboard`])
        this.indicators = this.authenticationService.userHeaders;
        this.getCRPIndicators();
      }
    });
  }

  ngOnInit() {

  }

  validateToken(params: {}) {
    console.log(this.currentUser, params)
    this.authenticationService.tokenLogin(params).subscribe(
      res => {
        // console.log(res)
        this.authenticationService.currentUser.subscribe(x => {
          this.currentUser = x;
          this.router.navigate([`/crp/dashboard`])
          this.getCRPIndicators();
        })
      },
      error => {
        console.log("validateToken", error);
        this.logout()
        this.alertService.error(error);
      }
    )
  }

  getCRPIndicators() {
    if (!this.indicators.length && this.currentUser) {
      this.showSpinner(this.spinner_name)
      this.indicatorService.getIndicatorsByUser(this.currentUser.id)
        .subscribe(
          res => {
            console.log(res)
            this.indicators = res.data;
            this.authenticationService.userHeaders = res.data;
            this.hideSpinner(this.spinner_name);
          },
          error => {
            this.hideSpinner(this.spinner_name);
            console.log("getCRPIndicators", error);
            this.alertService.error(error);
          }
        );
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/qa-close'], { relativeTo: this.route });
  }

  /***
   * 
   *  Spinner 
   * 
   ***/
  showSpinner(name: string) {
    this.spinner.show(name);
  }

  hideSpinner(name: string) {
    this.spinner.hide(name);
  }


}
