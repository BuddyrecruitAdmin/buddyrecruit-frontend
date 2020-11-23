import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../shared/services/network.service';
import { HttpErrorHandler } from '../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../shared/interfaces/common.interface';
import { API_ENDPOINT } from "../../shared/constants";

@Injectable({
  providedIn: "root"
})
export class TalentPoolService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('TalentPoolService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: {
        keyword: criteria.keyword,
        skip: criteria.skip,
        limit: criteria.limit,
        filters: {
          provinces: criteria.filters[0].value,
          types: criteria.filters[1].value,
          branchs: criteria.filters[2].value
        }
      }
    };
    return this.post(API_ENDPOINT.TALENT_POOL.LIST, body);
  }
  //  new 
  // getList(criteria: any = undefined): Observable<ApiResponse> {
  //   var path = `?keyword=${criteria.keyword}&skip=${criteria.skip}&limit=${criteria.limit}&provinces=${criteria.filters[0].value}&types=${criteria.filters[1].value}`
  //   return this.get(API_ENDPOINT.TALENT_POOL.LIST, path);
  // }
  getListUser(): Observable<ApiResponse> {
    return this.get(API_ENDPOINT.TALENT_POOL.USER);
  }

  getDetail(refStageId: string, jrId: string, tabName: string, criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      refStageId: refStageId,
      jrId: jrId,
      tabName: tabName,
      criteria: criteria
    };
    return this.post(API_ENDPOINT.TALENT_POOL.DETAIL, body);
  }

  buyCV(_id: any): Observable<ApiResponse> {
    const body = {
      _id: _id
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.BUY_CV, body);
  }

  sourceList(jrId: any): Observable<ApiResponse> {
    const body = {
      jrId: jrId
    };
    return this.post(API_ENDPOINT.TALENT_POOL.SOURCE, body);
  }

}
