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
  @Input() isModal;

  interval = 10;
  markersType = "Circle";
  maxY;
  public brushes: any = ['#59ed9cff', '#f3da90ff', '#ed8b84ff'];
  public calloutDataSource : any[];
  toggleChart = true;
    
    constructor(private indicatorService: IndicatorsService) {

   }

  ngOnInit() {
    console.log('LineChartData',this.data);
    this.interval = this.data.length / 10;
    console.log(this.interval,this.data.length);
    this.calculateInterval();

    this.calloutDataSource = [];

    for (let i = 0; i < this.data.length; i++) {
        const info = this.data[i];

        info.PendingMarker = info.pending == 0? null : info.pending / 2;
        info.ApprovedMarker = info.approved_without_comment == 0? null: info.pending + (info.approved_without_comment / 2);
        info.CommentMarker = info.assessment_with_comments == 0? null: info.pending + info.approved_without_comment + (info.assessment_with_comments / 2);
        info.Sum = info.pending + info.approved_without_comment + info.assessment_with_comments;

        this.calloutDataSource.push({ X: i, Y: info.Sum, Label: info.Sum.toString()});
    }
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

public getMarker() : any {
  let style = { text: "black" };
  const size = 12;

  return {
      measure: function (measureInfo) {
          const data = measureInfo.data;
          const context = measureInfo.context;
          let value = "0.00";
          let item = data.item;
          if (item != null) {
              value = item.pending.toString();
          }
          const height = context.measureText("M").width;
          const width = context.measureText(value).width;
          measureInfo.width = width;
          measureInfo.height = height + size;
      },
      render: function (renderInfo) {
          const item = renderInfo.data.item;
          const series = renderInfo.data.series;

          const valuePath = series.valueColumn.propertyName;

          var value = 0;

          switch (valuePath) {
              case "PendingMarker":
                  value = item.pending;
                  break;
              case "ApprovedMarker":
                  value = item.approved_without_comment;
                  break;
              case "CommentMarker":
                  value = item.assessment_with_comments;
                  break;
          }

          const ctx = renderInfo.context;
          let x = renderInfo.xPosition;
          let y = renderInfo.yPosition;

          if (renderInfo.isHitTestRender) {
              ctx.fillStyle = renderInfo.data.actualItemBrush.fill;

              let width = renderInfo.availableWidth;
              let height = renderInfo.availableHeight;

              ctx.fillRect(x - (width / 2), y - (height), renderInfo.availableWidth, renderInfo.availableHeight);
              return;
          }

          let xOffset = 18;
          let yOffset = 10;

          ctx.font = '8pt Verdana';
          ctx.textBaseline = 'top';
          ctx.fillStyle = style.text;

          if (value > 100) {
              xOffset = 24;
          }

          ctx.fillText(value, x - (xOffset / 2), y - (yOffset / 2));

      }
  }
}
switchCharts(){
  this.toggleChart = !this.toggleChart;
}

}
