import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommentService } from "../../services/comment.service";
import { AuthenticationService } from "../../services/authentication.service";
import { DashboardService } from "../../services/dashboard.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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

  dashboardModalData: any[];
  modalRef: BsModalRef;
  
  multi = [];
  has_comments: boolean = false;
  // view: any[] = [undefined,700];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Indicators';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Comments';
  legendTitle: string = 'Labels';
  colorScheme = {
    domain: ['#ffca30', '#0f8981', '#2e7636']
  };


  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
    private commentService: CommentService,
    private dashService: DashboardService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService, ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });

  }

  ngOnInit() {
    this.getEvaluationsStats();
    // this.getCommentStats();
    // console.log('crp-dashboard')
  }

  getEvaluationsStats() {
    this.showSpinner();
    // this.commentService.getCommentCRPStats({ crp_id: this.currentUser.crp.crp_id })
    this.dashService.getAllDashboardEvaluations(this.currentUser.crp.crp_id)
      .subscribe(
        res => {
          this.dashboardData = this.dashService.groupData(res.data);
          console.log(this.dashboardData)
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

  getCommentStats() {
    this.commentService.getCommentCRPStats({ crp_id: this.currentUser.crp.crp_id })
      .subscribe(
        res => {
          this.has_comments = res.data.length > 0 ? true:false
          Object.assign(this, { multi: res.data });
          this.hideSpinner();
        },
        error => {
          this.hideSpinner()
          console.log("getCommentStats", error);
          this.alertService.error(error);
        },
      )
  }


  openModal(template: TemplateRef<any>) {
    this.dashboardModalData = []
    this.getCommentStats()
    this.modalRef = this.modalService.show(template);
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






  /**
   * 
   * Chart controllers
   */


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


  axisFormat(val) {
    if (val % 1 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }


























}
