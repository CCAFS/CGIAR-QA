import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  // get dash data (evaluations) by user
  getDashboardEvaluations(id) {
    return this.http.get<any>(`${environment.apiUrl}/evaluation/${id}`);
  }


  /**
   * 
   * 
   * Admin Dashboard
   * 
   */


  // get all dash data (evaluations)
  getAllDashboardEvaluations(crp_id?) {
    let params = new HttpParams().set('crp_id', crp_id)
    return this.http.get<any>(`${environment.apiUrl}/evaluation`, { params });
  }
  //get all qa crps
  getCRPS() {
    return this.http.get<any>(`${environment.apiUrl}/evaluation/crp`);
  }

  //get indicators by crp
  getIndicatorsByCRP(){
    return this.http.get<any>(`${environment.apiUrl}/evaluation/crp/indicators`);
  }


  // group data
  groupData(data) {
    for (var property in data) {
      if (data.hasOwnProperty(property)) {
        const ele = data[property];
        ele['total'] = ele.reduce((sum, currentValue) => {
          return sum + parseInt(currentValue.value);
        }, 0);
      }
    }
    return (data);
  }
}
