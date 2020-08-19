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
import { GeneralIndicatorName } from 'src/app/_models/general-status.model';

import { saveAs } from "file-saver";
import { Title } from '@angular/platform-browser';
import { SortByPipe } from 'src/app/pipes/sort-by.pipe';

import * as moment from 'moment';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss'],
  providers: [SortByPipe]
})
export class CRPIndicatorsComponent implements OnInit {
  private indicatorType: string;
  private indicatorTypeName: string;
  private evaluationList: any[];
  private returnedArray: any[];
  private currentUser: User;

  private currentPage = {
    startItem: 0,
    endItem: 10
  }
  private stageHeaderText = {
    policies: 'Level',
    oicr: 'Maturity Level',
    innovations: 'Stage',
    melia: 'Type',
    publications: 'ISI',
    milestones: 'Milestone Status',
  }

  private maxSize = 5;
  private pageSize = 4;
  private collectionSize = 0;
  private searchText;
  private evalStatusFilter = '';

  private hasTemplate = false;

  private notProviedText = '<No provided>'

  private order: string = 'id';
  private configTemplate: string;
  private reverse: boolean = false;

  private spinner_name = 'spIndicators';
  private btonFilterForm: any;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private dashService: DashboardService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private commentService: CommentService,
    private spinner: NgxSpinnerService,
    private orderPipe: SortByPipe,
    // private orderPipe: OrderPipe,
    private titleService: Title,
    private alertService: AlertService) {
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
  }


  private getEvaluationsList(params) {
    this.showSpinner(this.spinner_name);
    this.dashService.geListDashboardEvaluations(this.currentUser.id, `qa_${params.type}`, params.primary_column, this.currentUser.crp.crp_id).subscribe(
      res => {
        // console.log(res)
        this.evaluationList = this.orderPipe.transform(res.data, 'id');
        this.collectionSize = this.evaluationList.length;
        this.returnedArray = this.evaluationList.slice(0, 10);
        this.hasTemplate = this.currentUser.config[0][`${params.type}_guideline`] ? true : false;
        this.hideSpinner(this.spinner_name);
      },
      error => {
        this.hideSpinner(this.spinner_name);
        this.returnedArray = []
        this.alertService.error(error);
      }
    )
  }

  private pageChanged(event: PageChangedEvent): void {
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


  private setOrder(value: string) {
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

  private goToView(indicatorId) {
    this.router.navigate(['./detail', indicatorId], { relativeTo: this.activeRoute });
  }

  private goToPDF(type: string) {
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

  private exportComments(item, all?) {
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

  private returnListName(indicator: string, type: string) {
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

  


  /***
   * 
   *  Spinner 
   * 
   ***/
  private showSpinner(name: string) {
    this.spinner.show(name);
  }

  private hideSpinner(name: string) {
    this.spinner.hide(name);
  }


}
