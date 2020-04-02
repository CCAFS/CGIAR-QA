import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from "../services/authentication.service";
import { EvaluationsService } from "../services/evaluations.service";
import { AlertService } from '../services/alert.service';

import { User } from '../_models/user.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  dataFromItem: any = {};
  commentGroup: FormGroup;
  commentsByCol: any = [];
  commentsByColReplies: any = [];
  currentUser: User;
  availableComment = false;
  is_approved = false;

  spinner_replies = 'spinner_Comment_Rply';
  spinner_comment = 'spinner_Comment';

  currentComment;

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();


  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private evaluationService: EvaluationsService,
    private spinner: NgxSpinnerService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit() {
    this.commentGroup = this.formBuilder.group({
      comment: ['', Validators.required]
    });
    this.dataFromItem = [];
  }

  updateData(data: any, params: any) {
    Object.assign(this.dataFromItem, data, params)
    this.availableComment = false;
    // console.log('comment component data=>', this.dataFromItem)
    this.showSpinner('spinner_Comment');
    this.getItemCommentData();
  }

  // convenience getter for easy access to form fields
  get formData() { return this.commentGroup.controls; }

  closeComments() {
    this.parentFun.emit();
  }

  addComment() {

    if (this.commentGroup.invalid) {
      this.alertService.error('comment is required', false)
      return;
    }
    this.showSpinner('spinner_Comment');
    this.evaluationService.createDataComment({
      detail: this.formData.comment.value,
      userId: this.currentUser.id,
      evaluationId: this.dataFromItem.evaluation_id,
      metaId: this.dataFromItem.field_id,
      approved: null
    }).subscribe(
      res => {
        this.hideSpinner('spinner_Comment');
        // this.commentsByCol = res.data;
        this.getItemCommentData()
        this.formData.comment.reset()
      },
      error => {
        console.log("getEvaluationsList", error);
        this.hideSpinner('spinner_Comment');
        this.alertService.error(error);
      }
    )

    /*this.commentsByCol.push({
      comment: this.formData.comment.value,
      user: this.currentUser,
      created_at: new Date(),
    });

    */

    // console.log(this.formData.comment.value)

  }

  updateComment(type, data) {
    let canUpdate = this.validComment(type, data)
    if (!canUpdate.is_valid) {
      this.alertService.error(canUpdate.message);
      return;
    }
    data[type] = !data[type];
    this.showSpinner('spinner_Comment');
    this.evaluationService.updateDataComment(data).subscribe(
      res => {
        this.hideSpinner('spinner_Comment');
        //console.log(res.data)
      },
      error => {
        console.log("updateComment", error);
        this.hideSpinner('spinner_Comment');
        this.alertService.error(error);
      }
    )

  }

  getItemCommentData() {
    let params = { evaluationId: this.dataFromItem.evaluation_id, metaId: this.dataFromItem.field_id }
    this.evaluationService.getDataComment(params).subscribe(
      res => {
        this.hideSpinner('spinner_Comment');
        console.log(res)
        this.commentsByCol = res.data.filter(data => data.approved)
      },
      error => {
        console.log("getItemCommentData", error);
        this.hideSpinner('spinner_Comment');
        this.alertService.error(error);
      }
    )
  }

  getCommentReplies(comment) {
    this.showSpinner('spinner_Comment_Rply');
    if (comment.isCollapsed) {
      let params = { commentId: comment.id, evaluationId: this.dataFromItem.evaluation_id, }
      this.evaluationService.getDataCommentReply(params).subscribe(
        res => {
          this.hideSpinner('spinner_Comment_Rply');
          console.log(res)
          this.commentsByColReplies = res.data
        },
        error => {
          console.log("getItemCommentData", error);
          this.hideSpinner('spinner_Comment_Rply');
          this.alertService.error(error);
        }
      )
    }
  }


  answerComment(is_approved: boolean) {
    this.currentComment = this.commentsByCol.find(comment => comment.approved)
    this.is_approved = is_approved;
    this.availableComment = true
  }

  replyComment() {
    if (this.commentGroup.invalid) {
      this.alertService.error('comment is required', false)
      return;
    }
    this.showSpinner('spinner_Comment');
    this.evaluationService.createDataCommentReply({
      detail: this.formData.comment.value,
      userId: this.currentUser.id,
      commentId: this.currentComment.id,
      crp_approved: this.is_approved,
      // approved: this.approved,
    }).subscribe(
      res => {
        this.hideSpinner('spinner_Comment');
        this.availableComment = false;
        // this.commentsByCol = res.data;
        this.getItemCommentData()
        this.formData.comment.reset()
      },
      error => {
        console.log("getEvaluationsList", error);
        this.hideSpinner('spinner_Comment');
        this.alertService.error(error);
      }
    )

  }

  /***
  * 
  *  Spinner 
  * 
  ***/
  showSpinner(name: string) {
    console.log(name)
    this.spinner.show();
    // this.spinner.show(name);
  }

  hideSpinner(name: string) {
    this.spinner.hide();
    // this.spinner.hide(name);
  }

  private validComment(type, data) {
    let response;
    switch (type) {
      case 'approved':
        let hasApprovedComments = this.commentsByCol.map(comment => comment.approved).find(approved => true);
        response = {
          is_valid: hasApprovedComments ? data.approved ? true : false : true,
          message: (hasApprovedComments) ? 'Only one comment can be set as APPROVED' : null
        }
        break;

      default:
        return true;
        break;
    }

    return response;
  }

}
