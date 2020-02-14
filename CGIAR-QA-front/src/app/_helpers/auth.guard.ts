import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';

import { AuthenticationService } from './../services/authentication.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      let userRoles = currentUser.roles.map(role => { return role ? role['description'] : null });

      if (route.data.roles && route.data.roles.indexOf(userRoles[0]) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}