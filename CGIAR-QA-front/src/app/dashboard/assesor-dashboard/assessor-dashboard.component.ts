import { Component, OnInit } from '@angular/core';
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
  tagMessages = TagMessage;
  indicatorsTags: any;
  selectedIndicator = 'qa_slo';
  dataSelected: any;
  indicatorData: any;
  feedList: [];
  itemStatusByIndicator = {};

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
      // console.log(res.data.indicators);
      this.authenticationService.parseUpdateIndicators(res.data.indicators);
    })
    this.getCommentStats();

  }

  getAllItemStatusByIndicator() {
    this.currentUser.indicators.forEach(el => {
      this.indicatorService.getItemStatusByIndicator(el.indicator.view_name).subscribe(
         (res) => {
          this.itemStatusByIndicator[el.indicator.view_name] = this.indicatorService.formatItemStatusByIndicator(res.data);
          console.log(el.indicator.view_name,this.itemStatusByIndicator[el.indicator.view_name]);
          
        },
        error => {
          console.log("getAllItemStatusByIndicator", error);
          this.hideSpinner();
          this.alertService.error(error);
        }
      );
    });
    this.hideSpinner();
  }

  getItemStatusByIndicator(indicator: string) {
    if(this.itemStatusByIndicator.hasOwnProperty(indicator)){
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
    // console.log(this.selectedIndicator, this.dashboardData[this.selectedIndicator]); 
  }

  actualStatusIndicator(data) {
    let indicator_status = false;
    // console.log(data);
    let i = 0;
    if(data) {
      for (const item of data) {
        if (item.indicator_status == 1) indicator_status = true;
        i++;
        // console.log(i);
        
      }
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
        // console.log(res)
        this.dashboardData = this.dashService.groupData(res.data);
        // this.getCommentStats();
        console.log('DASH DATA',this.dashboardData);
        this.selectedIndicator = Object.keys(this.dashboardData)[1];
        this.dataSelected = this.dashboardData[this.selectedIndicator];
        console.log('DATA SELECTED', this.dataSelected);
        
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
          // console.log(this.dashboardCommentsData);
          this.formatCommentsIndicatorData(this.dashboardCommentsData[this.selectedIndicator]);
          //getDashData depends on getCommentStats
          this.getDashData();
          this.getAllTags();
          this.getFeedTags();
          this.getAllItemStatusByIndicator();

          // this.hideSpinner();
        },
        error => {
          this.hideSpinner()
          // console.log("getCommentStats", error);
          this.alertService.error(error);
        },
      )
  }

  getAllTags() {
    this.commentService.getAllTags().subscribe(
      res => {
        this.indicatorsTags = this.commentService.groupTags(res.data);;
      }
    )
  }

  getFeedTags() {
    this.commentService.getFeedTags().subscribe(
      res => {
        // console.log(res.data);
        this.feedList = res.data;
      }
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

  /**
   * formats
   * 
   */

  formatDate(date: any) {
    let formatDate = moment(date).format("dddd, MMMM Do YYYY, HH:mm");;
    return formatDate;
  }

  formatStatusIndicatorData(data) {
    const colors = {
      complete: '#59ed9c',
      pending: '#f3da90',
      finalized: '#00958e'
    }
    let dataset = [];
    let brushes = { domain: [] };
    for (const item of data) {
      if(item.status != null) {
        dataset.push({ name: item.status, value: +item.label });
        brushes.domain.push(colors[item.status]);
      }
    }
    let finalized = dataset.find(item => item.name == 'finalized');
    if(finalized) finalized.name = 'closed';
    console.log('DATA SELECTED', { dataset, brushes });
    
    return { dataset, brushes };
  }

  formatCommentsIndicatorData(data) {
    const colors = {
      Approved: '#59ed9c',
      Pending: '#f3da90',
      Rejected: '#ed8b84'
    }
    let dataset = [];
    let brushes = { domain: [] };
    
    if(data) {
      let comments_approved = data.find(item => item.comments_approved != '0');
      comments_approved = comments_approved ? { name: 'Approved', value: +comments_approved.value } : null;
      if (comments_approved) dataset.push(comments_approved);
  
      let comments_rejected = data.find(item => item.comments_rejected != '0');
      comments_rejected = comments_rejected ? { name: 'Rejected', value: +comments_rejected.value } : null;
      if (comments_rejected) dataset.push(comments_rejected);
  
  
      let comments_without_answer = data.find(item => item.comments_without_answer != '0');
      comments_without_answer = comments_without_answer ? { name: 'Pending', value: +comments_without_answer.value } : null;
      if (comments_without_answer) dataset.push(comments_without_answer);
  
      dataset.forEach(comment => {
        brushes.domain.push(colors[comment.name]);
      });
    }


    return { dataset, brushes };
  }


}
