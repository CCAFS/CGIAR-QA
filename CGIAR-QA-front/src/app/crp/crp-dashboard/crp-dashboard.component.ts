import { Component, OnInit, TemplateRef, ViewChild, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommentService } from "../../services/comment.service";
import { AuthenticationService } from "../../services/authentication.service";
import { DashboardService } from "../../services/dashboard.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { User } from '../../_models/user.model';
import { GeneralIndicatorName } from '../../_models/general-status.model'
import { Title } from '@angular/platform-browser';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective } from 'ng2-charts';

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
    },
    onClick: this.graphClickEvent
  };
  barChartLabels: Label[];
  barChartType: ChartType = 'horizontalBar';
  // barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;

  barChartData: ChartDataSets[];

  has_comments: boolean = false;

  spinner1 = 'spinner1';
  spinner2 = 'spinner2';

  @ViewChild('crpChart', { static: false }) crpChart: BaseChartDirective;

  // @ViewChild('crpChart', { static: true })
  // crpChart: BaseChartDirective;
  // myChart: any;




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
      // this.getCommentStats();
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
    this.showSpinner(this.spinner2);
    // this.commentService.getCommentCRPStats({ crp_id: this.currentUser.crp.crp_id })
    this.dashService.getAllDashboardEvaluations(this.currentUser.crp.crp_id)
      .subscribe(
        res => {
          // console.log(res)
          this.dashboardData = this.dashService.groupData(res.data);
          this.hideSpinner(this.spinner2);
        },
        error => {
          this.hideSpinner(this.spinner2)
          console.log("getAllDashData", error);
          this.alertService.error(error);
        },
      )

  }

  getCommentStats() {
    this.showSpinner(this.spinner1);
    this.commentService.getCommentCRPStats({ crp_id: this.currentUser.crp.crp_id })
      .subscribe(
        res => {
          this.has_comments = res.data ? true : false
          console.log(res, this.has_comments);
          this._setCharData(res)
          // Object.assign(this, { barChartLabels: res.data.label });
          // Object.assign(this, { barChartData: res.data.data_set });
          this.hideSpinner(this.spinner1);
        },
        error => {
          this.hideSpinner(this.spinner1)
          console.log("getCommentStats", error);
          this.alertService.error(error);
        },
      )
  }

  private _setCharData(response_data) {
    Object.assign(this, { barChartLabels: response_data.data.label });
    Object.assign(this, { barChartData: response_data.data.data_set });
    // this.crpChart.datasets = response_data.data.label;
    // this.myChart.labels = response_data.data.data_set;
    // this.barChartLabels = response_data.data.label;
    // this.barChartData = response_data.data.data_set;
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
    // this.getEvaluationsStats()
    this.modalRef = this.modalService.show(template);
  }



  /***
   * 
   *  Spinner 
   * 
   ***/
  showSpinner(name) {
    this.spinner.show(name);
  }
  hideSpinner(name) {
    this.spinner.hide(name);
  }






  /**
   * 
   * Chart controllers
   */




  graphClickEvent(event, array) {
    console.log(event, array[0], this.crpChart)
    console.log('ch<rt', this.crpChart)
    // .chart.getElementsAtEvent(event))
    // .getElementsAtEvent(evt))
  }

  // this.canvas.onclick = function (evt) {
  //   let activePoints = this.baseChart.getElementsAtEvent(evt);
  //   console.log(activePoints)
  //   // => activePoints is an array of points on the canvas that are at the same position as the click event.
  // };















}
