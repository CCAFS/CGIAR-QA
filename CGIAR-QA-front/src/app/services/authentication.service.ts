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

  constructor(private http: HttpClient, private cookiesService: CookiesService) {
    // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.usrCookie)));
    this.currentUserSubject = new BehaviorSubject<User>(this.cookiesService.getData(this.usrCookie));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username, password) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(map(user => {
        let currentUsr = user.data
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem(this.usrCookie, JSON.stringify(currentUsr));
        this.cookiesService.setData(this.usrCookie, currentUsr);
        this.currentUserSubject.next(currentUsr);
        return currentUsr;
      }));
  }

  tokenLogin(parmas: {}) {
    return this.http.post<any>(`${environment.apiUrl}/auth/token/login`, parmas)
      .pipe(map(user => {
        let currentUsr = user.data
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem(this.usrCookie, JSON.stringify(currentUsr));
        this.cookiesService.setData(this.usrCookie, currentUsr);
        this.currentUserSubject.next(currentUsr);
        return currentUsr;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    // localStorage.removeItem(this.usrCookie);
    this.cookiesService.delete(this.usrCookie);
    this.currentUserSubject.next(null);
    console.log('logged out', localStorage)
  }
}
