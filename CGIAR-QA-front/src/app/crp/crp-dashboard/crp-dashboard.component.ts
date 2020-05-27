import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommentService } from "../../services/comment.service";
import { AuthenticationService } from "../../services/authentication.service";
import { DashboardService } from "../../services/dashboard.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { User } from '../../_models/user.model';
import { GeneralStatus, GeneralIndicatorName } from '../../_models/general-status.model'
import { Title } from '@angular/platform-browser';
// import { CRP } from '../../_models/crp.model';
// import { CookieService } from 'ngx-cookie-service';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

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

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  has_comments: boolean = false;

  // multi = [];
  // has_comments: boolean = false;
  // // view: any[] = [undefined,700];
  // // options
  // showXAxis: boolean = true;
  // showYAxis: boolean = true;
  // gradient: boolean = false;
  // showLegend: boolean = true;
  // showXAxisLabel: boolean = true;
  // xAxisLabel: string = 'Indicator';
  // showYAxisLabel: boolean = true;
  // yAxisLabel: string = 'Total';
  // legendTitle: string = 'Type';
  // colorScheme = {
  //   domain: ['#ffca30', '#2e7636', '#0f8981', '#61b33e', '#F1B7B7', '#b73428']
  // };


  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
    private commentService: CommentService,
    private dashService: DashboardService,
    private alertService: AlertService,
    private titleService: Title,
    private spinner: NgxSpinnerService, ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.getEvaluationsStats();
    });

    /** set page title */
    this.titleService.setTitle(`CRP Dashboard`);

  }

  ngOnInit() {

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
          this.hideSpinner();
        },
        error => {
          this.hideSpinner()
          console.log("getAllDashData", error);
          this.alertService.error(error);
        },
      )

  }

  getCommentStats() {
    this.commentService.getCommentCRPStats({ crp_id: this.currentUser.crp.crp_id })
      .subscribe(
        res => {
          this.has_comments = res.data.length > 0 ? true : false
          // Object.assign(this, { multi: res.data });
          this.hideSpinner();
        },
        error => {
          this.hideSpinner()
          console.log("getCommentStats", error);
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


 


  axisFormat(val) {
    if (val % 1 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }


























}
