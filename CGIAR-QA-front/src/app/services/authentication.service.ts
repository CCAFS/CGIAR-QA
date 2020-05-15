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
  public userHeaders = [];
  public NOT_APPLICABLE = '<Not applicable>';

  private usrCookie = 'currentUser';
  Tawk_LoadStart = new Date();

  constructor(private http: HttpClient, private cookiesService: CookiesService) {
    this.currentUserSubject = new BehaviorSubject<User>(this.cookiesService.getData(this.usrCookie));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username, password) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(map(user => {
        let currentUsr = this.parseIndicators(user.data)
        // this.userHeaders = user.data.indicators;
        //delete currentUsr.indicators;
        this.cookiesService.setData(this.usrCookie, currentUsr);
        this.currentUserSubject.next(currentUsr);
        return currentUsr;
      }));
  }

  tokenLogin(parmas: {}) {
    return this.http.post<any>(`${environment.apiUrl}/auth/token/login`, parmas)
      .pipe(map(user => {
        let currentUsr = this.parseIndicators(user.data)
        //delete currentUsr.indicators;
        this.cookiesService.setData(this.usrCookie, currentUsr);
        this.currentUserSubject.next(currentUsr);
        return currentUsr;
      }));
  }

  logout() {

    // remove user from local storage and set current user to null
    localStorage.removeItem('indicators');
    this.cookiesService.delete(this.usrCookie);
    this.currentUserSubject.next(null);
    console.log(localStorage.getItem('indicators'), this.cookiesService.getAllData(), this.currentUser)
  }

  private parseIndicators(user) {
    if (user.indicators.length > 0) {
      user.indicators.forEach(element => {
        delete element.indicator.meta
      });
      localStorage.setItem('indicators', JSON.stringify(user.indicators));
      delete user.indicators;
    }
    return user
  }

}
