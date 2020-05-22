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
export class ConsentListService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ConsentListService', httpClient, errorHandler);
  }

  getDetail(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.CONSENT_DETAIL, { criteria });
  }

  edit(text: any): Observable<ApiResponse> {
    const body = {
      text
    }
    return this.post(API_ENDPOINT.CONFIGURATION.CONSENT_EDIT, body);
  }

}
