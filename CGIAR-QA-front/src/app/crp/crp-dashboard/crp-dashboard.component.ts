import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommentService } from "../../services/comment.service";
import { AuthenticationService } from "../../services/authentication.service";
import { DashboardService } from "../../services/dashboard.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';
import { CRP } from '../../_models/crp.model';
import { GeneralStatus, GeneralIndicatorName } from '../../_models/general-status.model'

@Component({
  selector: 'app-crp-dashboard',
  templateUrl: './crp-dashboard.component.html',
  styleUrls: ['./crp-dashboard.component.scss']
})


export class CrpDashboardComponent implements OnInit {
  dashboardData: any[];
  currentUser: User;
  indicatorsName = GeneralIndicatorName;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commentService: CommentService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService, ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit() {
    this.getCommentStats();
    // console.log('crp-dashboard')
  }

  getCommentStats() {
    this.showSpinner();
    this.commentService.getCommentCRPStats({ crp_id: this.currentUser.crp.crp_id })
      .subscribe(
        res => {
          console.log(res)
          this.dashboardData = res.data;
          this.hideSpinner();
        },
        error => {
          this.hideSpinner()
          console.log("getAllDashData", error);
          this.alertService.error(error);
        },
      )

  }

  getIndicatorName(indicator: string) {
    return this.indicatorsName[indicator]
  }

  goToView(indicatorId, primary_column) {
    console.log(indicatorId, primary_column)
    this.router.navigate([`crp/indicator/${indicatorId}/${primary_column}`]);
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
