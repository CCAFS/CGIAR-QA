import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { User } from './../_models/user.model';
import { CookiesService } from './cookie-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public userHeaders = [];
  public NOT_APPLICABLE = '<Not applicable>';
  public userIndicators;
  private usrCookie = 'currentUser';
  private crpUsrCookie = 'currentUserCRP';
  Tawk_LoadStart = new Date();

  constructor(private http: HttpClient, private cookiesService: CookiesService, private router: Router, private activedRoute: ActivatedRoute) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.usrCookie)));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): User {

    if (this.router.url.indexOf('crp') == 1) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.crpUsrCookie)));
      this.currentUser = this.currentUserSubject.asObservable();
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.usrCookie)));
      this.currentUser = this.currentUserSubject.asObservable();
    }


    return this.currentUserSubject.value;
  }

  login(username, password) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(map(user => {
        return this.setUserLogged(user.data);
      }));
  }

  // TO-DO
  tokenLogin(params: {}) {
    console.log('PARAMS TOKEN LOGIN', params);

    return this.http.post<any>(`${environment.apiUrl}/auth/token/login`, params)
      .pipe(map(user => {
        this.parseMultipleCRP(user.data, params['crp_id'])
        return this.setUserLogged(user.data);
      }));
  }

  private setUserLogged(user: User) {

    const cookieName = user.crp == null ? this.usrCookie : this.crpUsrCookie;

    let currentUsr = this.parseIndicators(user);
    delete currentUsr.password;
    this.userHeaders = user.indicators;
    this.markCyclesEnd(currentUsr);



    localStorage.setItem(cookieName, JSON.stringify(currentUsr));

    /** add user to tawk to **/
    this.setLoggedUserTawkTo(currentUsr);
    this.currentUserSubject.next(currentUsr);
    return currentUsr;
  }

  setLoggedUserTawkTo(user) {
    if (window.hasOwnProperty('Tawk_API')) {
      console.log('Tawk API EXISTS');
      
      if (window['Tawk_API'].isVisitorEngaged()) window['Tawk_API'].endChat();
      
      window['Tawk_API'].setAttributes({
        name: user.username,
        email: user.email
      }, function (error) {
        console.log(error)
      });
    } else {
      console.log('Tawk API DOES NOT EXISTS');

    }
  }

  logout() {
    this.logOutTawtkTo();

    // remove user from local storage and set current user to null
    localStorage.removeItem('indicators');
    localStorage.removeItem(this.usrCookie);
    localStorage.clear();
    this.cookiesService.delete(this.usrCookie);
    this.currentUserSubject.next(null);
  }

  private logOutTawtkTo() {
    console.log(window.hasOwnProperty('Tawk_API'))
    if (window.hasOwnProperty('Tawk_API')) {
      try {
        window['Tawk_API'].endChat();
      } catch (error) {
        console.log(error)
      }
      // if (window['Tawk_API'].isChatMaximized()) {
      // }
      window['Tawk_API'].visitor = {
        name: null,
        email: null
      };
    }
  }



  getBrowser() {

    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {

      return 'Opera';

    } else if (navigator.userAgent.indexOf("Chrome") != -1) {

      return 'Chrome';

    } else if (navigator.userAgent.indexOf("Safari") != -1) {

      return 'Safari';

    } else if (navigator.userAgent.indexOf("Firefox") != -1) {

      return 'Firefox';

    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document['documentMode'] == true)) {

      return 'IE';

    } else {

      return 'unknown';

    }

  }

  // validateCycles(item:{}, user:{}, type:string){
  //   let val;
  //   //if(!user.)

  // }




  parseIndicators(user) {
    if (user.hasOwnProperty('indicators') && user.indicators.length > 0) {
      user.indicators.forEach(element => {
        delete element.indicator.meta
      });
      localStorage.setItem('indicators', JSON.stringify(user.indicators));
      console.log('Indicadores actualizados');
    }
    return user
  }

  /**
   * For assessor indicators parsing
   * @param userIndicators 
   * @returns 
   */
  parseUpdateIndicators(userIndicators) {

    if (userIndicators.length > 0) {
      userIndicators.forEach(element => {
        delete element.indicator.meta
      });
      localStorage.setItem('indicators', JSON.stringify(userIndicators));
      console.log('Indicadores actualizados');

      // console.log(JSON.parse(localStorage.getItem('indicators')))
      delete userIndicators.indicators;
    }
    return userIndicators
  }


  parseMultipleCRP(user, crp_id?) {
    if (user.crps.length > 0) {
      // console.log(user.crps, user.crps.find(crp => crp.crp_id == crp_id))
      user.crp = user.crps.find(crp => crp.crp_id == crp_id)
    }
  }

  markCyclesEnd(user) {
    if (!user.hasOwnProperty('cycle')) {
      user.cycle_ended = true;
    }
  }




}
