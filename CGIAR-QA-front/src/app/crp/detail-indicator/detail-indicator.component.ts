import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EvaluationsService } from "../../services/evaluations.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { User } from '../../_models/user.model';
import { DetailedStatus, GeneralIndicatorName, GeneralStatus } from "../../_models/general-status.model" 
import { crpMEL  } from "../../_models/crp.model" ;
import { Role } from 'src/app/_models/roles.model';
import { Title } from '@angular/platform-browser';
import { CommentService } from 'src/app/services/comment.service';
import { UrlTransformPipe } from 'src/app/pipes/url-transform.pipe';
import { WordCounterPipe } from 'src/app/pipes/word-counter.pipe';

import * as moment from 'moment';


@Component({
  selector: 'app-detail-indicator',
  templateUrl: './detail-indicator.component.html',
  styleUrls: ['./detail-indicator.component.scss'],
  providers: [UrlTransformPipe, WordCounterPipe]
})
export class DetailIndicatorComponent implements OnInit {


  currentUser: User;
  detailedData: any[];
  params: any;
  spinner1 = 'spinner1';
  spinner2 = 'spinner2';
  currentY = 0;
  gnralInfo = {
    status: "",
    response_status: "",
    evaluation_id: '',
    general_comment: '',
    general_comment_id: '',
    general_comment_user: '',
    general_comment_updatedAt: '',
    crp_id: ''
  };
  statusHandler = DetailedStatus;
  crpsMEL = crpMEL;
  generalCommentGroup: FormGroup;
  currentType = '';

  general_comment_reply;

  approveAllitems;

  @ViewChild("commentsElem", { static: false }) private commentsElem: ElementRef;
  @ViewChild("containerElement", { static: false }) private containerElement: ElementRef;


  activeCommentArr = [];
  fieldIndex: number;
  notApplicable = '';
  tickGroup: FormGroup;
  tooltips = {
    public_link: '',
    editable_link_marlo: 'Click here to access the item in MARLO',
    editable_link_mel: 'Click here to access the item in MEL',
    download_excel: 'Click here to download all comments in an excel file.',
    all_approved: 'Setting this option true, will approved all items without comments.'
  }

  criteriaData;
  criteria_loading = false;

