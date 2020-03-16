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
  gnralInfo = {};
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

  showComments(index: number, field:any) {
    this.fieldIndex = index;
    field.clicked = !field.clicked;
    this.activeCommentArr[index] = !this.activeCommentArr[index];
    // console.log(this.activeCommentArr)
    // console.log(this.activeCommentArr[index])

    // console.log('show comments')
    console.log(this.commentsElem.nativeElement.getBoundingClientRect());
    console.log(this.commentsElem.nativeElement.offsetTop);
    // this.renderer.setStyle(this.commentsElem.nativeElement, 'top', '20em');
    // this.commentContainerData.is_active = true;
    // this.commentContainerData.is_active = !this.commentContainerData.is_active;
    // this.updateView.emit();
    // this.router.navigate(['comment']);
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
