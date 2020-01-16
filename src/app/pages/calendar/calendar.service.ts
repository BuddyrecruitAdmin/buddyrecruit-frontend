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

  checkUsing(): Observable<ApiResponse> {
    const body = {
    };
    return this.post(API_ENDPOINT.USERS.CALENDAR.CHECK, body);
  }

  // OUTLOOK

  outlookLogin(username: string = ''): Observable<ApiResponse> {
    const body = {
      redirect_uri: window.location.href,
      username: username
    }
    return this.post(API_ENDPOINT.OUTLOOK.LOGIN, body);
  }

  outlookDecode(code: any): Observable<ApiResponse> {
    const href = window.location.href.split('?code')[0];
    const body = {
      code: code,
      redirect_uri: href
    };
    return this.post(API_ENDPOINT.OUTLOOK.DECODE, body);
  }

  outlookGetToken(username: any): Observable<ApiResponse> {
    const body = {
      username: username
    }
    return this.post(API_ENDPOINT.OUTLOOK.GET_TOKEN, body);
  }

  outlookGetCalendar(start, end): Observable<ApiResponse> {
    const body = {
      start: start,
      end: end,
    };
    return this.post(API_ENDPOINT.OUTLOOK.CALENDAR, body);
  }

  outlookGetUsers(): Observable<ApiResponse> {
    const body = {
    };
    return this.post(API_ENDPOINT.OUTLOOK.USERS, body);
  }

  // GOOGLE

  googleLogin(username: string = ''): Observable<ApiResponse> {
    const body = {
      redirect_uri: window.location.href,
      username: username
    }
    return this.post(API_ENDPOINT.GOOGLE.LOGIN, body);
  }

  googleDecode(code: any): Observable<ApiResponse> {
    const href = window.location.href.split('?code')[0];
    const body = {
      code: code,
      redirect_uri: href
    };
    return this.post(API_ENDPOINT.GOOGLE.DECODE, body);
  }

  googleGetToken(username: any): Observable<ApiResponse> {
    const body = {
      username: username
    }
    return this.post(API_ENDPOINT.GOOGLE.GET_TOKEN, body);
  }

  googleGetCalendar(start, end): Observable<ApiResponse> {
    const body = {
      start: start,
      end: end,
    };
    return this.post(API_ENDPOINT.GOOGLE.CALENDAR, body);
  }

  googleGetUsers(): Observable<ApiResponse> {
    const body = {
    };
    return this.post(API_ENDPOINT.GOOGLE.USERS, body);
  }

}
