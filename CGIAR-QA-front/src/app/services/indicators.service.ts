import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {

  constructor(private http: HttpClient) { }


  getIndicatorsByUser(id) {
    return this.http.get<any>(`${environment.apiUrl}/indicator/user/${id}`);
  }
  getIndicators() {
    return this.http.get<any>(`${environment.apiUrl}/indicator/`);
  }
}
