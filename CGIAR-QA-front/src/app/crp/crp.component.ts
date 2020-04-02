import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../services/authentication.service";
import { IndicatorsService } from "../services/indicators.service";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../services/alert.service';

import { User } from '../_models/user.model';
import { CRP } from '../_models/crp.model';
import { GeneralStatus, GeneralIndicatorName } from '../_models/general-status.model'

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

  constructor(private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private indicatorService: IndicatorsService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService, ) {

    this.route.queryParamMap.subscribe(params => {
      this.params = params;
      // this.router.navigate([`/crp/dashboard`])
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    if (!this.currentUser) {
      this.validateToken(this.params['params']);
    } else {
      this.getCRPIndicators();
    }
    // this.router.navigate([`/crp/dashboard`])
  }

  validateToken(params: {}) {
    console.log(this.currentUser, params)
    this.authenticationService.tokenLogin(params).subscribe(
      res => {
        console.log(res)
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
            this.indicators = res.data;
            this.hideSpinner(this.spinner_name);
            // console.log(this.indicators)
          },
          error => {
            this.hideSpinner(this.spinner_name);
            console.log("getCRPIndicators", error);
            this.alertService.error(error);
          }
        );
    }
  }

  goToView(view: string, data) {
    if (data === null) {
      this.router.navigate([`/crp/${view}`])
    } else {
      this.router.navigate(['/reload']).then(() => { this.router.navigate([`/crp/indicator/${data.name.toLowerCase()}/${data.primary_field}`]) });
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
