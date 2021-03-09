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
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = false;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Tags';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Count';

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
    this.filterTagEvent.emit('2');
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
