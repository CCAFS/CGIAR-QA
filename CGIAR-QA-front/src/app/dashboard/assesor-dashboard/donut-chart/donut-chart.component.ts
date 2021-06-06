import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndicatorsService } from 'src/app/services/indicators.service';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {
  wosColor = "#46bdc6";
  
  @Input() data;
  @Input() chartName;
  @Input() selectedIndicator;

  myData;
  public legendLabels: any = { 
    indicator_status: [
    {name:"Pending", class: "pending"},
    {name:"Assessed (1st round)", class:"complete" },
    {name:"Assessed (2nd round)", class:"finalized" }
  ],
    publications_status: [
    {name:"Automatically validated", class: "autochecked"},
    {name:"Pending", class: "pending"},
    {name:"Assessed (1st round)", class:"complete" },
    {name:"Assessed (2nd round)", class:"finalized" }
  ],
  comments: [
    {name:"Pending", class:"pending" },
    {name:"Accepted", class: "agree"},
    {name:"Accepted with comment", class: "agree-wc"},
    {name:"Disagree", class: "disagree"},
    {name:"Clarification needed", class: "clarification"},
    
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

  constructor(private router: Router,
    private indicatorService: IndicatorsService) {
    // this.myData = [...this.data]

  }
  ngOnInit() {
    this.chartType = this.legendLabels[this.chartName];
    // console.log('SWIMLANE DATA', this.data);
    
    // console.log(this.chartName);
    // console.log(this.chartType);
    
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    let status = null;
    switch (data.name) {
      case 'pending':
        status = false;
        console.log('Click on Pending');        
        this.indicatorService.setOrderByStatus(status);
        break;
      case 'Assessed 1st round':
        status = false;
        console.log('Click on Assessed 1st round');        
        this.indicatorService.setOrderByStatus(status);
        break;
      case 'Assessed 2nd round':
        status = true;
        console.log('Click on Assessed 2nd round');        
        this.indicatorService.setOrderByStatus(status);
        break;

      case 'AcceptedWC':
        status = false;
        console.log('Click on AcceptedWC');        
        this.indicatorService.setOrderByAccpetedWC(status);
        break;

      case 'Clarification':
        status = false;
        console.log('Click on Clarification');        
        this.indicatorService.setOrderByClarification(status);
        break;

      case 'Disagree':
        status = false;
        console.log('Click on Disagree');        
        this.indicatorService.setOrderByDisagree(status);
        break;
    
      default:
        break;
    }
if(status != null) {
  this.router.navigate([`/indicator/${this.selectedIndicator.split('qa_')[1]}/id`]);
}
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  setLabelFormatting(c): string {   
    let indicator = this.data.find(status => status.data.name == c)
    return `${indicator.value}`;
  }
}
