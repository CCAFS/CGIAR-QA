import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { OrderPipe } from 'ngx-order-pipe';

import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';
import { CommentService } from 'src/app/services/comment.service';

import { User } from '../../_models/user.model';
import { GeneralIndicatorName, StatusIconCRP } from 'src/app/_models/general-status.model';

import { saveAs } from "file-saver";
import { Title } from '@angular/platform-browser';
import { SortByPipe } from 'src/app/pipes/sort-by.pipe';
import { SafeUrlPipe } from 'src/app/pipes/safe-url.pipe';

import * as moment from 'moment';
import { FormBuilder } from '@angular/forms';
import { IndicatorsService } from 'src/app/services/indicators.service';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss'],
  providers: [SortByPipe, SafeUrlPipe]
})
export class CRPIndicatorsComponent implements OnInit {
  indicatorType: string;
  indicatorTypeName: string;
  evaluationList: any[];
  returnedArray: any[];
  currentUser: User;

  currentPage = {
    startItem: 0,
    endItem: 10
  }
  stageHeaderText = {
    policies: 'Level',
    oicr: 'Maturity Stage',
    innovations: 'Stage',
    melia: 'Type',
    publications: 'ISI',
    milestones: 'Milestone Status',
  }
  statusIconCRP = StatusIconCRP;
  maxSize = 5;
  pageSize = 4;
  collectionSize = 0;
  searchText;
  evalStatusFilter = '';

  hasTemplate = false;

  notProviedText = '<No provided>'

  order: string = 'status';
  configTemplate: string;
  reverse: boolean = false;

