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

  constructor(private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private indicatorService: IndicatorsService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService, ) {

  }
  currentUser: User;
  indicators = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.currentUser = this.authenticationService.currentUserValue;
      if (!this.currentUser) {
        this.validateToken(params['params']);
      } else {
        this.getCRPIndicators();
      }
    });

  }

  validateToken(params: {}) {
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
        this.hideSpinner()
        console.log("validateToken", error);
        this.alertService.error(error);
        // this.router.navigate(['/qa-close']);
      }
    )
  }

  getCRPIndicators() {
    console.log(this.indicators)
    if (!this.indicators.length) {
      this.showSpinner()
      this.indicatorService.getIndicatorsByUser(this.currentUser.id)
        .subscribe(
          res => {
            this.indicators = res.data;
            this.hideSpinner();
            // console.log(this.indicators)
          },
          error => {
            this.hideSpinner();
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
    this.router.navigate(['/login']);
  }

  /***
   * 
   *  Spinner 
   * 
   ***/
  showSpinner() {
    this.spinner.show();
  }
  hideSpinner() {
    this.spinner.hide();
  }


}
