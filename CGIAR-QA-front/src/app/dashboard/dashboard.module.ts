import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { AssessorDashboardComponent } from './assesor-dashboard/assessor-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashBoardComponent } from './dashboard.component';

import { NgxSpinnerModule } from "ngx-spinner";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared-module/shared-module.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        BsDropdownModule.forRoot(),
        ProgressbarModule.forRoot(),
        ButtonsModule.forRoot(),
        CollapseModule.forRoot(),
        TooltipModule.forRoot(),
        NgxSpinnerModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        NgxChartsModule,
        NgbModule
    ],
    declarations: [AssessorDashboardComponent,  AdminDashboardComponent, DashBoardComponent],
    
})
export class DashboardModule { }
