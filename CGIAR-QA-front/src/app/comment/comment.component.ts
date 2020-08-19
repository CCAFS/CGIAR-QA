import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DetailedStatus } from "../_models/general-status.model"

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from "../services/authentication.service";
import { AlertService } from '../services/alert.service';
import { User } from '../_models/user.model';
import { Role } from '../_models/roles.model';
import { CommentService } from '../services/comment.service';
import { from } from 'rxjs';
import { WordCounterPipe } from '../pipes/word-counter.pipe';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  providers: [WordCounterPipe]
})
export class CommentComponent implements OnInit {

  private dataFromItem: any = {};
  private commentGroup: FormGroup;
  private totalChar = 6500;
  private statusHandler = DetailedStatus;
  private commentsByCol: any = [];
  private commentsByColReplies: any = [];
  private currentUser: User;
  private availableComment = false;
  private crpComment = false;
  private is_approved = false;

  private spinner_replies = 'spinner_Comment_Rply';
  private spinner_comment = 'spinner_Comment';

  private currentComment;
  // @ViewChild('commentsElem', { static: false }) commentsElem: ElementRef;
  @Output("parentFun") private parentFun: EventEmitter<any> = new EventEmitter();
  @Output("updateNumCommnts") private updateNumCommnts: EventEmitter<any> = new EventEmitter();
  private allRoles = Role;


  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private commentService: CommentService,
    private wordCount: WordCounterPipe,
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

  private updateData(data: any, params: any) {
    // console.log(data)
    Object.assign(this.dataFromItem, data, params)
    this.availableComment = false;
    this.showSpinner(this.spinner_comment);
    this.getItemCommentData();
  }

  // convenience getter for easy access to form fields
  get formData() { return this.commentGroup.controls; }
  // get replyformData() { return this.replyGroup.controls; }

  private closeComments() {
    this.parentFun.emit();
    this.commentsByCol = [];
    this.commentsByColReplies = [];
    this.availableComment = false;
    this.is_approved = false;
  }

  private addComment() {

    if (this.commentGroup.invalid) {
      this.alertService.error('comment is required', false)
      return;
    }
    this.showSpinner(this.spinner_comment);
    this.commentService.createDataComment({
      detail: this.formData.comment.value,
      userId: this.currentUser.id,
      evaluationId: this.dataFromItem.evaluation_id,
      metaId: this.dataFromItem.field_id,
      approved: true
    }).subscribe(
      res => {
        this.getItemCommentData()
        this.formData.comment.reset()
      },
      error => {
        console.log("getEvaluationsList", error);
        this.hideSpinner(this.spinner_comment);
        this.alertService.error(error);
      }
    );

  }

  private updateComment(type, data) {
    let canUpdate = this.validComment(type, data)
    if (!canUpdate.is_valid) {
      this.alertService.error(canUpdate.message);
      return;
    }
    data[type] = !data[type];
    // console.log(data)
    this.showSpinner(this.spinner_comment);

    this.commentService.updateDataComment(data).subscribe(
      res => {
        this.getItemCommentData();
      },
      error => {
        console.log("updateComment", error);
        this.hideSpinner(this.spinner_comment);

        this.alertService.error(error);
      }
    )

  }

  private updateCommentReply(type, data) {
    let canUpdate = this.validComment(type, data)
    if (!canUpdate.is_valid) {
      this.alertService.error(canUpdate.message);
      return;
    }
    data[type] = !data[type];
    delete data.user.replies;
    delete data.user.crps;
    delete data.user.indicators;
    this.showSpinner(this.spinner_comment);
    // console.log(data)
    this.commentService.updateCommentReply(data).subscribe(
      res => {
        // console.log(res)
        this.getItemCommentData();
      },
      error => {
        console.log("updateComment", error);
        this.hideSpinner(this.spinner_comment);

        this.alertService.error(error);
      }
    )

  }


  private getItemCommentData() {

    let params = { evaluationId: this.dataFromItem.evaluation_id, metaId: this.dataFromItem.field_id };
    this.commentService.getDataComment(params).subscribe(
      res => {
        this.hideSpinner(this.spinner_comment);
        // console.log(res)
        this.updateNumCommnts.emit(res.data.filter(field => field.is_deleted == false));
        switch (this.currentUser.roles[0].description) {
          case this.allRoles.crp:
            this.commentsByCol = res.data.filter(data => data.approved);
            this.currentComment = this.commentsByCol.find(comment => comment.approved);
            this.crpComment = true;
            // this.commentsByCol.forEach(comment => {
            //   console.log(comment)
            //   if (comment.replies.replies_count != '0') {
            //     comment.isCollapsed = true;
            //     this.getCommentReplies(comment)
            //   }
            // });
            break;
          default:
            this.commentsByCol = res.data
            break;
        }
        this.commentsByCol.forEach(comment => {
          if (comment.replies.replies_count != '0') {
            comment.isCollapsed = true;
            this.getCommentReplies(comment)
          }
        });
      },
      error => {
        console.log("getItemCommentData", error);
        this.hideSpinner(this.spinner_comment);
        this.alertService.error(error);
      }
    )
  }

  private getCommentReplies(comment) {
    if (comment.isCollapsed) {
      // this.showSpinner(this.spinner_comment);
      let params = { commentId: comment.id, evaluationId: this.dataFromItem.evaluation_id, }
      this.commentService.getDataCommentReply(params).subscribe(
        res => {
          // this.hideSpinner(this.spinner_comment);
          // console.log('getCommentReplies', res)
          comment.loaded_replies = res.data
          // this.commentsByColReplies = res.data
        },
        error => {
          console.log("getItemCommentData", error);
          this.hideSpinner(this.spinner_comment);
          this.alertService.error(error);
        }
      )
    }
  }


  private answerComment(is_approved: boolean, comment: any) {
    comment.crp_response = is_approved;
    // this.is_approved = is_approved;
    // this.availableComment = true
  }

  private replyComment(currentComment) {
    if (this.commentGroup.invalid || this.formData.comment.value === "") {
      this.alertService.error('Comment is required', false)
      return;
    }

    this.showSpinner(this.spinner_comment);
    this.commentService.createDataCommentReply({
      detail: this.formData.comment.value,
      userId: this.currentUser.id,
      commentId: currentComment ? currentComment.id : this.currentComment.id,
      crp_approved: this.crpComment ? currentComment.crp_response : undefined,
    }).subscribe(
      res => {
        this.availableComment = false;
        this.getItemCommentData()
        this.formData.comment.reset()
      },
      error => {
        console.log("replyComment", error);
        this.hideSpinner(this.spinner_comment);
        this.alertService.error(error);
      }
    )

  }

  private validateStartedMssgs() {
    return true;
    // let isAdmin = this.currentUser.roles.map(role => { return role ? role['description'] : null }).find(role => { return role === Role.admin })
    // return isAdmin;
  }

  private getWordCount(value: string) {
    return this.wordCount.transform(value);
  }

  /***
  * 
  *  Spinner 
  * 
  ***/
  private showSpinner(name: string) {
    // this.spinner.show();
    this.spinner.show(name);
  }

  private hideSpinner(name: string) {
    // this.spinner.hide();
    this.spinner.hide(name);
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
        response = {
          is_valid: true,
          message: null
        }
        break;
    }

    return response;
  }

}
