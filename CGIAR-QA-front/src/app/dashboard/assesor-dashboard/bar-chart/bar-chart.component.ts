import { Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild } from '@angular/core';
import { ChartSeriesEventArgs, DataChartMouseButtonEventArgs, IgxCategoryToolTipLayerComponent, IgxCategoryXAxisComponent, IgxCategoryYAxisComponent, IgxDataChartComponent, IgxItemToolTipLayerComponent, IgxLegendComponent, IgxNumericXAxisComponent, IgxNumericYAxisComponent } from 'igniteui-angular-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  @Input() data;
  chartName = true;

  tagTypesId = {
    notsure: 2,
    agree: 3,
    disagree: 4
  }

  public legendLabels: any = { 
    tags: [
    {name:"Agree", class: "agree"},
    {name:"Disagree", class: "disagree"},
    {name:"Not sure", class:"not-sure" },
    ]
  };
  // options
  roundDomains: boolean = true;
  showDataLabel: boolean = true;
  showXAxis: boolean = false;
  showYAxis: boolean = false;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Tags';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Count';
  view = "";

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  @Output() filterTagEvent = new EventEmitter<string>();
  constructor() {
  
  }
  ngOnInit() {
    console.log('BAR CHART', this.data);
    
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    this.filterTagEvent.emit(this.tagTypesId[data.name]);
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
//   onResize(event) {
//     this.view = [event.target.innerWidth / 1.35, 400];
// }

}
