import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';
import { GeneralStatus, GeneralIndicatorName } from "../../_models/general-status.model"
import { Title } from '@angular/platform-browser';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-assessor-dashboard',
  templateUrl: './assessor-dashboard.component.html',
  styleUrls: ['./assessor-dashboard.component.scss']
})
export class AssessorDashboardComponent implements OnInit {

  currentUser: User;
  dashboardData: any[];
  dashboardCommentsData: any[];
  generalStatus = GeneralStatus;
  indicatorsName = GeneralIndicatorName;

  constructor(private dashService: DashboardService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private commentService: CommentService,
    private router: Router,
    private titleService: Title,
    private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
    /** set page title */
    this.titleService.setTitle(`Assessor Dashboard`);
  }

  ngOnInit() {
    this.getDashData();
    this.getCommentStats();
    // 
  }

  getIndicatorName(indicator: string) {
    return this.indicatorsName[indicator]
  }

  goToView(view: string, primary_column: string) {
    this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]);
  }


  getDashData() {
    this.showSpinner();
    this.dashService.getDashboardEvaluations(this.currentUser.id).subscribe(
      res => {
        // console.log(res)
        this.dashboardData = this.dashService.groupData(res.data);
        // this.getCommentStats();
        this.hideSpinner();
      },
      error => {
        console.log("getDashData", error);
        this.hideSpinner();
        this.alertService.error(error);
      }
    )
  }
  // comments by crp
  getCommentStats(crp_id?) {
    // this.showSpinner();
    return this.commentService.getCommentCRPStats({ crp_id, id: null })
      .subscribe(
        res => {
          // console.log(res)
          this.dashboardCommentsData = this.dashService.groupData(res.data);
          // this.hideSpinner();
        },
        error => {
          this.hideSpinner()
          console.log("getCommentStats", error);
          this.alertService.error(error);
        },
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
