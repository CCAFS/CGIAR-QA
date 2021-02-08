import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  public brushes: any = ['#59ed9cff', '#f3da90ff', '#ed8b84ff'];
  
  public data = [
    {Item: "Item 1", Approved: 148, Pending: 110, Rejected: 95},
    {Item: "Item 2", Approved: 142, Pending: 115, Rejected: 91},
    {Item: "Item 3", Approved: 134, Pending: 121, Rejected: 86},
    {Item: "Item 4", Approved: 131, Pending: 129, Rejected: 65},
    {Item: "Item 5", Approved: 135, Pending: 115, Rejected: 77},
    {Item: "Item 6", Approved: 146, Pending: 112, Rejected: 88}
];
  constructor() { }

  ngOnInit() {
  }

}
