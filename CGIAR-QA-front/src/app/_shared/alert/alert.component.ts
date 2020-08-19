import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../services/alert.service';

@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getAlert()
      .subscribe(message => {
        // console.log(message)
        switch (message && message.type) {
          case 'success':
            message.cssClass = 'alert sticky alert-success';
            break;
          case 'error':
            message.cssClass = 'alert sticky alert-danger';
            break;
        }

        this.message = message;
      });
      
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}