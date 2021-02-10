import { Component, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { ChartSeriesEventArgs, IgxCategoryToolTipLayerComponent, IgxCategoryXAxisComponent, IgxDataChartComponent, IgxItemToolTipLayerComponent, IgxNumericYAxisComponent } from 'igniteui-angular-charts';


import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {




  public brushes: any = [ '#5081ab','#f3da90', '#ed8b84', '#59ed9c',];

  @Input() data: any;


  public showDefaultTooltip: boolean = true;
  public showItemTooltipLayer: boolean = false;
  public showCategoryTooltipLayer: boolean = false;

  public itemTooltipLayer: IgxItemToolTipLayerComponent;
  public categoryTooltipLayer: IgxCategoryToolTipLayerComponent;

  public set toolTipType(val: string) {
    const oldValue = this._toolTipType;
    this._toolTipType = val;
    if (oldValue !== val) {
      this.onTooltipTypeChanged();
    }
  }
  public get toolTipType(): string {
    return this._toolTipType;
  }

  @ViewChild("chart", { static: true })
  public chart: IgxDataChartComponent;

  @ViewChild("xAxis", { static: true })
  public xAxis: IgxCategoryXAxisComponent;

  @ViewChild("yAxis", { static: true })
  public yAxis: IgxNumericYAxisComponent;

  private _toolTipType: string = "Default";

  constructor() {
    // this.initData();

    this.itemTooltipLayer = new IgxItemToolTipLayerComponent();
    this.categoryTooltipLayer = new IgxCategoryToolTipLayerComponent();
  }

  ngOnInit() {
    console.log(this.data);
    
  }

  public initData() {
    this.data = [
      { Year: "Tags",  Seen: 195, NotSure: 90, Disagree: 50, Agree: 148 },
    ];
  }

  public onTooltipTypeChanged() {
    switch (this.toolTipType) {
      case "Default": {
        this.chart.series.remove(this.itemTooltipLayer);
        this.chart.series.remove(this.categoryTooltipLayer);
        break;
      }
      case "Item": {
        this.chart.series.remove(this.categoryTooltipLayer);
        this.chart.series.add(this.itemTooltipLayer);
        break;
      }
      case "Category": {
        this.chart.series.remove(this.itemTooltipLayer);
        this.chart.series.add(this.categoryTooltipLayer);
        break;
      }
    }
  }

  public clickTag(sender: any, args: ChartSeriesEventArgs) {
    console.log(sender, args, 'CLICK TAG');

  }

}
