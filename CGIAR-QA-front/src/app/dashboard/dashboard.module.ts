import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { AssesorDashboardComponent } from './assesor-dashboard/assesor-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ProgressbarModule.forRoot(),
        ButtonsModule.forRoot(),
        ReactiveFormsModule
    ],
    declarations: [AssesorDashboardComponent, AdminDashboardComponent]
})
export class DashboardModule { }
