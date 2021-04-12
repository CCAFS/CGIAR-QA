import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndicatorsService } from 'src/app/services/indicators.service';

@Component({
  selector: 'app-comments-chart',
  templateUrl: './comments-chart.component.html',
  styleUrls: ['./comments-chart.component.scss']
})
export class CommentsChartComponent implements OnInit {

  @Input() data;
  @Input() total;
  @Input() chartName;
  @Input() selectedIndicator;

  myData;
 
  commentsLabels = [
    {name:"Pending", class:"pending", value: 0},
    {name:"Accepted", class: "agree", value: 0},
    {name:"Disagree", class: "disagree", value: 0},
    {name:"Clarification needed", class: "clarification", value: 0},
  ]

  public chartType: any;
  public doughnutChartData: any[] = [[350, 450, 100]];
  public doughnutChartType: string = "doughnut";
  public chartColors: Array<any> = [{backgroundColor: ['#59ed9c','#f3da90','#ed8b84']}]


  // options
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';

  constructor(private router: Router,
    private indicatorService: IndicatorsService) {
    // this.myData = [...this.data]

  }
  ngOnInit() {
    this.chartType = this.commentsLabels[this.chartName];
    console.log('SWIMLANE DATA', this.data);
    
    // console.log(this.chartName);
    // console.log(this.chartType);
    
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    let status = true;
    if(data.name == 'pending') {
      status = false;
    }
    this.indicatorService.setOrderByStatus(status);
    this.router.navigate([`/indicator/${this.selectedIndicator.split('qa_')[1]}/id`]);
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
