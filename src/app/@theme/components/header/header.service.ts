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
export class HeaderService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('HeaderService', httpClient, errorHandler);
  }

  checkNew(): Observable<ApiResponse> {
    const body = {
    };
    return this.post(API_ENDPOINT.USERS.NOTIFICATION.CHECK_NEW, body);
  }

  getNotification(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    };
    return this.post(API_ENDPOINT.USERS.NOTIFICATION.LIST, body);
  }

  markAsRead(ids: any): Observable<ApiResponse> {
    const body = {
      ids: ids
    };
    return this.post(API_ENDPOINT.USERS.NOTIFICATION.MARK_AS_READ, body);
  }

  markAsSeen(): Observable<ApiResponse> {
    const body = {
    };
    return this.post(API_ENDPOINT.USERS.NOTIFICATION.MARK_AS_SEEN, body);
  }
}
