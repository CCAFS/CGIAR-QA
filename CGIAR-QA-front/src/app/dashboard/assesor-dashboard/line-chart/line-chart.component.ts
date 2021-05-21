import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { IndicatorsService } from 'src/app/services/indicators.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @Input() data;
  @Input() total;
  @Input() indicatorName;

  interval = 10;
  markersType = "Circle";
  maxY;
  public brushes: any = ['#59ed9cff', '#f3da90ff', '#ed8b84ff'];
  
    
    constructor(private indicatorService: IndicatorsService) {

   }

  ngOnInit() {
    console.log('LineChartData',this.data);
    this.interval = this.data.length / 10;
    console.log(this.interval,this.data.length);
    this.calculateInterval();
  }

  ngOnChanges(changes: SimpleChanges) {

    this.calculateInterval();
}

calculateInterval() {
  if(this.indicatorName != 'qa_publications'){
    this.maxY = this.total;
  } else {
    this.maxY = 0;
    this.data.forEach(field => {
      let maxComments = +field.pending;
      console.log(maxComments);
      
      this.maxY = maxComments > this.maxY ? maxComments : this.maxY;
    });
  }
  console.log(this.indicatorName);
  
  this.data.forEach(field => {
    let maxComments = +field.assessment_with_comments;
    console.log(maxComments);
    
    this.maxY = maxComments > this.maxY ? maxComments : this.maxY;
  });
  this.interval = Math.ceil(this.maxY / 10);
  if(this.interval < 1) this.interval = 1;
  console.log(this.interval);
}

}
