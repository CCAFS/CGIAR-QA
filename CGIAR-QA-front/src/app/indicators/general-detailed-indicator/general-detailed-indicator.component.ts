import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EvaluationsService } from "../../services/evaluations.service";
import { AuthenticationService } from "../../services/authentication.service";
import { User } from '../../_models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert.service';



@Component({
  selector: 'app-general-detailed-indicator',
  templateUrl: './general-detailed-indicator.component.html',
  styleUrls: ['./general-detailed-indicator.component.scss']
})
export class GeneralDetailedIndicatorComponent implements OnInit {
  currentUser: User;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private evaluationService: EvaluationsService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
    // console.log(this.activeRoute.snapshot.params)
  }

  ngOnInit() {
    console.log('here')
  }

  getDetailedData(params) {
    this.evaluationService.getDataEvaluation(this.currentUser.id, this.activeRoute.snapshot.params).subscribe(
      res => { },
      error => {
        console.log("getEvaluationsList", error);
        this.hideSpinner();
        this.alertService.error(error);
      }
    )
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
