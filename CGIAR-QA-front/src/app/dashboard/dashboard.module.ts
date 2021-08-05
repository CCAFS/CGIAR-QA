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
import { ChartsModule, ThemeService } from 'ng2-charts';
import { SharedModule } from '../shared-module/shared-module.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
    IgxDoughnutChartModule,
    IgxPieChartModule,
    IgxRingSeriesModule,
    IgxDataChartCoreModule,
    IgxDataChartCategoryModule,
    IgxLegendModule,
    IgxDataChartInteractivityModule,
    IgxDataChartVerticalCategoryCoreModule,
    IgxDataChartVerticalCategoryModule,
    IgxDataChartStackedModule,
    IgxStackedFragmentSeriesModule,
    IgxDataChartAnnotationModule

} from "igniteui-angular-charts";

import { BarChartComponent } from './assesor-dashboard/bar-chart/bar-chart.component';
import { DoughnutChartComponent } from './assesor-dashboard/doughnut-chart/doughnut-chart.component';
import { DonutChartComponent } from './assesor-dashboard/donut-chart/donut-chart.component';
import { LineChartComponent } from './assesor-dashboard/line-chart/line-chart.component';
import { TimelineComponent } from '../_shared/timeline/timeline.component';

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
        ChartsModule,
        IgxDoughnutChartModule,
        IgxPieChartModule,
        IgxRingSeriesModule,
        IgxDataChartCoreModule,
        IgxDataChartCategoryModule,
        IgxLegendModule,
        IgxDataChartInteractivityModule,
        IgxDataChartVerticalCategoryCoreModule,
        IgxDataChartVerticalCategoryModule,
        IgxDataChartStackedModule,
        IgxStackedFragmentSeriesModule,
        IgxDataChartAnnotationModule,
        NgbModule
    ],
    declarations: [
        AssessorDashboardComponent,
        AdminDashboardComponent, 
        DashBoardComponent,
        BarChartComponent, 
        DoughnutChartComponent,
        LineChartComponent, 
        DonutChartComponent,
        TimelineComponent
    ],
    providers: [ThemeService]

})
export class DashboardModule { }
