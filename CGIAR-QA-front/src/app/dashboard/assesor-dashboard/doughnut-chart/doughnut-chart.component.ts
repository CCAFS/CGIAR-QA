import { Component, Input, OnInit } from '@angular/core';

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

  formatInputData() {
    for (const item of this.data) {
      console.log(item);
      this.dataset.push({Label: item.status, Value: +item.label});
      console.log(this.colors[item.status]);      
      this.brushes.push(this.colors[item.status]);
    }
  }
}
