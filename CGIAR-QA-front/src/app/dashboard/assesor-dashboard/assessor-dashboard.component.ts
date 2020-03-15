import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private dashService: DashboardService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit() {
    this.getDashData();
  }

  goToView(view: string, primary_column: string) {
    this.router.navigate(['/reload']).then(() => { this.router.navigate(['indicator', view.toLocaleLowerCase(), primary_column]); });
  }


  getDashData() {
    this.dashService.getDashboardEvaluations(this.currentUser.id).subscribe(
      res => {
        this.dashboardData = this.dashService.groupData(res.data);
        console.log(this.dashboardData)
      },
      error => {
        console.log("getDashData", error);
        this.alertService.error(error);
      }
    )
  }

}
