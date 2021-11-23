import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';

import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';
import { GeneralStatus, GeneralIndicatorName, TagMessage } from "../../_models/general-status.model"
import { Title } from '@angular/platform-browser';
import { CommentService } from 'src/app/services/comment.service';
import { IndicatorsService } from 'src/app/services/indicators.service';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-assessor-dashboard',
  templateUrl: './assessor-dashboard.component.html',
  styleUrls: ['./assessor-dashboard.component.scss']
})
export class AssessorDashboardComponent implements OnInit {

  modalRef: BsModalRef;
  currentUser: User;
  dashboardData: any[];
  dashboardCommentsData: any[];
  generalStatus = GeneralStatus;
  indicatorsName = GeneralIndicatorName;
  tagMessages = TagMessage;
  indicatorsTags: any;
  selectedIndicator = 'qa_slo';
  dataSelected: any;
  indicatorData: any;
  feedList: [];
  itemStatusByIndicator = {};
  indicator_status: string = 'indicators_status';

  descriptionCharts = {
    generalStatus: "This shows the progress of assessment of a specific indicator. ",
    assessorsInteractions: "This presents assessors' interactions with existing comments on an item being already evaluated by other assessors. ",
    responseToComments: "This shows the status of CRP responses to comments made by assessors during the first round.",
    assessmentByField: "This shows the status of assessment for each field of an item.",
  }

  dataCharts = {
    generalStatus: null,
    assessorsInteractions: null,
    responseToComments: null,
    assessmentByField: null
  }
  totalPendings = {
    qa_policies: 0,
    qa_innovations: 0,
    qa_publications: 0,
    qa_oicr: 0,
    qa_melia: 0,
    qa_capdev: 0,
    qa_milestones: 0,
    qa_slo: 0
  }


  indicatorsNameDropdwon = [
    { name: 'SLOs', viewname: 'qa_slo' },
    { name: 'Policies', viewname: 'qa_policies' },
    { name: 'OICRs', viewname: 'qa_oicr' },
    { name: 'Innovations', viewname: 'qa_innovations' },
    { name: 'Milestones', viewname: 'qa_milestones' },
    { name: 'Peer Reviewed Papers', viewname: 'qa_publications' },
    { name: 'CapDevs', viewname: 'qa_capdev' },
    { name: 'MELIAs', viewname: 'qa_melia' },
    // qa_outcomes: 'Outcomes',
  ]

  constructor(private dashService: DashboardService,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
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
    this.usersService.getUserById(this.currentUser.id).subscribe(res => {
      // console.log(res.data.indicators);
      this.authenticationService.parseUpdateIndicators(res.data.indicators);
    })
    this.showSpinner()
    console.log({ currentUser: this.currentUser });

    this.loadDashData();

  }

  loadDashData() {
    let responses = forkJoin([
      this.getDashData(),
      this.getCommentStats(),
      this.getAllTags(),
      // this.getFeedTags(this.selectedIndicator),
      this.getItemStatusByIndicatorService(this.selectedIndicator)
      // this.getAllItemStatusByIndicator()
    ]);
    responses.subscribe(
      res => {
        const [dashData, 
          commentsStats,
          allTags,
          // feedTags,
          assessmentByField
        ] = res;

        //dashData
        if(dashData.data) {
          console.log({dashData});
          
          this.dashboardData = this.dashService.groupData(dashData.data);
          console.log(this.dashboardData);
          // this.selectedIndicator = Object.keys(this.dashboardData)[0]
          this.dataSelected = this.dashboardData[this.selectedIndicator];
        }

        //commentsStats
        if(commentsStats) {
          this.dashboardCommentsData = this.dashService.groupData(commentsStats.data);
          console.log('COUNT COMMENTS',this.dashboardCommentsData);
        }
        

        //allTags
        if(allTags)
        this.indicatorsTags = this.commentService.groupTags(allTags.data);;

        //feedTags
        // if(feedTags)
        // this.feedList = feedTags.data;

        //assessmentByField
        if(assessmentByField)
        this.itemStatusByIndicator = assessmentByField.data;
        console.log(this.itemStatusByIndicator);
        

        //UPDATE CHARTS
        if(dashData.data && commentsStats.data && allTags.data)
        this.updateDataCharts();

        this.hideSpinner();
      }
    );

  }



