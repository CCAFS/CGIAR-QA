import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_helpers/auth.guard';
import { Role } from '../_models/roles.model';

import { CrpDashboardComponent } from './crp-dashboard/crp-dashboard.component';
import { CrpComponent } from './crp.component';
import { CRPIndicatorsComponent } from './crp-indicators/indicators.component';


const routes: Routes = [
  {
    path: '',
    component: CrpComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        data: { roles: [Role.crp] },
        component: CrpDashboardComponent
      },
      {
        path: 'indicator/:type/:primary_column',
        canActivate: [AuthGuard],
        data: { roles: [Role.crp] },
        component: CRPIndicatorsComponent
      },

    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CRPRoutingModule { }
