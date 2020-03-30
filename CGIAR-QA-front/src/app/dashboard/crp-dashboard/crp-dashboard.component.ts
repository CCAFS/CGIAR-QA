import { Component, OnInit } from '@angular/core';

import { CommentService } from "../../services/comment.service";
import { AuthenticationService } from "../../services/authentication.service";
import { DashboardService } from "../../services/dashboard.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';
import { CRP } from '../../_models/crp.model';
import { GeneralStatus } from '../../_models/general-status.model'

@Component({
  selector: 'app-crp-dashboard',
  templateUrl: './crp-dashboard.component.html',
  styleUrls: ['./crp-dashboard.component.scss']
})
export class CrpDashboardComponent implements OnInit {
  dashboardData: any[];
  currentUser: User;

  constructor(private authenticationService: AuthenticationService, 
              private commentService: CommentService,
              private dashServicce: DashboardService,
              private alertService: AlertService,
              private spinner: NgxSpinnerService,) { 
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit() {
    console.log(
      this.dashServicce.groupData(
      {
        "responded": [
          {
            "indicator_view_name": "qa_innovations",
            "status": "complete",
            "type": "success",
            "value": "1",
            "crp_id": "CRP-22",
            "label": "1",
            "primary_field": "project_innovation_id"
          },
          {
            "indicator_view_name": "qa_innovations",
            "status": "pending",
            "type": "danger",
            "value": "933",
            "crp_id": "CRP-23",
            "label": "933",
            "primary_field": "project_innovation_id"
          }
        ],
        "no_responded": [
          {
            "indicator_view_name": "qa_policies",
            "status": "complete",
            "type": "success",
            "value": "3",
            "crp_id": "CRP-11",
            "label": "3",
            "primary_field": "project_innovation_id"
          },
          {
            "indicator_view_name": "qa_policies",
            "status": "pending",
            "type": "danger",
            "value": "451",
            "crp_id": "CRP-11",
            "label": "451",
            "primary_field": "project_innovation_id"
          }
        ]
      }
    ))
    this.getCommentStats();
    
  }

  getCommentStats(){
    this.showSpinner();
    this.commentService.getCommentCRPStats({crp_id: this.currentUser.crp.crp_id})
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
