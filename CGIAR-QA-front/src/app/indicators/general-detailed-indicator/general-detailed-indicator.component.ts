import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';

import { EvaluationsService } from "../../services/evaluations.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';


import { User } from '../../_models/user.model';
import { DetailedStatus, GeneralIndicatorName, GeneralStatus } from "../../_models/general-status.model"
import { Role } from "../../_models/roles.model"
import { CommentService } from 'src/app/services/comment.service';

import { saveAs } from "file-saver";
import { UrlTransformPipe } from 'src/app/pipes/url-transform.pipe';
import { Title } from '@angular/platform-browser';
import { WordCounterPipe } from 'src/app/pipes/word-counter.pipe';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';


import * as moment from 'moment';

@Component({
  selector: 'app-general-detailed-indicator',
  templateUrl: './general-detailed-indicator.component.html',
  styleUrls: ['./general-detailed-indicator.component.scss'],
  providers: [UrlTransformPipe, WordCounterPipe]
})
export class GeneralDetailedIndicatorComponent implements OnInit {
  indicatorType: string;
  currentUser: User;
  detailedData: any[];
  params: any;
  spinner1 = 'spinner1';
  spinner2 = 'spinner2';
  currentY = 0;
  gnralInfo = {
    status: "",
    evaluation_id: '',
    evaluation_status: '',
    general_comment: '',
    general_comment_user: '',
    general_comment_updatedAt: '',
    general_comment_id: '',
    status_update: null,
    crp_id: ''
  };
  statusHandler = DetailedStatus;
  generalCommentGroup: FormGroup;
  currentType = '';

  approveAllitems;
  general_comment_reply;
  assessorsChat = {
    isOpen: false
  }
  chatRooms = null;
  assessed_by = null;
  currentUserHasAssessed = false;
  @ViewChild("commentsElem", { static: false }) commentsElem: ElementRef;
  @ViewChild("containerElement", { static: false }) containerElement: ElementRef;

  totalChar = 6500;

  activeCommentArr = [];
  fieldIndex: number;
  notApplicable = '';
  tickGroup: FormGroup;
  tooltips = {
    public_link: '',
    download_excel: 'Click here to download all comments in an excel file.',
    all_approved: 'Setting this option true, will approved all items without comments.'
  }

