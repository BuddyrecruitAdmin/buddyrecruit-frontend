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
export class DashboardService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('DashboardService', httpClient, errorHandler);
  }

  getMasterList(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    }
    return this.post(API_ENDPOINT.CONFIGURATION.DASHBOARD_MASTER, body);
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany && refCompany._id
      },
      criteria: criteria
    }
    return this.post(API_ENDPOINT.CONFIGURATION.DASHBOARD_LIST, body);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.DASHBOARD_DELETE, body);
  }

  create(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.DASHBOARD_CREATE, request);
  }

  getDetail(_id: any) {
    const body = {
      _id: _id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.DASHBOARD_DETAIL, body);
  }

  edit(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.DASHBOARD_EDIT, request);
  }

}
