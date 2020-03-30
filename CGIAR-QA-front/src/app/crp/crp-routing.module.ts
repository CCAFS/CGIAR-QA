import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_helpers/auth.guard';
import { Role } from '../_models/roles.model';
import { CrpDashboardComponent } from '../dashboard/crp-dashboard/crp-dashboard.component';


const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'dashboard',
          canActivate: [AuthGuard],
          data: { roles: [Role.asesor] },
          component: CrpDashboardComponent
        }
      ],
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CRPRoutingModule { }
  