import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';

import { intersectionWith } from 'lodash';

import { AuthenticationService } from './../services/authentication.service'
import { GeneralStatus } from "../_models/general-status.model"
import { Role } from '../_models/roles.model';

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

      // console.log(this.validateConfig(currentUser)) 
      if (this.validateConfig(currentUser)) {
        this.router.navigate(['/qa-close']);
        return false;
      }
      if (this.validateCycle(currentUser)) {
        this.router.navigate(['/qa-close']);
        return false;
      }

      if (route.data.roles && route.data.roles.indexOf(userRoles[0]) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url.toString() } });
    return false;
  }

  private validateRole(available_roles: [], currentUser) {
    let userRoles = currentUser.roles.map(role => { return role ? role['description'] : null });
    let hasCRP = currentUser.crp ? true : false;
    let found = intersectionWith(available_roles, userRoles, (a, b) => a === b);
    return hasCRP ? hasCRP && found.length > 0 : found.length > 0
  }

  private validateConfig(currentUser) {
    if (!currentUser.config.length) return true;
    if (currentUser.config[0].status !== GeneralStatus.Close) return false;
    return false;
  }
  private validateCycle(currentUser) {
    let isAssessor = currentUser.roles.map(role => { return role ? role['description'] : null }).find(role => { return role === Role.asesor });
    // console.log('validateCycle',  isAdmin ? false : !currentUser.hasOwnProperty('cycle'));
    return isAssessor && !currentUser.hasOwnProperty('cycle') ? true : false;
  }
}
