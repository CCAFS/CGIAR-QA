import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_helpers/auth.guard';
import { AvailableGuard } from '../_helpers/available.guard';
import { Role } from '../_models/roles.model';

import { IndicatorsComponent } from './indicators.component';
import { GeneralDetailedIndicatorComponent } from './general-detailed-indicator/general-detailed-indicator.component';


const routes: Routes = [
    {
        path: '',
        component: IndicatorsComponent,
        canActivate: [AuthGuard, AvailableGuard],
        data: { roles: [Role.asesor, Role.admin] }, 
        // pathMatch: 'full'
    },
    {
        path: 'detail/:indicatorId',
        loadChildren: () => import('./general-detailed-indicator/general-detailed-indicator.module').then(mod => mod.GeneralDetailedIndicatorModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndicatorsRoutingModule { }

