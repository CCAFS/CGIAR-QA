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
    return this.http.post<any>(`${environment.apiUrl}/evaluation/${id}/detail`, params)
  }



  // update comment data for evaluation
  updateDataEvaluation(params, id) {
    return this.http.patch<any>(`${environment.apiUrl}/evaluation/${id}/detail/`, params)
  }
  // update require_second_assessment for evaluation
  updateRequireSecondAssessmentEvaluation(id, params) {
    return this.http.patch<any>(`${environment.apiUrl}/evaluation/${id}/detail/second_assessment`, params)
  }
  
  // get criteria by indicator
  getCriteriaByIndicator(id) {
    return this.http.get<any>(`${environment.apiUrl}/evaluation/indicator/${id}`)
  }

  // get assessors by indicator
  getAssessorsByEvaluation(id) {
    return this.http.get<any>(`${environment.apiUrl}/evaluation/${id}/assessors`)
  }
}
