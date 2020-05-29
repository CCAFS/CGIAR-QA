import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { QaCloseComponent } from './qa-close/qa-close.component';
import { ErrorComponent } from './error/404.component';



const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
    // pathMatch: 'full'
  },
  {
    path: 'crp',
    loadChildren: () => import('./crp/crp.module').then(mod => mod.CrpModule),
    
  },
  {
    path: 'indicator/:type/:primary_column', loadChildren: () => import('./indicators/indicators.module').then(mod => mod.IndicatorsModule)
  },
  { path: 'qa-close', component: QaCloseComponent },
  { path: 'login', component: LoginComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // otherwise redirect to home
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
