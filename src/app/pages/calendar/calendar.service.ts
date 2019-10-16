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
export class CalendarService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('CalendarService', httpClient, errorHandler);
  }

  getList(): Observable<ApiResponse> {
    const body = {
    };
    return this.post(API_ENDPOINT.USERS.CALENDAR.LIST, body);
  }

  getListByJR(jrId: any): Observable<ApiResponse> {
    const body = {
      jrId: jrId
    };
    return this.post(API_ENDPOINT.USERS.CALENDAR.BY_JR, body);
  }

  edit(data: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.USERS.CALENDAR.EDIT, data);
  }
}
