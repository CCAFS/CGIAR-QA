import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';
import { CRP } from '../../_models/crp.model';

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
    this.getAllDashData();
    this.getAllCRP();
    this.getIndicatorsByCRP();
  }


  onProgramChange({ target }, value) {
    this.selectedProgram = (value.acronym === '' || value.acronym === ' ') ? value.name : value.acronym;
    this.getAllDashData(value.crp_id)
  }

  goToView(view: string, primary_column: string) {
    this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
  }

  // all evaluations
  getAllDashData(crp_id?) {
    this.dashService.getAllDashboardEvaluations(crp_id).subscribe(
      res => {
        this.dashboardData = this.dashService.groupData(res.data);
        console.log(this.dashboardData)
      },
      error => {
        console.log("getAllDashData", error);
        this.alertService.error(error);
      }
    )
  }

  // all active CRPS
  getAllCRP() {
    this.dashService.getCRPS().subscribe(
      res => {
        this.crps = (res.data);
        this.crps.unshift({ id: 0, acronym: 'All', crp_id: 'undefined', name: '0', is_marlo: false })
        this.selectedProgram = this.crps[0].acronym;
      },
      error => {
        console.log("getAllCRP", error);
        this.alertService.error(error);
      }
    )
  }

  // indicators by CRPS
  getIndicatorsByCRP() {
    this.dashService.getIndicatorsByCRP().subscribe(
      res => {
        // console.log(res.data);
        this.configurationData = res.data;
      },
      error => {
        console.log("getAllCRP", error);
        this.alertService.error(error);
      }
    )
  }

  getPendings(data) {
    //console.log(data)
  }

}
