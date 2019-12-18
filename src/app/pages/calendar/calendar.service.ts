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

  signInOutlookCalendar(): Observable<ApiResponse> {
    const body = {
      redirect_uri: 'http://localhost:4200/employer/calendar'
    }
    return this.signInOutlook(body);
  }

  checkTokenOutlookCalendar(username: any): Observable<ApiResponse> {
    const url = '';
    const body = {
      // username: username
      username: 'alex_cs_kku@hotmail.com'
    };
    return this.checkTokenOutlook(url, body);
  }

  getTokenOutlookCalendar(code): Observable<ApiResponse> {
    const body = {
      code: code,
      redirect_uri: 'http://localhost:4200/employer/calendar'
    };
    return this.getTokenOutlook(body);
  }

  getOutlookCalendars(token): Observable<ApiResponse> {
    const body = {
      token: token,
    };
    return this.getOutlookCalendar(body);
  }
}
