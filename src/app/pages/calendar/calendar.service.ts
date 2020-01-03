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

  getList(start = null, end = null): Observable<ApiResponse> {
    const body = {
      start: start,
      end: end
    };
    return this.post(API_ENDPOINT.USERS.CALENDAR.LIST, body);
  }

  getListByJR(jrId: any): Observable<ApiResponse> {
    const body = {
      jrId: jrId
    };
    return this.post(API_ENDPOINT.USERS.CALENDAR.BY_JR, body);
  }

  edit(body: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.USERS.CALENDAR.EDIT, body);
  }

  outlookLogin(): Observable<ApiResponse> {
    const body = {
      redirect_uri: window.location.href,
      username: ''
    }
    return this.post(API_ENDPOINT.USERS.CALENDAR.OUTLOOK.LOGIN, body);
  }

  outlookDecode(code: any): Observable<ApiResponse> {
    const body = {
      code: code,
      redirect_uri: window.location.href
    };
    return this.post(API_ENDPOINT.USERS.CALENDAR.OUTLOOK.DECODE, body);
  }

  outlookGetToken(username: any): Observable<ApiResponse> {
    const body = {
      username: username
    }
    return this.post(API_ENDPOINT.USERS.CALENDAR.OUTLOOK.GET_TOKEN, body);
  }

  outlookGetCalendar(start, end): Observable<ApiResponse> {
    const body = {
      start: start,
      end: end,
    };
    return this.post(API_ENDPOINT.USERS.CALENDAR.OUTLOOK.CALENDAR, body);
  }

}
