import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';
import { CRP } from '../../_models/crp.model';
import { GeneralStatus } from '../../_models/general-status.model';

import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User;
  crps: CRP[];
  dashboardData: any[];
  configurationData: any[];
  selectedProgram: string;
  selectedProg = {}
  settingsForm: FormGroup;
  generalStatus = GeneralStatus;
  programsForm;


  constructor(private formBuilder: FormBuilder,
    private dashService: DashboardService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
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
      enableQA: this.formBuilder.array([], [Validators.required])
    })
  }

  ngOnInit() {

    this.loadDashData();

  }

 
  isChecked(indicator) {
    return indicator.status === this.generalStatus.Open ? true : false;
  }

  submitForm(type) {
    // let id = 
    console.log(this.settingsForm.value[type])
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
    this.submitForm(type);
  }


  onProgramChange({ target }, value) {
    this.selectedProgram = (value.acronym === '' || value.acronym === ' ') ? value.name : value.acronym;
    this.getAllDashData(value.crp_id).subscribe(
      res => {
        this.dashboardData = this.dashService.groupData(res.data);
      },
      error => {
        console.log("getAllDashData", error);
        this.alertService.error(error);
      }
    )
  }

  goToView(view: string, primary_column: string) {
    this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
  }
  getPendings(data) {
    //console.log(data)
  }

  loadDashData() {
    this.showSpinner()
    let responses = forkJoin([
      this.getAllDashData(),
      this.getAllCRP(),
      this.getIndicatorsByCRP()
    ]);

    responses.subscribe(res => {
      const [dashData, crps, indicatorsByCrps] = res;

      this.dashboardData = this.dashService.groupData(dashData.data);

      this.crps = crps.data;
      this.crps.unshift({ id: 0, acronym: 'All', crp_id: 'undefined', name: '0', is_marlo: false })
      this.selectedProgram = this.crps[0].acronym;

      this.configurationData = indicatorsByCrps.data;
      // console.log(this.configurationData);

      // const enableQA: FormArray = this.settingsForm.get('enableQA') as FormArray;
      // console.log(this.settingsForm.get('enableQA'))

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



}
