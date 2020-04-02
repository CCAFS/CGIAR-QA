import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { OrderModule } from 'ngx-order-pipe';

import { CRPRoutingModule } from './crp-routing.module';
import { CrpComponent } from './crp.component';
import { CrpDashboardComponent } from './crp-dashboard/crp-dashboard.component';
import { CRPIndicatorsComponent } from './crp-indicators/indicators.component';
import { DetailIndicatorComponent } from './detail-indicator/detail-indicator.component';



@NgModule({
  imports: [
    CommonModule,
    CRPRoutingModule,
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    NgxSpinnerModule,
    OrderModule,
    ReactiveFormsModule
  ],
  declarations: [CrpComponent, CrpDashboardComponent, /*CRPIndicatorsComponent, DetailIndicatorComponent*/]
})
export class CrpModule { }
