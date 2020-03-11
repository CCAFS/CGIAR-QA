import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { OrderPipe } from 'ngx-order-pipe';

import { DashboardService } from "../services/dashboard.service";
import { AuthenticationService } from "../services/authentication.service";
import { AlertService } from '../services/alert.service';

import { User } from '../_models/user.model';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss']
})
export class IndicatorsComponent implements OnInit {
  indicatorType: string;
  indicatorTypeName: string;
  evaluationList: any[];
  returnedArray: any[];
  currentUser: User;

  currentPage = 1;
  maxSize = 5;
  pageSize = 4;
  collectionSize = 0;

  order: string = 'id';
  configTemplate: string;
  reverse: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dashService: DashboardService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private orderPipe: OrderPipe,
    private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit() {
    this.indicatorType = this.route.snapshot.params.type;
    this.configTemplate = this.currentUser.config[`${this.indicatorType}_guideline`]
    this.indicatorTypeName = this.indicatorType.charAt(0).toUpperCase() + this.indicatorType.slice(1);
    this.getEvaluationsList(this.route.snapshot.params);
  }

  getEvaluationsList(params) {
    this.showSpinner();
    this.dashService.geListDashboardEvaluations(this.currentUser.id, `qa_${params.type}`, params.primary_column).subscribe(
      res => {
        this.evaluationList = res.data;
        // console.log(this.evaluationList)
        this.collectionSize = this.evaluationList.length;
        this.returnedArray = this.orderPipe.transform(this.evaluationList.slice(0, 10), 'id');
        this.hideSpinner();
      },
      error => {
        console.log("getEvaluationsList", error);
        this.hideSpinner();
        this.alertService.error(error);
      }
    )
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.evaluationList.slice(startItem, endItem);
  }


  setOrder(value: string) {
    if (value == null) {
      this.reverse = !this.reverse;
    } else {
      if (this.order === value) {
        this.reverse = !this.reverse;
      }

      this.order = value;
    }
  }


  goToView(indicatorId) {
    this.router.navigate(['detail', indicatorId], { relativeTo: this.route });
  }

  goToPDF(type: string) {
    let pdf_url;
    switch (type) {
      case 'AR':
        pdf_url = this.currentUser.config[0]["anual_report_guideline"];
        break;
      default:
        pdf_url = this.currentUser.config[0][`${type}_guideline`];
        break;
    }
    window.open(pdf_url, "_blank");
  }



  /***
   * 
   *  Spinner 
   * 
   ***/
  showSpinner() {
    this.spinner.show(undefined,
      {
        fullScreen: true,
        type: "ball-clip-rotate-multiple"
      }
    );
  }
  hideSpinner() {
    this.spinner.hide();
  }


}
