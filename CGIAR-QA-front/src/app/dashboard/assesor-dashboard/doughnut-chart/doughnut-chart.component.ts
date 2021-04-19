import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IgxLegendComponent } from 'igniteui-angular-charts';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit {
  colors= {
    complete: '#59ed9c',
    pending: '#f3da90',
    finalized: '#ed8b84'
  }
  public brushes: any = [];
  public dataset = [];
  @ViewChild("legend", { static: true })
  public legend: IgxLegendComponent;
  @Input() data: any;
  constructor() {
      // this.data = [
      //     { Label: "Approved", Value: 35 },
      //     { Label: "Pending", Value: 12 },
      //     { Label: "Rejected", Value: 25 },
      // ];
  }

  ngOnInit() {
    console.log(this.data);
    // this.formatInputData();
    // console.log(this.dataset);
    
  }

}
