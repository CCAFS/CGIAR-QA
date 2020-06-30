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

import { saveAs } from "file-saver";

import * as moment from 'moment';

@Component({
  selector: 'app-crp-dashboard',
  templateUrl: './crp-dashboard.component.html',
  styleUrls: ['./crp-dashboard.component.scss']
})


export class CrpDashboardComponent implements OnInit {
  dashboardData: any[];
  dashboardCommentsData: any[];


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

  multi = [];
  rawCommentsData = [];
   // options
   showXAxis: boolean = true;
   showYAxis: boolean = true;
   gradient: boolean = false;
   showLegend: boolean = true;
   showXAxisLabel: boolean = true;
   xAxisLabel: string = 'Indicator';
   showYAxisLabel: boolean = true;
   yAxisLabel: string = '# of comments';
   animations: boolean = true;
 
   colorScheme = {
     domain: ['#67be71', '#F1B7B7']
   };




  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
    private commentService: CommentService,
    private dashService: DashboardService,
    private alertService: AlertService,
    private titleService: Title,
    private spinner: NgxSpinnerService,) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.getEvaluationsStats();
      this.getCommentStats();
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
          this.dashboardData = this.dashService.groupData(res.data);
          // console.log(this.dashboardData)
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
          // this.has_comments = res.data ? true : false
          this.dashboardCommentsData = this.dashService.groupData(res.data);
          console.log(this.dashboardCommentsData);
          // this.dashboardCommentsData = res.data;
          // this._setCharData(res)
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

  getRawComments(crp_id?) {
    // console.log('asd', crp_id)
    this.commentService.getRawComments({ crp_id})
      .subscribe(
        res => {
          // console.log('getRawComments', this.groupCommentsChart(res.data))
          this.rawCommentsData = res.data;
          Object.assign(this, { multi: this.groupCommentsChart(res.data) });
          this.has_comments = (res.data.length > 0);
          this.hideSpinner(this.spinner1);;
        },
        error => {
          this.hideSpinner(this.spinner1);
          console.log("getRawComments", error);
          this.alertService.error(error);
        },
      )
  }

  downloadRawComments() {
    this.showSpinner(this.spinner1);
    // console.log(this.selectedProg)
    let crp_id = this.currentUser.crp['crp_id'];
    let filename = `QA-COMMENTS-${this.currentUser.crp.hasOwnProperty('acronym') && this.currentUser.crp['acronym'] !== 'All'  ? '(' + this.currentUser.crp['acronym'] + ')' : ''}${moment().format('YYYYMMDD:HHmm')}`
    if (this.authenticationService.getBrowser() === 'Safari')
      filename += `.xlsx`;

    this.commentService.getCommentsRawExcel(crp_id).subscribe(
      res => {
        // console.log(res)
        let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8" });
        saveAs(blob, filename);
        this.hideSpinner(this.spinner1);
      },
      error => {
        console.log("downloadRawComments", error);
        this.hideSpinner(this.spinner1);
        this.alertService.error(error);
      }
    )
  }



  getPendingResponseComments(data) {
    // console.log(data, ))
    let f = this.findObjectByKey(data, 'type', 'secondary')
    let resText = f ? `${f.comments_without_answer} not responde yet` : 'all responded';
    return resText
  }

  private findObjectByKey(array, key, value?) {
    for (var i = 0; i < array.length; i++) {
      // if (array[i].hasOwnProperty(key)) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null;
  }

  private _setCharData(response_data) {
    Object.assign(this, { barChartLabels: response_data.data.label });
    Object.assign(this, { barChartData: response_data.data.data_set });
    // this.crpChart.datasets = response_data.data.label;
    // this.myChart.labels = response_data.data.data_set;
    // this.barChartLabels = response_data.data.label;
    // this.barChartData = response_data.data.data_set;
  }

  private  groupCommentsChart(data) {
    let cp = Object.assign([], data), key = 'indicator_view_name', res = [];
    let groupedData = Object.assign([], this.dashService.groupByProp(cp, key));

    for (const iterator in groupedData) {
      // console.log(groupedData[iterator], iterator)
      let d = {
        name: groupedData[iterator][0].indicator_view_display,
        series: []
      }
      d.series.push(
        {
          name: 'Approved',
          value: groupedData[iterator].reduce((sum, current) => sum + parseInt(current.comment_approved), 0)
        },
        {
          name: 'Rejected',
          value: groupedData[iterator].reduce((sum, current) => sum + parseInt(current.comment_rejected), 0)
        }
      );


      res.push(d)
    }
    return res;
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
    this.getRawComments( this.currentUser.crp.crp_id )
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

  onSelect(data): void {
    let parsedData = JSON.parse(JSON.stringify(data))
    if (typeof parsedData === 'object') {
      // console.log('Item clicked', parsedData);
      // this.has_comments_detailed = true;
      // this.has_comments = false;
    }
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }












}
