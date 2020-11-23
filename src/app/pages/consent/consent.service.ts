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
export class ConsentService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ConsentService', httpClient, errorHandler);
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
    return this.post(API_ENDPOINT.CONSENT.LIST, body);
  }

  getDetail(jrId: string, tabName: string, criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      jrId: jrId,
      tabName: tabName,
      criteria: criteria
    };
    return this.post(API_ENDPOINT.CONSENT.DETAIL, body);
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
