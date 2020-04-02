import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../_helpers/auth.guard';
import { Role } from '../../_models/roles.model';
import { DetailIndicatorComponent } from './detail-indicator.component';
import { CRPIndicatorsComponent } from '../crp-indicators/indicators.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        data: { roles: [Role.crp] },
        component: CRPIndicatorsComponent,
    },
    {
        path: 'detail/:indicatorId',
        component: DetailIndicatorComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetailIndicatorRoutingModule { }
