import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';
import { CRP } from '../../_models/crp.model';
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
    this.programsForm = this.formBuilder.group({
      program: ['0', Validators.required]
    })
  }

  ngOnInit() {

    this.loadDashData();
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

      this.hideSpinner()
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
    return this.dashService.getCRPS();
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
