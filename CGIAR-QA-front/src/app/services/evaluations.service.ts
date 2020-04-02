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


  // get comment data for evaluation
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

   // get comment data for evaluation
   getDataCommentReply(params) {
    return this.http.get<any>(`${environment.apiUrl}/evaluation//${params.evaluationId}/detail/comment/${params.commentId}/replies`)
  }

}
