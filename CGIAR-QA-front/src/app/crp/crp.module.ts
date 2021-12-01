import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { OrderModule } from 'ngx-order-pipe';
import { ChartsModule } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { CRPRoutingModule } from './crp-routing.module';
import { CrpComponent } from './crp.component';
import { CrpDashboardComponent } from './crp-dashboard/crp-dashboard.component';

import { CommentComponentModule } from '../comment/comment.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatusChartComponent } from './crp-dashboard/status-chart/status-chart.component';
import { CommentsChartComponent } from './crp-dashboard/comments-chart/comments-chart.component';
import { TimelineComponent } from '../_shared/timeline/timeline.component';



@NgModule({
  imports: [
    CommonModule,
    CRPRoutingModule,
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    NgxSpinnerModule,
    OrderModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    CommentComponentModule,
    SharedModule,
    NgxChartsModule,
    ChartsModule
  ],
  declarations: [CrpComponent,
    CrpDashboardComponent,
    StatusChartComponent,
    CommentsChartComponent,
    // TimelineComponent
  ]
})
export class CrpModule { }
