import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../shared/services/network.service';
import { HttpErrorHandler } from '../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../shared/interfaces/common.interface';
import { API_ENDPOINT } from "../../shared/constants";
import { IApplicationForm } from './application-form.interface';

@Injectable({
  providedIn: "root"
})
export class ApplicationFormService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ApplicationFormService', httpClient, errorHandler);
  }

  getList(): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.APPLICATION_FORM.LIST, {});
  }

  getDetail(_id): Observable<ApiResponse> {
    const body = {
      _id: _id,
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.DETAIL, body);
  }

  create(request: IApplicationForm): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.APPLICATION_FORM.CREATE, request);
  }

  edit(request: IApplicationForm): Observable<ApiResponse> {
    const body = {
      appForm: request,
    };
    return this.post(API_ENDPOINT.APPLICATION_FORM.EDIT, { body });
  }

  deleteItem(_id: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.APPLICATION_FORM.DELETE, { _id: _id });
  }

  getTemplate(refTemplate): Observable<ApiResponse> {
    const body = {
      refTemplate: refTemplate
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.GET_TEMPLATE, body);
  }

  getJR(refCompany = undefined): Observable<ApiResponse> {
    const body = {
      refCompany: refCompany
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.JR_LIST, body);
  }

}