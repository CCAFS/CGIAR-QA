import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { User } from './../_models/user.model';
import { CookiesService } from './cookie-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public userHeaders =[];
  public NOT_APPLICABLE = '<Not applicable>';

  private usrCookie = 'currentUser';
  Tawk_LoadStart = new Date();

  constructor(private http: HttpClient, private cookiesService: CookiesService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.usrCookie)));
    // this.currentUserSubject = new BehaviorSubject<User>(this.cookiesService.getData(this.usrCookie));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username, password) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(map(user => {
        let currentUsr = this.parseIndicators(user.data)
        delete currentUsr.password
        this.userHeaders = user.data.indicators;


        localStorage.setItem(this.usrCookie, JSON.stringify(currentUsr))


        // this.cookiesService.setData(this.usrCookie, currentUsr);
        /** add user to tawk to **/
        this.setLoggedUser(currentUsr)
        this.currentUserSubject.next(currentUsr);
        return currentUsr;
      }));
  }

  tokenLogin(params: {}) {
    return this.http.post<any>(`${environment.apiUrl}/auth/token/login`, params)
      .pipe(map(user => {
        this.parseMultipleCRP(user.data, params['crp_id'])
        let currentUsr = this.parseIndicators(user.data);
        delete currentUsr.password
        this.userHeaders = user.data.indicators;

        localStorage.setItem(this.usrCookie, JSON.stringify(currentUsr))


        // this.cookiesService.setData(this.usrCookie, currentUsr);
        /** add user to tawk to **/
        this.setLoggedUser(currentUsr);
        this.currentUserSubject.next(currentUsr);
        return currentUsr;
      }));
  }



  setLoggedUser(user) {
    if (window.hasOwnProperty('Tawk_API')) {
      if (window['Tawk_API'].isVisitorEngaged()) window['Tawk_API'].endChat();
      window['Tawk_API'].setAttributes({
        name: user.username,
        email: user.email
      }, function (error) {
        console.log(error)
      });
    }
  }

  logout() {
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
    // remove user from local storage and set current user to null
    localStorage.removeItem('indicators');
    localStorage.removeItem(this.usrCookie);
    this.cookiesService.delete(this.usrCookie);
    this.currentUserSubject.next(null);
  }

  private parseIndicators(user) {
    if (user.hasOwnProperty('indicators') && user.indicators.length > 0) {
      user.indicators.forEach(element => {
        delete element.indicator.meta
      });
      localStorage.setItem('indicators', JSON.stringify(user.indicators));
      // console.log(JSON.parse(localStorage.getItem('indicators')))
      delete user.indicators;
    }
    return user
  }


  private parseMultipleCRP(user, crp_id?) {
    if (user.crps.length > 0) {
      // console.log(user.crps, user.crps.find(crp => crp.crp_id == crp_id))
      user.crp = user.crps.find(crp => crp.crp_id == crp_id)
    }
  }
}
