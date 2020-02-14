import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assessor-dashboard',
  templateUrl: './assessor-dashboard.component.html',
  styleUrls: ['./assessor-dashboard.component.scss']
})
export class AssessorDashboardComponent implements OnInit {

  tmpArray = [
    { total: 100, value: 20, type: "success" },
    { total: 100, value: 40, type: "danger" },
    { total: 100, value: 20, type: "warning" },
  ]
  // tmp = { total: 100, complete: 20, incomplete: 80 };

  constructor() { }

  ngOnInit() {
  }

}
