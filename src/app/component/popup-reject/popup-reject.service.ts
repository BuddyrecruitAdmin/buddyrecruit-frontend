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
export class PopupRejectService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('PopupRejectService', httpClient, errorHandler);
  }

  getList(): Observable<ApiResponse> {
    const body = {
    };
    return this.post(API_ENDPOINT.CONFIGURATION.REJECT_STAGE_LIST, body);
  }

}
