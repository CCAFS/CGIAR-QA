import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {
  wosColor = "#46bdc6";
  @Input() data;
  @Input() chartName;
  myData;
  public legendLabels: any = { 
    status: [
    {name:"Quality Checked by WoS/Scopus", class: "autochecked"},
    {name:"Complete", class:"complete" },
    {name:"Pending", class: "pending"},
    {name:"Finalized", class:"finalized" }
  ],
  comments: [
    {name:"Approve", class: "complete"},
    {name:"Pending", class:"pending" },
    {name:"Rejected", class: "finalized"},
  ]};

  public chartType: any;
  public doughnutChartData: any[] = [[350, 450, 100]];
  public doughnutChartType: string = "doughnut";
  public chartColors: Array<any> = [{backgroundColor: ['#59ed9c','#f3da90','#ed8b84']}]


  // options
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  constructor() {
    // this.myData = [...this.data]

  }
  ngOnInit() {
    this.chartType = this.legendLabels[this.chartName];
    // console.log(this.chartName);
    // console.log(this.chartType);
    
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  setLabelFormatting(c): string {   
    let indicator = this.data.find(status => status.data.name == c)
    return `${indicator.value}`;
  }
}
