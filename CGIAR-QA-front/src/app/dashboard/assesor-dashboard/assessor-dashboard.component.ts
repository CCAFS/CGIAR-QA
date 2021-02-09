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
import { IndicatorsService } from 'src/app/services/indicators.service';
import { UsersService } from 'src/app/services/users.service';

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
  selectedIndicator = 'qa_slo';
  dataSelected: any;
notifications: any[] = [
  {assessor: 'assessor-a', description: ' has approved without comment title in QA-PO-101'},
  {assessor: 'assessor-b', description: ' has closed QA-OI-002'},
  {assessor: 'assessor-c', description: ' has comment title in QA-SL-200'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
  {assessor: 'assessor-d', description:  'has closed QA-OI-010'},
]
  constructor(private dashService: DashboardService,
    private authenticationService: AuthenticationService,
    private indicatorService: IndicatorsService,
    private usersService: UsersService,
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
    console.log(this.currentUser);
    this.usersService.getUserById(this.currentUser.id).subscribe(res => {
      console.log(res.data.indicators);
      this.authenticationService.parseUpdateIndicators(res.data.indicators);
    })
    this.getCommentStats();
  }

  getIndicatorName(indicator: string) {
    return this.indicatorsName[indicator]
  }

  actualIndicator(indicator: string) {
    this.selectedIndicator = indicator;
    this.dataSelected = this.dashboardData[this.selectedIndicator];
    console.log(this.selectedIndicator, this.dashboardData[this.selectedIndicator]); 
  }

  actualStatusIndicator(data) {
    let indicator_status = false;
    for (const item of data) {
      if(item.indicator_status==1) indicator_status =  true;
    }
    return indicator_status;
  }

  goToView(view: string, primary_column: string) {
    this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]);
  }

  getDashData() {
    // this.showSpinner();
    this.dashService.getDashboardEvaluations(this.currentUser.id).subscribe(
      res => {
        console.log(res)
        this.dashboardData = this.dashService.groupData(res.data);
        // this.getCommentStats();
      console.log(this.dashboardData);
      this.dataSelected = this.dashboardData[this.selectedIndicator];

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
    this.showSpinner();
    return this.commentService.getCommentCRPStats({ crp_id, id: null })
      .subscribe(
        res => {
          // console.log(res)
          this.dashboardCommentsData = this.dashService.groupData(res.data);

          //getDashData depends on getCommentStats
          this.getDashData();

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

  formatStatusIndicatorData(data) {
    const colors= {
      complete: '#59ed9c',
      pending: '#f3da90',
      finalized: '#ed8b84'
    }
    let dataset = [];
    let brushes = [];
    for (const item of data) {
      dataset.push({Label: item.status, Value: +item.label});
      brushes.push(colors[item.status]);
    }

    return {dataset, brushes}
  }


}