  criteriaData;
  criteria_loading = false;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private urlTransfrom: UrlTransformPipe,
    private alertService: AlertService,
    private commentService: CommentService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private wordCount: WordCounterPipe,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private evaluationService: EvaluationsService,
    private sanitizer: DomSanitizer,
    ) {
    this.activeRoute.params.subscribe(routeParams => {
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
        console.log(this.currentUser);
        
      });
      this.indicatorType = routeParams.type;

      //console.log("general detailed")
      this.generalCommentGroup = this.formBuilder.group({
        general_comment: ['', Validators.required]
      });
      this.tickGroup = this.formBuilder.group({
        selectAll: [''],
        tick: this.formBuilder.array([], Validators.required)
      });



      this.params = routeParams;
      this.currentType = GeneralIndicatorName[`qa_${this.params.type}`];
      this.tooltips.public_link = `Click here to see more information about this  ${this.params.type}.`
      this.showSpinner('spinner1')
      this.notApplicable = this.authenticationService.NOT_APPLICABLE;
      this.getDetailedData();
      this.getIndicatorCriteria(`qa_${this.params.type}`);

      /** set page title */
      this.titleService.setTitle(`${this.currentType} / QA-${this.params.type.charAt(0).toUpperCase()}${this.params.type.charAt(1).toUpperCase()}-${this.params.indicatorId}`);


    })
  }

  ngOnInit() {
    this.chatRooms = {
      general: this.sanitizer.bypassSecurityTrustResourceUrl(`https://deadsimplechat.com/am16H1Vlj?username=${this.currentUser.name}`),
    }
  }

  // convenience getter for easy access to form fields
  get formData() { return this.generalCommentGroup.controls; }
  get formTickData() { return this.tickGroup.get('tick') as FormArray; }

  addCheckboxes() {
    this.tickGroup = this.formBuilder.group({
      selectAll: [''],
      tick: this.formBuilder.array([], Validators.required)
    });
    this.detailedData.map(x => {
      this.formTickData.controls.push(
        this.formBuilder.group({
          data: x,
          isChecked: x.approved_no_comment ? true : false
        })
      )
    });

  }

  validateComments() {
    let response;
    for (let index = 0; index < this.detailedData.length; index++) {
      const element = this.detailedData[index];
      response = parseInt(element.replies_count) > 0 || this.formTickData.controls[index].value.isChecked;
      if (!response) return !response
    }
    return !response;
  }

  validateUpdateEvaluation() {
    let checked_row = this.detailedData.filter((data, i) => (this.formTickData.controls[i].value.isChecked) ? data : undefined).map(d => d.field_id)
    let commented_row = this.detailedData.filter(data => data.replies_count != '0').map(d => d.field_id);
    let availableData = this.detailedData.filter(data => data.enable_comments)
    // console.log('update Eval',  commented_row, checked_row,  availableData.length, this.statusHandler, this.gnralInfo, this.currentUser)
    if (this.gnralInfo.status !== this.statusHandler.Pending && this.gnralInfo.status !== this.statusHandler.Finalized && this.currentUser.hasOwnProperty('cycle')) {
    // if (this.gnralInfo.status !== this.statusHandler.Complete) {
      if ((checked_row.length + commented_row.length) == availableData.length) {
        this.gnralInfo.status_update = this.statusHandler.Complete;
        this.updateEvaluation('status', this.detailedData)
      } else if (this.gnralInfo.status == this.statusHandler.Complete) {
        this.gnralInfo.status_update = this.statusHandler.Pending;
        this.updateEvaluation('status', this.detailedData)
      }

    }
  }


  onTickChange(e, field) {
    if (field) {
      let noComment = (e.target.checked) ? true : false;
      field.loading = true
      console.log(field.evaluation_id);
      

      this.commentService.toggleApprovedNoComments({ meta_array: [field.field_id], isAll: false, userId: this.currentUser.id, noComment }, field.evaluation_id).subscribe(
        res => {
          // console.log(res);
          field.loading = false
          // this.validateUpdateEvaluation();
          this.validateAllFieldsAssessed()
        },
        error => {
          this.alertService.error(error);
          field.loading = false
        }
      )
    }

  }

  onChangeSelectAll(e) {

    let selected_meta = [];
    let noComment;
    if (e) {
      this.formTickData.controls.map((value, i) => (this.detailedData[i].replies_count == '0') ? value.get('isChecked').setValue(true) : value.get('isChecked'));
      selected_meta = this.detailedData.filter((data, i) => (this.formTickData.controls[i].value.isChecked) ? data : undefined).map(d => d.field_id)
      noComment = true;
      this.gnralInfo.status_update = this.statusHandler.Complete;
    } else {
      this.formTickData.controls.map(value => value.get('isChecked').setValue(false));
      selected_meta = this.detailedData.filter((data, i) => (!this.formTickData.controls[i].value.isChecked) ? data : undefined).map(d => d.field_id)
      noComment = false;
      this.gnralInfo.status_update = this.statusHandler.Pending;
    }
    // console.log(e, selected_meta, this.gnralInfo.status)
    this.showSpinner('spinner1');
    this.commentService.toggleApprovedNoComments({ meta_array: selected_meta, userId: this.currentUser.id, isAll: true, noComment }, this.gnralInfo.evaluation_id).subscribe(
      res => {
        this.updateEvaluation('status', this.detailedData);
        this.approveAllitems = !e;
      },
      error => {
        this.alertService.error(error);
        this.hideSpinner('spinner1');
      }
    )

    // console.log(selected_meta)
  }

  validateAllFieldsAssessed() {
    console.log('VALIDATING AFTER COMMENT');
    
    let initialStatus = this.gnralInfo.status;
    let allFieldsAssessed: boolean = false;
    let statusByField = [];
    this.formTickData.controls.forEach((value, i) => {
      console.log(this.detailedData[i]);
      
      
      statusByField.push({display_name: this.detailedData[i].display_name, value:  (this.detailedData[i].replies_count != '0' || value.get('isChecked').value || this.detailedData[i].enable_comments == false) ? true : false});
    });
    let fieldWithoutAssessed = statusByField.find(e => e.value == false);
    // existNotAssessed = existNotAssessed.value;
    
    if(fieldWithoutAssessed == undefined) {
      allFieldsAssessed = true;
      this.gnralInfo.status_update = this.statusHandler.Complete;
      this.updateEvaluation('status', this.detailedData)
    } else {
      allFieldsAssessed = false;
      this.gnralInfo.status_update = this.statusHandler.Pending;
      if(initialStatus != this.statusHandler.Pending) {
        console.log({initialStatus}, this.statusHandler.Pending);
        
        this.updateEvaluation('status', this.detailedData)
      }
    }
    console.log(this.detailedData);
    
    console.log({fieldWithoutAssessed,statusByField,allFieldsAssessed});
    
  }

  getDetailedData() {
    console.log(this.currentUser.id, this.params);
    
    this.evaluationService.getDataEvaluation(this.currentUser.id, this.params).subscribe(
      res => {
        console.log('detaileedData',res)
        this.detailedData = res.data.filter(field => {
          if (typeof field.value === 'number') field.value = String(field.value)
          field.value = this.urlTransfrom.transform(field.value);
          return field.value !== this.notApplicable;
        });
        this.generalCommentGroup.patchValue({ general_comment: this.detailedData[0].general_comment });
        this.gnralInfo = {
          evaluation_id: this.detailedData[0].evaluation_id,
          general_comment: this.detailedData[0].general_comment,
          crp_id: this.detailedData[0].evaluation_id,
          evaluation_status: this.detailedData[0].evaluation_status,
          status: this.detailedData[0].status,
          general_comment_id: this.detailedData[0].general_comment_id,
          status_update: null,
          general_comment_updatedAt: this.detailedData[0].general_comment_updatedAt,
          general_comment_user: this.detailedData[0].general_comment_user,
        }
        this.approveAllitems = (this.gnralInfo.status === this.statusHandler.Complete) ? false : true;
        this.activeCommentArr = Array<boolean>(this.detailedData.length).fill(false);
        this.evaluationService.getAssessorsByEvaluation(this.gnralInfo.evaluation_id).subscribe(
          res => {
            console.log(res.data[0].comment_by);
            this.assessed_by = res.data[0].comment_by;
            if(this.assessed_by) {
              this.currentUserHasAssessed = this.assessed_by.indexOf(this.currentUser.username) >= 0 ? true : false;
            }
            
          }, error => {
            console.log("getAssessorsByEvaluation", error);
            this.hideSpinner('spinner1');
            this.alertService.error(error);
          }
        )
        this.hideSpinner('spinner1');
        this.tickGroup.reset();
        this.getCommentReplies();
        this.addCheckboxes();
      },
      error => {
        console.log("getEvaluationsList", error);
        this.hideSpinner('spinner1');
        this.alertService.error(error);
      }
    )
    
  }

  getCommentsExcel(evaluation) {
    // console.log(evaluation)
    this.showSpinner('spinner1');
    let evaluationId = evaluation.evaluation_id;
    let title = this.detailedData.find(data => data.col_name === 'title');
    let filename = `QA-${this.params.type.charAt(0).toUpperCase()}${this.params.type.charAt(1).toUpperCase()}-${this.params.indicatorId}_${moment().format('YYYYMMDD_HHmm')}`

    this.commentService.getCommentsExcel({ evaluationId, id: this.currentUser.id, name: title.display_name, indicatorName: `qa_${this.params.type}` }).subscribe(
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

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  goToList() {
    console.log(this.params)
  }

  getLink(field) {
    return (field.col_name === 'evidence_link') ? true : false;
  }

  getIndicatorCriteria(id) {
    this.criteria_loading = true;
    this.evaluationService.getCriteriaByIndicator(id).subscribe(
      res => {
        this.criteriaData = res.data[0];
        console.log("CRITERIA DATA",this.criteriaData);
        console.log("CRITERIA DATA",res.message);
        
        this.criteria_loading = false;
      },
      error => {
        this.criteria_loading = false;
        this.alertService.error(error);
      }
    )
  }


  /**
   * 
   * 
   * 
   */

  getWordCount(value: string) {
    return this.wordCount.transform(value);
  }



  showComments(index: number, field: any, e?) {
    if (e) {
      let parentPos = this.getPosition(this.containerElement.nativeElement);
      let yPosition = e.clientY - parentPos.y - (this.commentsElem.nativeElement.clientHeight / 2);
      this.currentY = yPosition - 20
    }
    this.fieldIndex = index;
    field.clicked = !field.clicked;
    this.activeCommentArr[index] = !this.activeCommentArr[index];
    if(!this.activeCommentArr[index]) this.validateAllFieldsAssessed();
  }

  private getPosition(el) {
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

  updateNumCommnts(event, detailedData) {
    detailedData.replies_count = event.length;
  }

  updateEvaluation(type: string, data: any) {
    console.log('Actualizando evaluación');
    
    let evaluationData = {
      evaluation_id: data[0].evaluation_id,
      status: data[0].status,
    };
    this.showSpinner('spinner1')
    switch (type) {
      case "status":
        evaluationData['status'] = this.gnralInfo.status_update;
        // evaluationData['status'] = (this.gnralInfo.status === this.statusHandler.Complete) ? this.statusHandler.Pending : this.statusHandler.Complete;
        break;
      case "finalized_eval":
        // evaluationData['status'] = this.gnralInfo.status_update;
        evaluationData['status'] = this.statusHandler.Finalized;
        break;
      case "complete_eval":
        // evaluationData['status'] = this.gnralInfo.status_update;
        evaluationData['status'] = this.statusHandler.Complete;
        break;
      case "pending_eval":
        // evaluationData['status'] = this.gnralInfo.status_update;
        evaluationData['status'] = this.statusHandler.Pending;
        break;

      default:
        break;
    }

    this.evaluationService.updateDataEvaluation(evaluationData, evaluationData.evaluation_id).subscribe(
      res => {
        console.log(res, 'EVAL UPDATE')
        this.alertService.success(res.message);
        
        this.getDetailedData();
      },
      error => {
        //console.log("updateEvaluation", error);
        this.hideSpinner('spinner1');
        this.alertService.error(error);
      }
    )

  }

  validateCommentAvility(field, is_embed?) {

    let userRole = this.currentUser.roles[0].description, avility = false;
    switch (userRole) {
      case Role.admin:
        avility = field.enable_comments ? true : false;
        break;
      case Role.asesor:
        if(this.gnralInfo.status === this.statusHandler.Pending){
          avility = field.enable_assessor ?  field.enable_comments : field.enable_assessor
        }
        else{
          avility = field.enable_assessor ?  field.enable_comments : field.enable_assessor
        }
        
        // else if (this.gnralInfo.status === this.statusHandler.Finalized){
        //   avility = true;
        // }
        // avility = field.enable_assessor ? (this.gnralInfo.status !== this.statusHandler.Finalized && field.enable_comments) : field.enable_assessor
        break;
      default:
        break;
    }
    // console.log(field,avility)
    return avility;
  }

  addGeneralComment(name, array) {
    let data = array[0]
    let request;
    if (data.general_comment) {
      request = this.commentService.updateDataComment({
        id: data.general_comment_id,
        detail: this.formData.general_comment.value,
        userId: this.currentUser.id,
        evaluationId: this.gnralInfo.evaluation_id,
        metaId: null,
        approved: true
      })
    } else {
      request = this.commentService.createDataComment({
        detail: this.formData.general_comment.value,
        userId: this.currentUser.id,
        evaluationId: this.gnralInfo.evaluation_id,
        metaId: null,
        approved: true
      })
    }

    request.subscribe(
      res => {
        console.log(res)
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

  getCommentReplies() {
    // this.showSpinner('spinner1');
    // let params = { commentId: comment.id, evaluationId: this.gnralInfo.evaluation_id }
    let params = { commentId: this.gnralInfo.general_comment_id, evaluationId: this.gnralInfo.evaluation_id }
    this.commentService.getDataCommentReply(params).subscribe(
      res => {
        this.hideSpinner('spinner1');
        console.log(res)
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

  parseGeneralStatus(status){
    let statusParse;
    switch (status) {
      case this.statusHandler.Pending:
        statusParse = 'Pending'     
        break;
      case this.statusHandler.Autochecked:
        statusParse = 'Automatically Validated'     
        break;
      case this.statusHandler.Complete:
        statusParse = 'Assessed 1st round'     
        break;
      case this.statusHandler.Finalized:
         statusParse = 'Assessed 2nd round'
        break;
      default:
        break;
    }

    return statusParse;
  }

  toggleAssessorsChat() {
    this.assessorsChat.isOpen = !this.assessorsChat.isOpen;
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
