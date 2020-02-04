import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
// import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
// import { AssesorDashboardComponent } from './dashboard/assesor-dashboard/assesor-dashboard.component'


import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/roles.model';



const routes: Routes = [
  // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.admin] }
  },
  
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
  },

  { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
