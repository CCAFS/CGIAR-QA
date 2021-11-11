import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {
  allOrderTypes = {
    orderByStatus: null,
    orderByAcceptedWC: null,
    orderByDisagree: null,
    orderByClarification: null,
  }
  pageList = {
    qa_policies: 1,
    qa_innovations: 1,
    qa_publications: 1,
    qa_oicr: 1,
    qa_melia: 1,
    qa_capdev: 1,
    qa_milestones: 1,
    qa_slo: 1,
    qa_aiccra_indicators_contrib: 1
  }
  constructor(private http: HttpClient) { }

  // get indicators by user
  getIndicatorsByUser(id, crp_id?) {
    return this.http.get<any>(`${environment.apiUrl}/indicator/user/${id}?crp_id=${crp_id}`);
  }
  // update indicators by user
  updateIndicatorsByUser(id, params) {
    return this.http.patch<any>(`${environment.apiUrl}/indicator/${id}/user`, params);
  }
  //get all indicators
  getIndicators() {
    return this.http.get<any>(`${environment.apiUrl}/indicator/`);
  }
  getCurrentOrder() {
    for (const key in this.allOrderTypes) {
      if(this.allOrderTypes[key] != null)
      return {type: key, value: this.allOrderTypes[key]};
    }
    return {type: null, value: null};
  }
  getOrderByStatus() {
    return this.allOrderTypes['orderByStatus'];
  }
  getOrderByAcceptedWC() {
    return this.allOrderTypes['orderByAcceptedWC'];
  }
  getOrderByDisagree() {
    return this.allOrderTypes['orderByDisagree'];
  }
  getOrderByClarification() {
    return this.allOrderTypes['orderByClarification'];
  }

  cleanAllOrders() {
    for (const key in this.allOrderTypes) {
      this.allOrderTypes[key] = null;
    }
  }
  setOrderByStatus(value: boolean) {
    this.cleanAllOrders();
    this.allOrderTypes['orderByStatus'] = value;
  }
  setOrderByAccpetedWC(value: boolean) {
    this.cleanAllOrders();
    this.allOrderTypes['orderByAcceptedWC'] = value;
  }
  setOrderByDisagree(value: boolean) {
    this.cleanAllOrders();
    this.allOrderTypes['orderByDisagree'] = value;
  }
  setOrderByClarification(value: boolean) {
    this.cleanAllOrders();
    this.allOrderTypes['orderByClarification'] = value;
  }

  getItemStatusByIndicator(indicator_name, crp_id?) {
    return this.http.get<any>(`${environment.apiUrl}/indicator/items/${indicator_name}?crp_id=${crp_id}`);
  }

  getAllItemStatusByIndicator() {
    return this.http.get<any>(`${environment.apiUrl}/indicator/items`);
  }

  formatItemStatusByIndicator(obj) {
    let response = [];
    if (obj) {
      for (const key in obj) {
        response.push(Object.assign({ item: key, approved_without_comment: 0, assessment_with_comments: 0, pending: 0 }, obj[key]));
      }
      console.log(response);
    }

    // console.log(response);
    return response;
  }
  formatAllItemStatusByIndicator(allItems) {
    if (allItems) {
      for (const key in allItems) {
        allItems[key] = Object.values(allItems[key]);
      }
    }
    return allItems;
  }

  getPageList(indicator) {
    return this.pageList[indicator];
  }

  setPageList(page, indicator) {
    this.pageList[indicator] = page;
  }

  getPagesIndicatorList() {
    return this.pageList;
  }
  setFullPageList(pages) {
    this.pageList = pages;
  }
}
