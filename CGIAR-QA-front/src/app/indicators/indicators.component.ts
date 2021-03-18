import {  Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { OrderPipe } from 'ngx-order-pipe';

import { DashboardService } from "../services/dashboard.service";
import { AuthenticationService } from "../services/authentication.service";
import { CommentService } from "../services/comment.service";
import { AlertService } from '../services/alert.service';

import { User } from '../_models/user.model';
import { GeneralIndicatorName } from '../_models/general-status.model';
import { saveAs } from "file-saver";
import { Title } from '@angular/platform-browser';
import { SortByPipe } from '../pipes/sort-by.pipe';

import * as moment from 'moment';
import { FormBuilder } from '@angular/forms';
import { IndicatorsService } from '../services/indicators.service';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss'],
  providers: [SortByPipe]
})
export class IndicatorsComponent implements OnInit {
  indicatorType: string;
  indicatorTypeName: string;
  evaluationList: any[];
  returnedArray: any[];
  returnedArrayHasStage: boolean;
  currentUser: User;

  currentPage = {
    startItem: 0,
    endItem: 10
  }
  stageHeaderText = {
    policies: 'Level',
    oicr: 'Maturity Level',
    innovations: 'Stage',
    melia: 'Type',
    publications: 'ISI',
    milestones: 'Milestone Status',
  }

  maxSize = 5;
  pageSize = 4;
  collectionSize = 0;
  searchText;
  evalStatusFilter = '';
  // uncheckableRadioModel = '';

  hasTemplate = false;

  notProviedText = '<No provided>'

  order: string = 'id';
  configTemplate: string;
  reverse: boolean = false;
  btonFilterForm: any;
  chatRooms = null;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private dashService: DashboardService,
    private authenticationService: AuthenticationService,
    private commentService: CommentService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, 
    private orderPipe: SortByPipe,
    private indicatorService: IndicatorsService,
    private sanitizer: DomSanitizer,
    // private orderPipe: OrderPipe,
    private titleService: Title,
    private alertService: AlertService) {
    this.activeRoute.params.subscribe(routeParams => {
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
        console.log(this.currentUser);

        
      });
      this.indicatorType = routeParams.type;
      this.configTemplate = this.currentUser.config[`${this.indicatorType}_guideline`]
      this.indicatorTypeName = GeneralIndicatorName[`qa_${this.indicatorType}`];
      this.getEvaluationsList(routeParams);

      
      this.btonFilterForm = this.formBuilder.group({
        radio: 'A'
      });
      /** set page title */
      this.titleService.setTitle(`List of ${this.indicatorTypeName}`);
    });
    
  }



  ngOnInit() {
    
    // console.log('loaded indicators')
    setTimeout(()=>{                           //<<<---using ()=> syntax
      this.verifyIfOrderByStatus();
 }, 2000);
 this.chatRooms = {
  policies: this.sanitizer.bypassSecurityTrustResourceUrl(`https://deadsimplechat.com/am16H1Vlj?username=${this.currentUser.name}`), 
  innovations: this.sanitizer.bypassSecurityTrustResourceUrl(`https://deadsimplechat.com/JGdqSO6ko?username=${this.currentUser.name}`)
}
  }



  getEvaluationsList(params) {
    this.showSpinner();
    this.dashService.geListDashboardEvaluations(this.currentUser.id, `qa_${params.type}`, params.primary_column).subscribe(
      res => {
        // console.log(res)
        this.evaluationList = this.orderPipe.transform(res.data, 'id');
        console.log('LISTA',this.evaluationList);
        
        this.collectionSize = this.evaluationList.length;
        this.returnedArray = this.evaluationList.slice(0, 10);
        this.returnedArrayHasStage = this.returnedArray.find(e => e.stage != null)
        // console.log('RETURNED_ARRAY', this.returnedArray);
        
        this.hasTemplate = this.currentUser.config[0][`${params.type}_guideline`] ? true : false;
        this.hideSpinner();
        console.log('Spinner hided');
        
      },
      error => {
        this.hideSpinner();
        this.returnedArray = []
        console.log(error)
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


  setOrder(value: string, reverseValue?: boolean) {
    if (value == null) {
      this.reverse = !this.reverse;
    } else if(value != null && reverseValue != null){
      this.order = value;
      this.reverse = reverseValue;
    } else {
      if (this.order === value) {
        this.reverse = !this.reverse;
      }
      this.order = value;
    }
    console.log(this.order, this.reverse);
    
    // console.log(this.evaluationList, (this.reverse) ? 'asc':'desc', this.order)
    this.evaluationList = this.orderPipe.transform(this.evaluationList, (this.reverse) ? 'asc' : 'desc', this.order);
    // this.returnedArray = this.evaluationList.slice(this.currentPage.startItem, this.currentPage.endItem);
  }

  filterByEvalStatus() {
    this.evalStatusFilter = 'Removed'
  }


  goToView(indicatorId) {

    this.router.navigate(['./detail', indicatorId], { relativeTo: this.activeRoute });
    // this.router.navigate(['/reload']).then(() => { this.router.navigate(['./detail', indicatorId], { relativeTo: this.activeRoute }) });
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


  exportComments(item) {
    this.showSpinner();
    let filename = `QA-${this.indicatorType.charAt(0).toUpperCase()}${this.indicatorType.charAt(1).toUpperCase()}-${item.id}_${moment().format('YYYYMMDD_HHmm')}`
    if(this.authenticationService.getBrowser() === 'Safari')
      filename += `.xlsx`
    // console.log('filename',filename)
    this.commentService.getCommentsExcel({ evaluationId: item.evaluation_id, id: this.currentUser.id, name: filename, indicatorName: `qa_${this.indicatorType}` }).subscribe(
      res => {
        // console.log(res)
        let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8" });
        saveAs(blob, filename);
        this.hideSpinner();
      },
      error => {
        // console.log("exportComments", error);
        this.hideSpinner();
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
    if(this.indicatorService.getOrderByStatus() != null) {
      this.setOrder('status', this.indicatorService.getOrderByStatus() )
    }
  }

  /***
   * 
   *  Spinner 
   * 
   ***/
  showSpinner() {
    this.spinner.show(undefined,
      {
        fullScreen: true,
        type: "ball-clip-rotate-multiple"
      }
    );
  }
  hideSpinner() {
    this.spinner.hide();
  }


}
