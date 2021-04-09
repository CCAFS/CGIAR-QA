import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-chart',
  templateUrl: './status-chart.component.html',
  styleUrls: ['./status-chart.component.scss']
})
export class StatusChartComponent implements OnInit{
  @Input() data;
  multi: any[];
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = false;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'Normalized Population';

  colorScheme = {
    domain: ['var(--color-agree)', 'var(--color-pending)']
  };

  constructor() {

  }

  ngOnInit() {
    console.log(this.data);
    
    
  }
  onSelect(event) {
    console.log(event);
  }

}
