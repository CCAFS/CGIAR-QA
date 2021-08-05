import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  batches = [
  {
    currentBatch: moment(new Date(2021, 11, 1)).format('MMM-DD-YYYY'),
    startDateAssessors: moment(new Date(2021, 11, 6)).format('MMM-DD-YYYY'),
    endDateAssessors: moment(new Date(2021, 11, 10)).format('MMM-DD-YYYY'),
    startDateCRP: moment(new Date(2021, 11, 13)).format('MMM-DD-YYYY'),
    endDateCRP:moment(new Date(2021, 11, 17)).format('MMM-DD-YYYY'),
    nextBatch: moment(new Date(2022, 1, 2)).format('MMM-DD-YYYY')
  }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
