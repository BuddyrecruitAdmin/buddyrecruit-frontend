import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../../shared/services/network.service';
import { HttpErrorHandler } from '../../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../../shared/interfaces/common.interface';
import { API_ENDPOINT } from "../../../shared/constants";

@Injectable({
  providedIn: "root"
})
export class EvaluationService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('EvaluationService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      },
      criteria: criteria
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EVALUATION_LIST, body);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EVALUATION_DELETE, body);
  }

  create(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.EVALUATION_CREATE, request);
  }

  getDetail(_id: any) {
    const body = {
      _id: _id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EVALUATION_DETAIL, body);
  }

  edit(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.EVALUATION_EDIT, request);
  }

}
