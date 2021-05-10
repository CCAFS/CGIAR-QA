import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { IndicatorsService } from 'src/app/services/indicators.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @Input() data = [];
  interval = 10;
  markersType = "Circle";
  public brushes: any = ['#59ed9cff', '#f3da90ff', '#ed8b84ff'];
  
    
    constructor(private indicatorService: IndicatorsService) {

   }

  ngOnInit() {
    // console.log('LineChartData',this.data);
    this.interval = this.data.length / 10;
  }

}
