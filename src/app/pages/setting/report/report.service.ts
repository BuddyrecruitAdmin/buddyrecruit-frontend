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
export class ReportService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ReportService', httpClient, errorHandler);
  }

  getMasterList(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    }
    return this.post(API_ENDPOINT.CONFIGURATION.REPORT_MASTER, body);
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany && refCompany._id
      },
      criteria: criteria
    }
    return this.post(API_ENDPOINT.CONFIGURATION.REPORT_LIST, body);
  }

  create(item: any): Observable<ApiResponse> {
    const body = {
      name: item.name,
      code: item.code,
      isFree: item.isFree,
      price: item.price,
    }
    return this.post(API_ENDPOINT.CONFIGURATION.REPORT_CREATE, body);
  }

  edit(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.REPORT_EDIT, request);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.REPORT_DELETE, body);
  }
}
