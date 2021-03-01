import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DetailedStatus, ReplyTypes } from "../_models/general-status.model"

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from "../services/authentication.service";
import { AlertService } from '../services/alert.service';
import { User } from '../_models/user.model';
import { Role } from '../_models/roles.model';
import { CommentService } from '../services/comment.service';
import { from } from 'rxjs';
import { WordCounterPipe } from '../pipes/word-counter.pipe';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  providers: [WordCounterPipe]
})
export class CommentComponent implements OnInit {

  dataFromItem: any = {};
  commentGroup: FormGroup;
  totalChar = 6500;
  statusHandler = DetailedStatus;
  commentsByCol: any = [];
  commentsByColReplies: any = [];
  currentUser: User;
  availableComment = false;
  crpComment = false;
  is_approved = false;
  replyTypes = ReplyTypes;


  spinner_replies = 'spinner_Comment_Rply';
  spinner_comment = 'spinner_Comment';

  currentComment;
  // @ViewChild('commentsElem', { static: false }) commentsElem: ElementRef;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  @Output("updateNumCommnts") updateNumCommnts: EventEmitter<any> = new EventEmitter();
  allRoles = Role;


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

  updateData(data: any, params: any) {
    // console.log(data)
    Object.assign(this.dataFromItem, data, params)
    this.availableComment = false;
    this.showSpinner(this.spinner_comment);
    this.getItemCommentData();
  }

  // convenience getter for easy access to form fields
  get formData() { return this.commentGroup.controls; }
  // get replyformData() { return this.replyGroup.controls; }

  closeComments() {
    this.parentFun.emit();
    this.commentsByCol = [];
    this.commentsByColReplies = [];
    this.availableComment = false;
    this.is_approved = false;
  }


  toggleTag({commentId, tagTypeId, newTagValue}) {
        if (newTagValue) {
      this.addTag(commentId, tagTypeId)
    } else {
      this.deleteTag(commentId, tagTypeId)
    }
  }

  addTag(commentId, tagTypeId) {

    this.showSpinner(this.spinner_comment);

    this.commentService.createTag({ userId: this.currentUser.id, tagTypeId, commentId }).subscribe(
      res => {
        this.getItemCommentData();
        console.log(res.message);
        
      },
      error => {
        console.log("addTag", error);
        this.hideSpinner(this.spinner_comment);
        this.alertService.error(error);
      }
    );
  }

  deleteTag(commentId, tagTypeId) {
    this.showSpinner(this.spinner_comment);

    this.commentService.getTagId({ commentId, tagTypeId, userId: this.currentUser.id }).pipe(
      mergeMap((res) => this.commentService.deleteTag(res.data[0].tagId))
    ).subscribe(
      res => {
        this.getItemCommentData();
        console.log(res.message);
      },
      error => {
        console.log("deleteTag", error);
        this.hideSpinner(this.spinner_comment);
        this.alertService.error(error);
      }
    )

  }

  addComment() {

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

  updateComment(type, data) {
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

  updateCommentReply(type, data) {
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


  getItemCommentData() {

    let params = { evaluationId: this.dataFromItem.evaluation_id, metaId: this.dataFromItem.field_id };
    this.commentService.getDataComment(params).subscribe(
      res => {
        this.hideSpinner(this.spinner_comment);
        // console.log(res)
        this.updateNumCommnts.emit(res.data.filter(field => field.is_deleted == false));
        switch (this.currentUser.roles[0].description) {
          case this.allRoles.crp:
            this.commentsByCol = res.data.filter(data => data.approved);
            console.log(this.commentsByCol);
            
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
        // console.log(this.commentsByCol);

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

  getCommentReplies(comment) {
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


  answerComment(is_approved: any, replyTypeId: number,comment: any) {
    comment.crp_response = is_approved;
    comment.replyTypeId = replyTypeId;
    // this.is_approved = is_approved;
    // this.availableComment = true
  }

  replyComment(currentComment) {
    if (this.commentGroup.invalid || this.formData.comment.value === "") {
      this.alertService.error('Comment is required', false)
      return;
    }
    console.log('CRP_RESPONSE',currentComment.crp_response)
    this.showSpinner(this.spinner_comment);
    this.commentService.createDataCommentReply({
      detail: this.formData.comment.value,
      userId: this.currentUser.id,
      commentId: currentComment ? currentComment.id : this.currentComment.id,
      crp_approved: this.crpComment ? currentComment.crp_response : undefined,
      replyTypeId: currentComment ? currentComment.replyTypeId : undefined
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

  validateStartedMssgs() {
    return true;
    // let isAdmin = this.currentUser.roles.map(role => { return role ? role['description'] : null }).find(role => { return role === Role.admin })
    // return isAdmin;
  }

  getWordCount(value: string) {
    return this.wordCount.transform(value);
  }

  /***
  * 
  *  Spinner 
  * 
  ***/
  showSpinner(name: string) {
    // this.spinner.show();
    this.spinner.show(name);
  }

  hideSpinner(name: string) {
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