  spinner_name = 'spIndicators';
  btonFilterForm: any;
  submission_dates = [];
  rsaFilter: boolean = false;


  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private dashService: DashboardService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private commentService: CommentService,
    private spinner: NgxSpinnerService,
    private orderPipe: SortByPipe,
    private indicatorService: IndicatorsService,
    // private orderPipe: OrderPipe,
    private titleService: Title,
    private alertService: AlertService) {
      this.getBatchDates();

    this.activeRoute.params.subscribe(routeParams => {
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
      });
      this.btonFilterForm = this.formBuilder.group({
        radio: 'A'
      });
      this.indicatorType = routeParams.type;
      this.configTemplate = this.currentUser.config[`${this.indicatorType}_guideline`]
      this.indicatorTypeName = GeneralIndicatorName[`qa_${this.indicatorType}`];
      // this.indicatorTypeName = this.indicatorType.charAt(0).toUpperCase() + this.indicatorType.slice(1);
      this.getEvaluationsList(routeParams);
      /** set page title */
      this.titleService.setTitle(`List of ${this.indicatorTypeName}`);
    })
  }

  ngOnInit() {
    // setTimeout(() => {                           //<<<---using ()=> syntax
    //   this.verifyIfOrderByStatus();
    // }, 1000);
  }


  getEvaluationsList(params) {
    this.showSpinner(this.spinner_name);
    this.dashService.geListDashboardEvaluations(this.currentUser.id, `qa_${params.type}`, params.primary_column, this.currentUser.crp.crp_id).subscribe(
      res => {
        console.log(res)
        this.evaluationList = this.orderPipe.transform(res.data, (this.reverse) ? 'asc' : 'desc', this.order);
        this.collectionSize = this.evaluationList.length;
        this.returnedArray = this.evaluationList.slice(0, 10);
        this.hasTemplate = this.currentUser.config[0][`${params.type}_guideline`] ? true : false;
        console.log(this.evaluationList);
        
        this.hideSpinner(this.spinner_name);
      },
      error => {
        this.hideSpinner(this.spinner_name);
        this.returnedArray = []
        this.alertService.error(error);
      }
    )
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    // // console.log(this.evaluationList.length, this.returnedArray.length)
    this.currentPage = {
      startItem,
      endItem
    }
    this.evaluationList = this.orderPipe.transform(this.evaluationList, (this.reverse) ? 'asc' : 'desc', this.order);
    this.returnedArray = this.evaluationList.slice(startItem, endItem);
  }


  setOrder(value: string) {
    if (value == null) {
      this.reverse = !this.reverse;
    } else {
      if (this.order === value) {
        this.reverse = !this.reverse;
      }
      this.order = value;
    }
    // console.log(this.evaluationList, this.order, this.reverse)
    this.evaluationList = this.orderPipe.transform(this.evaluationList, (this.reverse) ? 'asc' : 'desc', this.order);
    // this.returnedArray = this.evaluationList.slice(this.currentPage.startItem, this.currentPage.endItem);
  }

  goToView(indicatorId) {
    this.router.navigate(['./detail', indicatorId], { relativeTo: this.activeRoute });
  }

  goToPDF(type: string) {
    let pdf_url;
    switch (type) {
      case 'AR':
        pdf_url = this.currentUser.config[0]["anual_report_guideline"];
        break;
      default:
        pdf_url = this.currentUser.config[0][`${type}_guideline`];
        break;
    }
    window.open(pdf_url, "_blank");
  }

  exportComments(item, all?) {
    this.showSpinner(this.spinner_name);
    let filename = `QA-${this.indicatorType.charAt(0).toUpperCase()}${this.indicatorType.charAt(1).toUpperCase()}${(item) ? '-' + item.id : ''}_${moment().format('YYYYMMDD_HHmm')}`
    console.log('filename',filename);
    if(this.authenticationService.getBrowser() === 'Safari')
      filename += `.xlsx`
      
    this.commentService.getCommentsExcel({ evaluationId: (item) ? item.evaluation_id : undefined, id: this.currentUser.id, name: filename, indicatorName: `qa_${this.indicatorType}`, crp_id: all ? this.currentUser.crp.crp_id : undefined }).subscribe(
      res => {
        console.log(res)
        let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8" });
        saveAs(blob, filename);
        this.hideSpinner(this.spinner_name);
      },
      error => {
        // console.log("exportComments", error);
        this.hideSpinner(this.spinner_name);
        this.alertService.error(error);
      }
    )
  }

  returnListName(indicator: string, type: string) {
    let r;
    if (type === 'header') {
      switch (indicator) {
        case 'slo':
          r = 'Evidence on Progress towards SRF targets'
          break;

        default:
          r = `List of ${this.indicatorTypeName}`
          break;
      }
    } else if (type === 'list') {
      switch (indicator) {
        case 'slo':
          r = 'SLO target'
          break;
        case 'milestones':
          r = 'Milestone statement'
          break;

        default:
          r = `Title`
          break;
      }
    }

    return r;
  }

  verifyIfOrderByStatus() {
    if (this.indicatorService.getOrderByStatus() != null) {
      this.setOrder('status')
    }
  }
  formatBrief(brief: string) {
    if (brief) {
      return brief.split("<p>")[1] ? brief.split("<p>")[1].split("</p>")[0] : brief;
    }
    return;
  }
  
  fixAccent(value) {
    return value ? value.replace("´", "'") : value;
  }

  savePageList() {
    console.log(this.currentPage);
    this.indicatorService.setFullPageList(this.currentPage);
  }

  getBatchDates() {
    this.commentService.getBatches().subscribe(res => {

      const batches = res.data;
      for (let index = 0; index < batches.length; index++) {
        const batch = {date: moment(batches[index].submission_date).format('ll'), batch_name: +batches[index].batch_name, checked: false};
        this.submission_dates.push(batch);
      }
    }, error => {
      console.log(error)
      this.alertService.error(error);
    }
    )
  }

  onDateChange(e, subDate) {
    if(subDate) {
      console.log(e.target.checked, e.target.value);
      const foundIndex = this.submission_dates.findIndex(sd => sd.date == e.target.value);
      this.submission_dates[foundIndex]['checked'] = e.target.checked;
      this.submission_dates = [...this.submission_dates];
    }
  }

  /***
   * 
   *  Spinner 
   * 
   ***/
  showSpinner(name: string) {
    this.spinner.show(name);
  }

  hideSpinner(name: string) {
    this.spinner.hide(name);
  }


}
