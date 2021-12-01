import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  batches = null;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getBatches();
  }

  getBatches() {
    this.dashboardService.getAllBatches().subscribe(res => {
      console.log({res});
      this.batches = res.data;
    })
  }

}