  getItemStatusByIndicator(indicator: string) {
    if (this.itemStatusByIndicator.hasOwnProperty(indicator)) {
      return this.itemStatusByIndicator[indicator];
    } else {
      return false;
    }
  }

  getIndicatorName(indicator: string) {
    return this.indicatorsName[indicator]
  }

  actualIndicator(indicator: string) {
    this.selectedIndicator = indicator;
    this.dataSelected = this.dashboardData[this.selectedIndicator];

    this.showSpinner();

    let responses = forkJoin([
      // this.getFeedTags(this.selectedIndicator),
      this.getItemStatusByIndicatorService(this.selectedIndicator)
    ]);
    responses.subscribe(
      res => {
        const [
          // feedTags,
           assessmentByField
          ] = res;
        //feedTags
        // this.feedList = feedTags.data;

        //assessmentByField
        this.itemStatusByIndicator = assessmentByField.data;

        //UPDATE CHARTS
        this.updateDataCharts();

        this.hideSpinner();
      }
    );
  }

  actualStatusIndicator(data) {
    let indicator_status = false;
    // console.log(data);
    let i = 0;
    if (data) {
      for (const item of data) {
        if (item.indicator_status == 1) indicator_status = true;
        i++;
        // console.log(i);
        // console.log('INDICATOR STATUS',indicator_status);

      }
    }
    return indicator_status;
  }

