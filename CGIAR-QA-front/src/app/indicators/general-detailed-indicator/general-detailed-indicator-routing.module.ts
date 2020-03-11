import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../_helpers/auth.guard';
import { Role } from '../../_models/roles.model';

import {} from './general-detailed-indicator.module';
import { GeneralDetailedIndicatorComponent } from './general-detailed-indicator.component';


const routes: Routes = [
    {
        path: '',
        component: GeneralDetailedIndicatorComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.asesor, Role.admin] },
    },
    // {
    //     path: 'detail/:indicatorId',
    //     canActivate: [AuthGuard],
    //     data: { roles: [Role.asesor, Role.admin] },
    //     component: GeneralDetailedIndicatorComponent
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneralDetailedIndicatorRoutingModule { }

