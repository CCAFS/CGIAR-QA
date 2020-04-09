import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_helpers/auth.guard';
import { Role } from '../_models/roles.model';

import { AssessorDashboardComponent } from './assesor-dashboard/assessor-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashBoardComponent } from './dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: DashBoardComponent,
    children: [
      {
        path: 'assessor',
        canActivate: [AuthGuard],
        data: { roles: [Role.asesor] },
        component: AssessorDashboardComponent,
        pathMatch: 'full',
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: { roles: [Role.admin] },
        component: AdminDashboardComponent,
        pathMatch: 'full',
      },
    ],
  },
  // otherwise redirect to home
  // { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
