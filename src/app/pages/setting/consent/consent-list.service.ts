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

  getDetail(companyId: any = undefined): Observable<ApiResponse> {
    const body = {
      comId : companyId
    }
    return this.post(API_ENDPOINT.CONFIGURATION.CONSENT_DETAIL, body);
  }

  edit(_id: any, text: any): Observable<ApiResponse> {
    const body = {
      _id,
      text
    }
    return this.post(API_ENDPOINT.CONFIGURATION.CONSENT_EDIT, body);
  }

}
