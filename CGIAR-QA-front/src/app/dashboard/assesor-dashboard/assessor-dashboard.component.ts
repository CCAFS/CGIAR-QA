import { Component, OnInit } from '@angular/core';


import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';

import { User } from '../../_models/user.model';

@Component({
  selector: 'app-assessor-dashboard',
  templateUrl: './assessor-dashboard.component.html',
  styleUrls: ['./assessor-dashboard.component.scss']
})
export class AssessorDashboardComponent implements OnInit {

  currentUser: User;
  dashboardData: any[];

  tmpArray = [
    { total: 100, value: 20, type: "success" },
    { total: 1000, value: 40, type: "danger" },
    { total: 100, value: 20, type: "warning" },
  ]
  // tmp = { total: 100, complete: 20, incomplete: 80 };

  constructor(private dashService: DashboardService, 
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit() {
    this.getDashData();
  }


  getDashData() {
    this.dashService.getDashboardEvaluations(this.currentUser.id).subscribe(
      res => {
        this.dashboardData =  this.dashService.groupData(res.data);
      },
      error => {
        console.log("getDashData", error);
        this.alertService.error(error);
      }
    )
  }

  // private groupData(data) {
  //   for (var property in data) {
  //     if (data.hasOwnProperty(property)) {
  //       const ele = data[property];
  //       ele['total'] = ele.reduce((sum, currentValue) => {
  //         return sum + parseInt( currentValue.value);
  //       }, 0);
  //     }
  //   }
  //   return (data);
  // }

}
