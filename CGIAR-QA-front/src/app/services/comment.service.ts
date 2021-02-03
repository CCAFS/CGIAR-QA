import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  // get comment stats by crp
  getCommentCRPStats(params) {
    return this.http.get<any>(`${environment.apiUrl}/comment/?crp_id=${params.crp_id}&id=${params.id}`)
  }


  // // get comment data for evaluation
  getDataComment(params) {
    return this.http.get<any>(`${environment.apiUrl}/evaluation/${params.evaluationId}/detail/comment/${params.metaId}`)
  }

  // create comment data for evaluation
  createDataComment(params) {
    return this.http.post<any>(`${environment.apiUrl}/evaluation/detail/comment`, params)
  }

  // update comment data for evaluation
  updateDataComment(params) {
    return this.http.patch<any>(`${environment.apiUrl}/evaluation/detail/comment`, params)
  }


  // create comment data for evaluation
  createDataCommentReply(params) {
    return this.http.post<any>(`${environment.apiUrl}/evaluation/detail/comment/reply`, params)
  }

  // update  reply for comment
  updateCommentReply(params) {
    return this.http.patch<any>(`${environment.apiUrl}/evaluation/detail/comment/reply`, params)
  }

  // get comment data for evaluation
  getDataCommentReply(params) {
    return this.http.get<any>(`${environment.apiUrl}/evaluation/${params.evaluationId}/detail/comment/${params.commentId}/replies`)
  }

  // get comments excel
  getCommentsExcel(params) {
    // return this.http.get(`${environment.apiUrl}/comment/excel/${params.evaluationId}?userId=${params.id}&name=${params.name}`, { responseType: HttpRequest })
    return this.http.get(`${environment.apiUrl}/comment/excel/${params.evaluationId}?userId=${params.id}&name=${params.name}&crp_id=${params.crp_id}&indicatorName=${params.indicatorName}`, { responseType: 'blob' as 'blob' })
  }
  
  // get comments excel
  getCommentsRawExcel(crp_id?) {
    // return this.http.get(`${environment.apiUrl}/comment/excel/${params.evaluationId}?userId=${params.id}&name=${params.name}`, { responseType: HttpRequest })
    return this.http.get(`${environment.apiUrl}/comment/excel-raw/${crp_id}`, { responseType: 'blob' as 'blob' })
  }


  // get comments raw data
  getRawComments(params) {
    return this.http.get<any>(`${environment.apiUrl}/comment/raw/${params.crp_id}`)
  }

  // get comments raw data
  getCycles() {
    return this.http.get<any>(`${environment.apiUrl}/comment/cycles`)
  }

  // update comments raw data
  updateCycle(params) {
    return this.http.patch<any>(`${environment.apiUrl}/comment/cycles/update`, params)
  }
  // get comments excel
  toggleApprovedNoComments(params, evaluationId) {
    return this.http.post(`${environment.apiUrl}/comment/approved/${evaluationId}`, params)
  }

    // create comment data for evaluation
    createTag(params) {
      return this.http.post<any>(`${environment.apiUrl}/evaluation/detail/comment/tag`, params)
    }

    // create comment data for evaluation
    deleteTag(id) {
      return this.http.delete<any>(`${environment.apiUrl}/evaluation/detail/comment/tag/${id}`)
    }

    getTagId(params) {
      return this.http.get<any>(`${environment.apiUrl}/evaluation/detail/comment/tag/${params.commentId}/${params.tagTypeId}/${params.userId}`)
    }

}
