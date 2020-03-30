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
  getCommentCRPStats(params){
    return this.http.get<any>(`${environment.apiUrl}/comment/?crp_id=${params.crp_id}&id=${params.id}`)
  }
}
