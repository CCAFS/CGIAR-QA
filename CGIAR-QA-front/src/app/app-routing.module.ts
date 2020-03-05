import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent } from './login/login.component';
// import { IndicatorsComponent } from './indicators/indicators.component';
// import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
// import { HomeComponent } from './home/home.component';
// import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
// import { asesorDashboardComponent } from './dashboard/asesor-dashboard/asesor-dashboard.component'


import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/roles.model';



const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
  },
  { path: 'indicator/:type/:primary_column', loadChildren: () => import('./indicators/indicators.module').then(mod => mod.IndicatorsModule) },
  // { path: 'indicator/:type', component: IndicatorsComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.asesor] } },
  { path: 'login', component: LoginComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
