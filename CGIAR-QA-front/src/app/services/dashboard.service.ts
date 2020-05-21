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

  // get list dash data (evaluations)
  geListDashboardEvaluations(id, view_name, view_primary_field, crp_id?) {
    let params = {
      'view_name': view_name,
      'view_primary_field': view_primary_field,
    }
    return this.http.post<any>(`${environment.apiUrl}/evaluation/${id}/list?crp_id=${crp_id}`, params);
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
  getIndicatorsByCRP() {
    return this.http.get<any>(`${environment.apiUrl}/evaluation/crp/indicators`);
  }

  sortProperties(obj) {
    // convert object into array
    var sortable = [];
    for (var key in obj)
      if (obj.hasOwnProperty(key))
        sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function (a, b) {
      return a[1] - b[1]; // compare numbers
    });

    let resp = {}
    for (let index = 0; index < sortable.length; index++) {
      const element = sortable[index];
      console.log(element, resp)
      resp[element[0]] = element[1]
    }

    console.log(resp)
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
  }
  // group data
  groupData(data) {
    for (var property in data) {
      if (data.hasOwnProperty(property)) {
        const ele = data[property];
        ele['total'] = ele.reduce((sum, currentValue) => {
          return sum + parseInt(currentValue.value);
        }, 0);
        ele['order'] = ele[0]['order'];
      }
    }
    // console.log(this.sortProperties(data))
    // console.log(data)
    return (data);
  }
}
