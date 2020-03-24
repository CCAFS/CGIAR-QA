import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from "../../services/authentication.service";
import { EvaluationsService } from "../../services/evaluations.service";
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  dataFromItem: any = {};
  commentGroup: FormGroup;
  commentsByCol: any = [];
  currentUser: User;

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
    // console.log('comment component data=>', this.dataFromItem)
    this.showSpinner('spinner_Comment');
    this.getItemCommentData();
  }

  // convenience getter for easy access to form fields
  get formData() { return this.commentGroup.controls; }

  closeComments() {
    // this.dataFromItem.clicked = !this.dataFromItem.clicked;
    this.parentFun.emit();
    // console.log(this.dataFromItem)
  }

  addComment() {

    if (this.commentGroup.invalid) {
      this.alertService.error('comment is required', false)
      return;
    }
    this.showSpinner('spinner2');
    this.evaluationService.createDataComment({
      detail: this.formData.comment.value,
      userId: this.currentUser.id,
      evaluationId: this.dataFromItem.evaluation_id,
      metaId: this.dataFromItem.field_id,
      approved: null
    }).subscribe(
      res => {
        this.hideSpinner('spinner2');
        this.commentsByCol = res.data;
        this.getItemCommentData()
        this.formData.comment.reset()
      },
      error => {
        console.log("getEvaluationsList", error);
        this.hideSpinner('spinner2');
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
    console.log(type, data)
    data[type] = !data[type];
    this.showSpinner('spinner2');
    this.evaluationService.updateDataComment(data).subscribe(
      res => {
        this.hideSpinner('spinner2');
        //console.log(res.data)
      },
      error => {
        console.log("updateComment", error);
        this.hideSpinner('spinner2');
        this.alertService.error(error);
      }
    )

  }

  getItemCommentData() {
    let params = { evaluationId: this.dataFromItem.evaluation_id, metaId: this.dataFromItem.field_id }
    this.evaluationService.getDataComment(params).subscribe(
      res => {
        this.hideSpinner('spinner_Comment');
        this.commentsByCol = res.data
      },
      error => {
        console.log("getItemCommentData", error);
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

}
