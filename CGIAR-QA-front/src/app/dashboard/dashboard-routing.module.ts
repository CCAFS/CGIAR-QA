import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_helpers/auth.guard';
import { Role } from '../_models/roles.model';

import { AssessorDashboardComponent } from './assesor-dashboard/assessor-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CrpDashboardComponent } from '../crp/crp-dashboard/crp-dashboard.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'assessor',
        canActivate: [AuthGuard],
        data: { roles: [Role.asesor] },
        component: AssessorDashboardComponent
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: { roles: [Role.admin] },
        component: AdminDashboardComponent
      },
      // {
      //   path: 'crp',
      //   canActivate: [AuthGuard],
      //   data: { roles: [Role.crp] },
      //   component: CrpDashboardComponent
      // },
      // { path: 'indicator/:type', loadChildren: () => import(`./indicators/indicators.module`).then(m => m.IndicatorsModule) },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
