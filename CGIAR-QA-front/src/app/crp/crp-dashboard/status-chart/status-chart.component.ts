import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-chart',
  templateUrl: './status-chart.component.html',
  styleUrls: ['./status-chart.component.scss']
})
export class StatusChartComponent implements OnInit{
  @Input() indicator;
  @Input() total;
  multi: any[];
  view: any[] = [700, 400];

  legendLabels = [
    {name:"Answered", class: "complete", value: 0},
    {name:"Pending", class:"pending", value: 0 },
  ];

  // options
  results: any[];
  showXAxis: boolean = true;
  showYAxis: boolean = false;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'Normalized Population';

  colorScheme = {
    domain: ['var(--color-complete)', 'var(--color-pending)']
  };

  constructor() {

    
  }

  ngOnInit() {
    // console.log(this.indicator);
    this.formatIndicator();
  }
  onSelect(event) {
    console.log(event);
  }

  formatIndicator() {
    this.results = [{name: this.indicator[0].name, series: []}];
    this.indicator[0].series.forEach(element => {
      // this.statusChartData[indicator][element.status] = +element.value;
      let status = element.status == 'complete' ? 'Answered' : 'Pending';
      this.legendLabels.find(el => el.name == status).value = element.value;
      this.results[0].series.push({ name: element.status == 'complete' ? 'Answered' : 'Pending', value: +element.value })  
      
    });
    this.results[0].series.reverse();
  }

}
