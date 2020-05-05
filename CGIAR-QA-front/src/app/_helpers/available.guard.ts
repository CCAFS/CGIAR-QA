import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


import { AuthenticationService } from './../services/authentication.service'
import { Role } from "../_models/roles.model"
import { CookiesService } from '../services/cookie-service.service';


@Injectable({
  providedIn: 'root'
})
export class AvailableGuard implements CanActivate {
  constructor(
    private router: Router,
    private cookiesService: CookiesService,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authenticationService.currentUserValue;
    let current_indicator = state.url.split('/')[2];
    let user_indicators = JSON.parse(localStorage.getItem('indicators'));
    let meta_indicators;
    if (user_indicators) {
      meta_indicators = user_indicators.map(indi => {
        return indi.indicator
      })

    }
    if (currentUser) {
      let isAdmin = currentUser.roles.map(role => { return role ? role['description'] : null }).find(role => { return role === Role.admin });
      let isAssessor = currentUser.roles.map(role => { return role ? role['description'] : null }).find(role => { return role === Role.asesor });
      let found = isAdmin ? null : meta_indicators.find(meta => { return meta.name.toLocaleLowerCase() == current_indicator });
      if (isAdmin === Role.admin) return true;
      if (isAssessor === Role.asesor && found.comment_meta.enable_assessor) {
        return true
      } else {
        //this._location.back();
        this.router.navigate(['/dashboard/assessor']);
        return false;
      }
    }


    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url.toString() } });
    return false;
  }
  // canActivateChild(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  //   return true;
  // }
}
