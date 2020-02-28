import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  selectedProgram:string;


  programsForm = this.formBuilder.group({
    program: ['']
  })

  constructor(private formBuilder: FormBuilder,
    private dashService: DashboardService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }
  
  ngOnInit() {
    this.getAllDashData();
    this.getAllCRP();
    this.getIndicatorsByCRP();
  }


  onProgramChange({ target }, value) {
    this.selectedProgram = (value.acronym === '' || value.acronym === ' ') ? value.name: value.acronym;
    this.getAllDashData(value.crp_id)
  }

  // all evaluations
  getAllDashData(crp_id?) {
    this.dashService.getAllDashboardEvaluations(crp_id).subscribe(
      res => {
        this.dashboardData = this.dashService.groupData(res.data);
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
        this.crps =(res.data);
        this.crps.unshift({ id: 0, acronym: 'All', crp_id: 'undefined', name: '0', is_marlo: false })
      },
      error => {
        console.log("getAllCRP", error);
        this.alertService.error(error);
      }
    )
  }

  // indicators by CRPS
  getIndicatorsByCRP(){
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

}
