import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EvaluationsService } from "../../services/evaluations.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { User } from '../../_models/user.model';
import { DetailedStatus, GeneralIndicatorName } from "../../_models/general-status.model"
import { Role } from 'src/app/_models/roles.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-indicator',
  templateUrl: './detail-indicator.component.html',
  styleUrls: ['./detail-indicator.component.scss']
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
    evaluation_id: '',
    general_comment: '',
    general_comment_user: '',
    general_comment_updatedAt: '',
    crp_id: ''
  };
  statusHandler = DetailedStatus;
  generalCommentGroup: FormGroup;
  currentType = '';

  approveAllitems;

  @ViewChild("commentsElem", { static: false }) commentsElem: ElementRef;
  @ViewChild("containerElement", { static: false }) containerElement: ElementRef;


  activeCommentArr = [];
  fieldIndex: number;
  notApplicable = '';
  tickGroup: FormGroup;
  tooltips = {
    public_link: '',
    download_excel: 'Click here to download all comments in an excel file.',
    all_approved: 'Setting this option true, will approved all items without comments.'
  }

  criteriaData = [];
  criteria_loading = false;


  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private titleService: Title,
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
      console.log(routeParams)
      this.currentType = GeneralIndicatorName[`qa_${this.params.type}`];
      this.showSpinner(this.spinner1)
      this.getDetailedData();
      this.getIndicatorCriteria(`qa_${this.params.type}`);


      /** set page title */
      this.titleService.setTitle(`${this.detailedData[0].crp_acronym} / ${this.currentType} / QA-${this.params.type.charAt(0)}${this.params.type.charAt(1).toUpperCase()}-${this.params.indicatorId}`);


    })
  }

  ngOnInit() {
  }

  getDetailedData() {
    this.evaluationService.getDataEvaluation(this.currentUser.id, this.activeRoute.snapshot.params).subscribe(
      res => {
        this.detailedData = res.data.filter(field => {
          return field.value && field.value !== this.notApplicable;
        });;
        this.generalCommentGroup.patchValue({ general_comment: this.detailedData[0].general_comment });
        this.gnralInfo = {
          evaluation_id: this.detailedData[0].evaluation_id,
          general_comment: this.detailedData[0].general_comment,
          crp_id: this.detailedData[0].evaluation_id,
          status: this.detailedData[0].status,
          general_comment_updatedAt: this.detailedData[0].general_comment_updatedAt,
          general_comment_user: this.detailedData[0].general_comment_user,
        }
        this.activeCommentArr = Array<boolean>(this.detailedData.length).fill(false);

        this.hideSpinner(this.spinner1);
        // console.log(res, this.gnralInfo)
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
    console.log(id)
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


  // convenience getter for easy access to form fields
  get formData() { return this.generalCommentGroup.controls; }

  showComments(index: number, field: any, e) {
    // console.log(index, this.detailedData[index],this.params)
    const { x, y } = this.commentsElem.nativeElement.getBoundingClientRect();
    // console.log(x, y, e.clientY)
    if (e) {
      this.currentY = e.clientY - y;
    }
    this.fieldIndex = index;
    field.clicked = !field.clicked;
    this.activeCommentArr[index] = !this.activeCommentArr[index];
  }
  updateNumCommnts(event, detailedData) {
    detailedData.replies_count = event.length;
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

    let userRole = this.currentUser.roles[0].description, avility = false;
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