  totalChar = 6500;


  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private urlTransfrom: UrlTransformPipe,
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private titleService: Title,
    private wordCount: WordCounterPipe,
    private authenticationService: AuthenticationService,
    private evaluationService: EvaluationsService) {

    this.activeRoute.params.subscribe(routeParams => {
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
      });
      this.generalCommentGroup = this.formBuilder.group({
        general_comment: ['', Validators.required]
      });
      this.params = routeParams;
      this.tooltips.public_link = `Click here to see more information about this  ${this.params.type}.`;
      this.notApplicable = this.authenticationService.NOT_APPLICABLE;

      this.currentType = GeneralIndicatorName[`qa_${this.params.type}`];
      this.showSpinner(this.spinner1)
      this.getDetailedData();
      this.getIndicatorCriteria(`qa_${this.params.type}`);


      /** set page title */
      this.titleService.setTitle(`${this.currentType} / QA-${this.params.type.charAt(0).toUpperCase()}${this.params.type.charAt(1).toUpperCase()}-${this.params.indicatorId}`);


    })
  }

  ngOnInit() {
    console.log(this.crpsMEL);
    
  }

  getDetailedData() {
    this.evaluationService.getDataEvaluation(this.currentUser.id, this.activeRoute.snapshot.params).subscribe(
      res => {
        this.detailedData = res.data.filter(field => {
          if (typeof field.value === 'number') field.value = String(field.value)
          field.value = this.urlTransfrom.transform(field.value);
          return field.value !== this.notApplicable;
        });;
        // this.generalCommentGroup.patchValue({ general_comment: this.detailedData[0].general_comment });
        this.gnralInfo = {
          evaluation_id: this.detailedData[0].evaluation_id,
          general_comment: this.detailedData[0].general_comment,
          crp_id: this.detailedData[0].evaluation_id,
          status: this.detailedData[0].status,
          response_status: this.detailedData[0].response_status,
          general_comment_id: this.detailedData[0].general_comment_id,
          general_comment_updatedAt: this.detailedData[0].general_comment_updatedAt,
          general_comment_user: this.detailedData[0].general_comment_user,
        }
        this.activeCommentArr = Array<boolean>(this.detailedData.length).fill(false);

        this.hideSpinner(this.spinner1);
        this.getCommentReplies();
        // console.log(res)
      },
      error => {
        console.log("getEvaluationsList", error);
        this.hideSpinner(this.spinner1);
        this.alertService.error(error);
      }
    )
  }

  getIndicatorCriteria(id) {
    this.criteria_loading = true;
    // console.log(id)
    this.evaluationService.getCriteriaByIndicator(id).subscribe(
      res => {
        // console.log(res.data)
        this.criteriaData = res.data[0];
        this.criteria_loading = false;
      },
      error => {
        console.log(error)
        this.criteria_loading = false;
        this.alertService.error(error);
      }
    )
  }


  getCommentsExcel(evaluation) {
    // console.log(evaluation)
    this.showSpinner('spinner1');
    let evaluationId = evaluation.evaluation_id;
    let title = this.detailedData.find(data => data.col_name === 'title');
    let filename = `QA-${this.params.type.charAt(0).toUpperCase()}${this.params.type.charAt(1).toUpperCase()}-${this.params.indicatorId}_${moment().format('YYYYMMDD_HHmm')}`;

    // let filename = `QA-${this.indicatorType.charAt(0).toUpperCase()}${this.indicatorType.charAt(1).toUpperCase()}${(item) ? '-' + item.id : ''}`
    // this.commentService.getCommentsExcel({ evaluationId: (item) ? item.evaluation_id : undefined, id: this.currentUser.id, name: filename, indicatorName: all ? `qa_${this.indicatorType}` : undefined, crp_id: all ? this.currentUser.crp.crp_id : undefined }).subscribe(


    this.commentService.getCommentsExcel({ evaluationId, id: this.currentUser.id, name: filename, indicatorName: `qa_${this.params.type}` }).subscribe(
      res => {
        // console.log(res)
        let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8" });
        saveAs(blob, filename);
        this.hideSpinner('spinner1');
      },
      error => {
        console.log("getCommentsExcel", error);
        this.hideSpinner('spinner1');
        this.alertService.error(error);
      }
    )
  }

  addGeneralComment(data) {
    if (this.formData.general_comment.invalid) {
      this.alertService.error('Reply to general comment can not be empty', false)
      return;
    }
    console.log(data)

    this.showSpinner('spinner1');
    this.commentService.createDataCommentReply({
      detail: this.formData.general_comment.value,
      userId: this.currentUser.id,
      commentId: parseInt(data.general_comment_id),
    }).subscribe(
      res => {
        // console.log(res)
        this.formData.general_comment.reset()
        this.hideSpinner('spinner1');
        this.getDetailedData();
      },
      error => {
        console.log("replyComment", error);
        this.hideSpinner('spinner1');
        this.alertService.error(error);
      }
    )
  }

  updateGeneralCommentReply(type, data) {
    // let canUpdate = this.validComment(type, data)
    // if (!canUpdate.is_valid) {
    //   this.alertService.error(canUpdate.message);
    //   return;
    // }
    data[type] = !data[type];
    this.showSpinner(this.spinner1);

    this.commentService.updateCommentReply(data).subscribe(
      res => {
        // console.log(res)
        this.getDetailedData();
      },
      error => {
        console.log("updateComment", error);
        this.hideSpinner(this.spinner1);

        this.alertService.error(error);
      }
    )

  }


  // convenience getter for easy access to form fields
  get formData() { return this.generalCommentGroup.controls; }

  showComments(index: number, field: any, e) {
    if (e) {
      let parentPos = this.getPosition(this.containerElement.nativeElement);
      let yPosition = e.clientY - parentPos.y - (this.commentsElem.nativeElement.clientHeight / 2);
      this.currentY = yPosition - 20
    }
    this.fieldIndex = index;
    field.clicked = !field.clicked;
    this.activeCommentArr[index] = !this.activeCommentArr[index];
    // this.getDetailedData();
  }

  updateNumCommnts(event, detailedData) {
    // console.log('updateNumCommnts', event, event[0].replies.replies_count)
    //  event[0].replies.replies_count;
    detailedData.replies_count = event.length;
    let repls_count = 0
    event.forEach(element => {
      repls_count += parseInt(element.replies.replies_count)
    });
    detailedData.comments_replies_count = repls_count
  }

  updateEvaluation(type: string, data: any) {
    let evaluationData = {
      evaluation_id: data[0].evaluation_id,
      // general_comments: data[0].general_comments,
      status: data[0].status,
    };

    switch (type) {
      case "status":
        evaluationData['status'] = this.gnralInfo.status;
        break;

      default:
        break;
    }

    this.evaluationService.updateDataEvaluation(evaluationData, evaluationData.evaluation_id).subscribe(
      res => {
        // //console.log(res)
        this.alertService.success(res.message);
        this.showSpinner('spinner1')
        this.getDetailedData();
      },
      error => {
        //console.log("updateEvaluation", error);
        this.hideSpinner('spinner1');
        this.alertService.error(error);
      }
    )

  }

  validateCommentAvility(field, is_embed) {
    // console.log(this.gnralInfo)

    let userRole = this.currentUser.roles[0].description, avility = false;
    // if (this.gnralInfo.status === DetailedStatus.Pending) return false;
    switch (userRole) {
      case Role.admin:
        avility = true
        break;
      case Role.crp:
        avility = field.enable_crp == 1 ? (field.enable_comments) : field.enable_crp
        // avility = field.enable_crp == 1 ? (this.gnralInfo.status !== this.statusHandler.Complete && field.enable_comments) : field.enable_crp
        break;
      default:
        break;
    }
    return avility;

  }

  getCommentReplies() {
    // this.showSpinner('spinner1');
    // let params = { commentId: comment.id, evaluationId: this.gnralInfo.evaluation_id }
    let params = { commentId: this.gnralInfo.general_comment_id, evaluationId: this.gnralInfo.evaluation_id }
    this.commentService.getDataCommentReply(params).subscribe(
      res => {
        this.hideSpinner('spinner1');
        // console.log(res)
        // comment.loaded_replies = res.data;
        this.general_comment_reply = res.data;
      },
      error => {
        console.log("getCommentReplies", error);
        // this.hideSpinner('spinner1');
        if (error !== 'OK')
          this.alertService.error(error);
      }
    )
  }

  getWordCount(value: string) {
    return this.wordCount.transform(value);
  }

  getPosition(el) {
    let xPos = 0;
    let yPos = 0;
    while (el) {
      // console.log(el.tagName, el.offsetTop - el.scrollTop + el.clientTop, el.offsetTop, el.scrollTop, el.clientTop)
      if (el.tagName == "BODY") {
        // deal with browser quirks with body/window/document and page scroll
        let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
        let yScroll = el.scrollTop || document.documentElement.scrollTop;

        xPos += (el.offsetLeft - xScroll + el.clientLeft);
        yPos += (el.offsetTop - yScroll + el.clientTop);
      } else {
        // for all other non-BODY elements
        xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      }

      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos
    };
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
