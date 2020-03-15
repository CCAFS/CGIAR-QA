import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EvaluationsService {

  constructor(private http: HttpClient) { }

  // get data for evaluation
  getDataEvaluation(id, params) {
    // this.http.get<any>(`${environment.apiUrl}/auth/login`, params)
    return this.http.post<any>(`${environment.apiUrl}/evaluation/${id}/detail`, params)
  }
}
