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
export class CompanyService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('CompanyService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.COMPANY_LIST, { criteria });
  }
  
  getListAdmin(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.USER_ADMIN, { criteria });
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.COMPANY_DELETE, body);
  }

  create(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.COMPANY_CREATE, request);
  }

  getDetail(id: any): Observable<ApiResponse> {
    const body = {
      _id: id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.COMPANY_DETAIL,  body );
  }

  update(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.COMPANY_EDIT, request);
  }
}
