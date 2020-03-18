import { Component, OnInit } from '@angular/core';

import { DashboardService } from "../../services/dashboard.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-crp-dashboard',
  templateUrl: './crp-dashboard.component.html',
  styleUrls: ['./crp-dashboard.component.scss']
})
export class CrpDashboardComponent implements OnInit {
  dashboardData: any[];
  constructor(private dashService: DashboardService,) { }

  ngOnInit() {
    this.dashboardData = this.dashService.groupData(
      {
        "responded": [
          {
            "indicator_view_name": "qa_innovations",
            "status": "complete",
            "type": "success",
            "value": "1",
            "crp_id": "CRP-22",
            "label": "1",
            "primary_field": "project_innovation_id"
          },
          {
            "indicator_view_name": "qa_innovations",
            "status": "pending",
            "type": "danger",
            "value": "933",
            "crp_id": "CRP-23",
            "label": "933",
            "primary_field": "project_innovation_id"
          }
        ],
        "no_responded": [
          {
            "indicator_view_name": "qa_policies",
            "status": "complete",
            "type": "success",
            "value": "3",
            "crp_id": "CRP-11",
            "label": "3",
            "primary_field": "project_innovation_id"
          },
          {
            "indicator_view_name": "qa_policies",
            "status": "pending",
            "type": "danger",
            "value": "451",
            "crp_id": "CRP-11",
            "label": "451",
            "primary_field": "project_innovation_id"
          }
        ]
      }
    )




  }

}
