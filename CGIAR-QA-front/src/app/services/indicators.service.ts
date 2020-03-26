import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {

  constructor(private http: HttpClient) { }

  // get indicators by user
  getIndicatorsByUser(id) {
    return this.http.get<any>(`${environment.apiUrl}/indicator/user/${id}`);
  }
  // update indicators by user
  updateIndicatorsByUser(id, params) {
    return this.http.patch<any>(`${environment.apiUrl}/indicator/${id}/user`, params);
  }
  //get all indicators
  getIndicators() {
    return this.http.get<any>(`${environment.apiUrl}/indicator/`);
  }
}
