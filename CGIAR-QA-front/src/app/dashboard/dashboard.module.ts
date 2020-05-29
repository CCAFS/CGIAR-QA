import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { AssessorDashboardComponent } from './assesor-dashboard/assessor-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashBoardComponent } from './dashboard.component';

import { NgxSpinnerModule } from "ngx-spinner";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared-module/shared-module.module';


@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ProgressbarModule.forRoot(),
        ButtonsModule.forRoot(),
        CollapseModule.forRoot(),
        TooltipModule.forRoot(),
        NgxSpinnerModule,
        ReactiveFormsModule,
        SharedModule,
        // NgxChartsModule
    ],
    declarations: [AssessorDashboardComponent,  AdminDashboardComponent, DashBoardComponent],
    
})
export class DashboardModule { }
