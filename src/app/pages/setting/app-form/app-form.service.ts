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
export class AppFormService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('AppFormService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    };
    return this.post(API_ENDPOINT.CONFIGURATION.APP_FORM.LIST, body);
  }

  getDetail(_id: any): Observable<ApiResponse> {
    const body = {
      _id: _id
    };
    return this.post(API_ENDPOINT.CONFIGURATION.APP_FORM.DETAIL, body);
  }

  create(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.APP_FORM.CREATE, request);
  }

  edit(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.APP_FORM.EDIT, request);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.APP_FORM.DELETE, body);
  }

  toggleActive(_id: any, active: boolean) {
    const body = {
      _id: _id,
      active: active
    };
    return this.post(API_ENDPOINT.CONFIGURATION.APP_FORM.TOGGLE_ACTIVE, body);
  }

  getJobPosition(): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.DROPDOWN.JOBPOSITION, {});
  }

  getActive(): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.APP_FORM.GET_ACTIVE, {});
  }

}
