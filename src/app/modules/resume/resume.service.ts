import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../shared/services/network.service';
import { HttpErrorHandler } from '../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../shared/interfaces/common.interface';
import { API_ENDPOINT } from "../../shared/constants";
import { IResume } from './resume.interface';

@Injectable({
  providedIn: "root"
})
export class ResumeService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ResumeService', httpClient, errorHandler);
  }

  getList(): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.RESUME.LIST, {});
  }

  getDetail(_id): Observable<ApiResponse> {
    const body = {
      _id: _id,
    }
    return this.post(API_ENDPOINT.RESUME.DETAIL, body);
  }

  create(request: IResume): Observable<ApiResponse> {
    const body = {
      resume: request,
    };
    return this.post(API_ENDPOINT.RESUME.CREATE, body);
  }

  edit(request: IResume): Observable<ApiResponse> {
    const body = {
      resume: request,
    };
    return this.post(API_ENDPOINT.RESUME.EDIT, { body });
  }

  deleteItem(_id: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.RESUME.DELETE, { _id: _id });
  }

}
