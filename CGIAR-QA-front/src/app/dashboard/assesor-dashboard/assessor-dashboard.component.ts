import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';
import { GeneralStatus } from "../../_models/general-status.model"

@Component({
  selector: 'app-assessor-dashboard',
  templateUrl: './assessor-dashboard.component.html',
  styleUrls: ['./assessor-dashboard.component.scss']
})
export class AssessorDashboardComponent implements OnInit {

  currentUser: User;
  dashboardData: any[];
  generalStatus = GeneralStatus;

  constructor(private dashService: DashboardService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit() {
    this.getDashData();
  }

  goToView(view: string, primary_column: string) {
    this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
  }


  getDashData() {
    this.showSpinner();
    this.dashService.getDashboardEvaluations(this.currentUser.id).subscribe(
      res => {
        this.dashboardData = this.dashService.groupData(res.data);
        // console.log(this.dashboardData)
        this.hideSpinner();
      },
      error => {
        console.log("getDashData", error);
        this.hideSpinner();
        this.alertService.error(error);
      }
    )
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