  goToView(view: string, primary_column: string) {
    this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]);
  }

  //Observables
  getDashData(): Observable<any> {
    // this.showSpinner();
    return this.dashService.getDashboardEvaluations(this.currentUser.id).pipe();
  }

  // comments by crp
  getCommentStats(crp_id?): Observable<any> {
    return this.commentService.getCommentCRPStats({ crp_id, id: null }).pipe();
  }

  //Assessment by field
  getAllItemStatusByIndicator(): Observable<any> {
    return this.indicatorService.getAllItemStatusByIndicator().pipe();
  }

  //Assessment by field and by indicator
  getItemStatusByIndicatorService(indicator: string): Observable<any> {
    return this.indicatorService.getItemStatusByIndicator(indicator).pipe();
  }

  //Comments tags
  getAllTags(crp_id?): Observable<any> {
    return this.commentService.getAllTags(crp_id).pipe();
  }

  //Feed Tags
  getFeedTags(indicator_view_name, tagTypeId?): Observable<any> {
    return this.commentService.getFeedTags(indicator_view_name, tagTypeId).pipe();
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
   * formats
   * 
   */

  formatDate(date: any) {
    let formatDate = moment(date).format("dddd, MMMM Do YYYY, HH:mm");;
    return formatDate;
  }

  formatStatusIndicatorData(data) {
    // DEFINE COLORS WITH CSS
    const colors = {
      complete: 'var(--color-complete)',
      pending: 'var(--color-pending)',
      finalized: 'var(--color-complete)',
      autochecked: 'var(--color-autochecked)'
    }
    let dataset = [];
    let brushes = { domain: [] };
    for (const item of data) {
      if (item.status != null) {
        dataset.push({ name: item.status, value: +item.label });
        brushes.domain.push(colors[item.status]);
      }
    }
    let complete = dataset.find(item => item.name == 'complete');
    if (complete) complete.name = 'Assessed 1st round';
    let finalized = dataset.find(item => item.name == 'finalized');
    if (finalized) finalized.name = 'Quality Assessed';
    
    let autochecked = dataset.find(item => item.name == 'autochecked');
    if (autochecked) {
      this.indicator_status = 'publications_status';
      autochecked.name = 'Automatically validated';
    } else {
      this.indicator_status = 'indicator_status';
    }
    // console.log('DATA SELECTED', { dataset, brushes });

    return { dataset, brushes };
  }


  formatCommentsIndicatorData(data, indicator?) {
    const colors = {
      Accepted: 'var(--color-agree)',
      AcceptedWC: 'var(--color-agree-wc)',
      Clarification: 'var(--color-clarification)',
      Disagree: 'var(--color-disagree)',
      Pending: 'var(--color-pending)'
    }
    let dataset = [];
    let brushes = { domain: [] };

    if (data) {
      let comments_accepted_with_comment = data.find(item => item.comments_accepted_with_comment != '0');
      comments_accepted_with_comment = comments_accepted_with_comment ? { name: 'AcceptedWC', value: +comments_accepted_with_comment.value } : null;
      if (comments_accepted_with_comment) dataset.push(comments_accepted_with_comment);

      let comments_accepted_without_comment = data.find(item => item.comments_accepted_without_comment != '0');
      comments_accepted_without_comment = comments_accepted_without_comment ? { name: 'Accepted', value: +comments_accepted_without_comment.value } : null;
      if (comments_accepted_without_comment) dataset.push(comments_accepted_without_comment);

      let comments_rejected = data.find(item => item.comments_rejected != '0');
      comments_rejected = comments_rejected ? { name: 'Disagree', value: +comments_rejected.value } : null;
      if (comments_rejected) dataset.push(comments_rejected);

      let comments_clarification = data.find(item => item.comments_clarification != '0');
      comments_clarification = comments_clarification ? { name: 'Clarification', value: +comments_clarification.value } : null;
      if (comments_clarification) dataset.push(comments_clarification);

      let comments_without_answer = data.find(item => item.comments_without_answer != '0');
      comments_without_answer = comments_without_answer ? { name: 'Pending', value: +comments_without_answer.value } : null;
      if (comments_without_answer) {
        dataset.push(comments_without_answer);
        this.totalPendings[indicator] = +comments_without_answer.value;
      }

      dataset.forEach(comment => {
        brushes.domain.push(colors[comment.name]);
      });
    }

    return { dataset, brushes };
  }

  formatIndicatorTags() {

    const tags = this.indicatorsTags[this.selectedIndicator];

    const colors = {
      agree: 'var(--color-agree)',
      disagree: 'var(--color-disagree)',
      notsure: 'var(--color-not-sure)'
    }
    let dataset = [];
    let brushes = { domain: [] };
    for (const tag in tags) {
      dataset.push({ name: tag, value: tags[tag] })
    }
    dataset.forEach(tag => {
      brushes.domain.push(colors[tag.name]);
    });
    console.log({ dataset, brushes });


    return { dataset, brushes };

  }

  updateDataCharts() {
    this.dataCharts.generalStatus = this.formatStatusIndicatorData(this.dataSelected);
    this.dataCharts.assessorsInteractions = this.formatIndicatorTags();
    this.dataCharts.responseToComments = this.formatCommentsIndicatorData(this.dashboardCommentsData[this.selectedIndicator]);
    this.dataCharts.assessmentByField = this.itemStatusByIndicator;
  }

  updateFeedTags(tagTypeId) {
    this.getFeedTags(this.selectedIndicator, tagTypeId).subscribe(
      res => {
        this.feedList = res.data;
        this.hideSpinner();
      }
    )
  }

  goToPDF(type: string) {
    let pdf_url;
    switch (type) {
      case 'AR':
        pdf_url = this.currentUser.config[0]["anual_report_guideline"];
        break;
      case 'ASSESSORS_GUIDANCE':
        pdf_url = this.currentUser.config[0][`assessors_guideline`];
        break;
      default:
        
        break;
    }
    window.open(pdf_url, "_blank");
  }
  openChart(template: TemplateRef<any>, e) {
    this.modalRef = this.modalService.show(template, {class: 'modal-xl'});
  }


}