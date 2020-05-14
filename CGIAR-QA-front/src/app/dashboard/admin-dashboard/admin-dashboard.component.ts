import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';
import { IndicatorsService } from '../../services/indicators.service';

import { User } from '../../_models/user.model';
import { CRP } from '../../_models/crp.model';
import { GeneralStatus, GeneralIndicatorName } from '../../_models/general-status.model';

import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User;
  crps: CRP[];
  dashboardData: any[];
  dashboardModalData: any[];
  configurationData: any[];
  selectedProgramName: string;
  selectedProg = {}
  settingsForm: FormGroup;
  programsForm: FormGroup;
  generalStatus = GeneralStatus;
  indicatorsName = GeneralIndicatorName;

  enableQATooltip: string = 'Enable the assessment process so Quality Assessors can start the process of providing recommendations. If this option is disabled, they cannot provide any comments.';
  enableCommentsTooltip: string = 'If this option is enabled, CRPs and PTFs will be able to see all comments provided by the Quality Assessors in MARLO and MEL; and also will be able to react to the comments.';

  modalRef: BsModalRef;
  multi = [];
  has_comments: boolean = false;
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Indicators';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Comments';
  legendTitle: string = 'Labels';
  colorScheme = {
    domain: ['#61b33e', '#ffca30', '#0f8981', '#2e7636']
  };

  constructor(private formBuilder: FormBuilder,
    private dashService: DashboardService,
    private modalService: BsModalService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private indicatorService: IndicatorsService,
    private commentService: CommentService,
    private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });

    /**
     * initialize forms
     */
    this.programsForm = this.formBuilder.group({
      program: ['0', Validators.required]
    });
    this.settingsForm = this.formBuilder.group({
      enableQA: this.formBuilder.array([], [Validators.required]),
      enableCRP: this.formBuilder.array([], [Validators.required]),
    })
  }

  ngOnInit() {
    this.showSpinner()
    this.loadDashData();

  }


  getIndicatorName(indicator: string) {
    return this.indicatorsName[indicator]
  }

  isChecked(indicator, type) {
    return type === 'enableQA' ? indicator.enable_assessor : indicator.enable_crp;
    // return indicator.status === this.generalStatus.Open ? true : false;
  }

  updateConfig(type: string, id: number, isActive: boolean) {
    // let id = 
    let status = isActive ? this.generalStatus.Open : this.generalStatus.Close;
    // console.log(type, id, status);
    let request = null;
    // console.log(type, { enable_assessor: null, enable_crp: isActive })
    switch (type) {
      case 'enableQA':
        request = this.indicatorService.updateIndicatorsByUser(id, { enable: 'enable_assessor', isActive })
        console.log(type, { enable: 'enable_assessor', isActive })
        break;
      case 'enableCRP':
        request = this.indicatorService.updateIndicatorsByUser(id, { enable: 'enable_crp', isActive })
        console.log(type, { enable: 'enable_crp', isActive })
        break;

      default:
        break;
    }

    this.showSpinner();
    request.subscribe(
      res => {
        console.log(res)
        // this.hideSpinner();
        this.loadDashData();
      },
      error => {
        this.hideSpinner()
        console.log("getAllDashData", error);
        this.alertService.error(error);
      },
    );
  }


  onCheckboxChange(e, type) {
    const checkboxData: FormArray = this.settingsForm.get(type) as FormArray;

    if (e.target.checked) {
      checkboxData.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkboxData.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkboxData.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.updateConfig(type, e.target.value, e.target.checked);
  }


  onProgramChange({ target }, value) {
    this.selectedProgramName = (value.acronym === '' || value.acronym === ' ') ? value.name : value.acronym;
    this.selectedProg = value;
    this.showSpinner()
    this.getAllDashData(value.crp_id).subscribe(
      res => {
        this.dashboardData = this.dashService.groupData(res.data);
        this.hideSpinner()
      },
      error => {
        console.log("getAllDashData", error);
        this.hideSpinner()
        this.alertService.error(error);
      }
    )
  }

  goToView(view: string, primary_column: string) {
    this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]);
    // this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
  }

  getPendings(data) {
    return data.acronym === 'All' ? '' : '- ' + (data.qa_active === this.generalStatus.Open ? 'Open' : 'Pending')
  }

  loadDashData() {
    let responses = forkJoin([
      this.getAllDashData(),
      this.getAllCRP(),
      this.getIndicatorsByCRP()
    ]);

    responses.subscribe(res => {
      const [dashData, crps, indicatorsByCrps] = res;

      this.dashboardData = this.dashService.groupData(dashData.data);
      // console.log(res)

      this.crps = crps.data;
      this.crps.unshift({ id: 0, acronym: 'All', crp_id: 'undefined', name: '0', is_marlo: false })
      this.selectedProgramName = this.crps[0].acronym;

      this.configurationData = indicatorsByCrps.data;
      // console.log(this.configurationData)

      this.hideSpinner();
    }, error => {
      this.hideSpinner()
      console.log("getAllDashData", error);
      this.alertService.error(error);
    })
  }


  /**
   * 
   * 
   * GET DASHBOARD data
   * 
   */
  // all evaluations
  getAllDashData(crp_id?): Observable<any> {
    return this.dashService.getAllDashboardEvaluations(crp_id).pipe();
  }

  // all active CRPS
  getAllCRP(): Observable<any> {
    return this.dashService.getCRPS().pipe();
  }

  // indicators by CRPS
  getIndicatorsByCRP(): Observable<any> {
    return this.dashService.getIndicatorsByCRP().pipe();
  }

  // comments by crp

  getCommentStats() {
    this.showSpinner();
    let params = (this.selectedProg) ? this.selectedProg : { crp_id: 'undefined' }
    this.commentService.getCommentCRPStats(params)
      .subscribe(
        res => {
          this.has_comments = res.data.length > 0 ? true:false
          Object.assign(this, { multi: res.data });
          this.hideSpinner();
        },
        error => {
          this.hideSpinner()
          console.log("getCommentStats", error);
          this.alertService.error(error);
        })

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


  /***
   * 
   * 
   */

  openModal(template: TemplateRef<any>) {
    // this.dashboardModalData = []
    this.getCommentStats()
    this.modalRef = this.modalService.show(template);
  }

  // getCommentStats() {
  //   this.commentService.getCommentCRPStats({ crp_id: this.currentUser.crp.crp_id })
  //     .subscribe(
  //       res => {
  //         console.log(res)
  //         Object.assign(this, { multi: res.data });
  //         this.hideSpinner();
  //       },
  //       error => {
  //         this.hideSpinner()
  //         console.log("getCommentStats", error);
  //         this.alertService.error(error);
  //       },
  //     )
  // }



  /**
   * 
   * Chart controllers
   */


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


  axisFormat(val) {
    if (val % 1 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }





}
