import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EvaluationsService } from "../../services/evaluations.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';


import { User } from '../../_models/user.model';
import { DetailedStatus } from "../../_models/general-status.model"



@Component({
  selector: 'app-general-detailed-indicator',
  templateUrl: './general-detailed-indicator.component.html',
  styleUrls: ['./general-detailed-indicator.component.scss']
})
export class GeneralDetailedIndicatorComponent implements OnInit {
  currentUser: User;
  detailedData: any[];
  params: any;
  spinner1 = 'spinner1';
  spinner2 = 'spinner2';
  gnralInfo = {
    status: "",
    evaluation_id: '',
    general_comment: '',
    crp_id: ''
  };
  statusHandler = DetailedStatus;
  generalCommentGroup: FormGroup;

  @ViewChild("commentsElem", { static: false }) commentsElem: ElementRef;


  activeCommentArr = [];
  fieldIndex: number;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private authenticationService: AuthenticationService,
    private evaluationService: EvaluationsService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit() {
    // console.log("general detailed")
    this.generalCommentGroup = this.formBuilder.group({
      general_comment: ['', Validators.required]
    });
    this.params = this.activeRoute.snapshot.params;
    this.showSpinner('spinner1')
    this.getDetailedData()
  }

  getDetailedData() {
    this.evaluationService.getDataEvaluation(this.currentUser.id, this.activeRoute.snapshot.params).subscribe(
      res => {
        this.detailedData = res.data;
        //console.log(res.data)
        this.generalCommentGroup.patchValue({ general_comment: this.detailedData[0].general_comment });
        this.gnralInfo = {
          evaluation_id: this.detailedData[0].evaluation_id,
          general_comment: this.detailedData[0].general_comment,
          crp_id: this.detailedData[0].evaluation_id,
          status: this.detailedData[0].status
        }
        this.activeCommentArr = Array<boolean>(this.detailedData.length).fill(false);

        this.hideSpinner('spinner1');
        // console.log(res, this.gnralInfo)
      },
      error => {
        console.log("getEvaluationsList", error);
        this.hideSpinner('spinner1');
        this.alertService.error(error);
      }
    )
  }

  // convenience getter for easy access to form fields
  get formData() { return this.generalCommentGroup.controls; }

  showComments(index: number, field: any) {
    this.fieldIndex = index;
    field.clicked = !field.clicked;
    this.activeCommentArr[index] = !this.activeCommentArr[index];
  }

  updateEvaluation(type: string, data: any) {
    let evaluationData = {
      evaluation_id: data[0].evaluation_id,
      general_comments: data[0].general_comments,
      status: data[0].status,
    };

    switch (type) {
      case 'general_comment':
        if (this.generalCommentGroup.invalid) {
          this.alertService.error('A general comment is required', false)
          return;
        }
        evaluationData['general_comments'] = this.formData.general_comment.value
        break;
      case "status":
        evaluationData['status'] = (this.gnralInfo.status === this.statusHandler.Complete) ? this.statusHandler.Pending : this.statusHandler.Complete;
        break;

      default:
        break;
    }
    console.log(evaluationData)

    this.evaluationService.updateDataEvaluation(evaluationData, evaluationData.evaluation_id).subscribe(
      res => {
        console.log(res)
        this.getDetailedData();
      },
      error => {
        console.log("updateEvaluation", error);
        this.hideSpinner('spinner1');
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
    this.spinner.show(name);
  }

  hideSpinner(name: string) {
    this.spinner.hide(name);
  }

}
