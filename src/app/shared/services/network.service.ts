import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { ApiResponse } from '../interfaces/common.interface';
import { ResponseCode } from '../app.constants';
import * as authService from '../services/auth.service';
export const API_URI: string = environment.API_URI;

export type UrlParams = Map<string, string>;

export class NetworkService {
  protected _serviceName: string;
  protected _handleError: HandleError;

  constructor(
    serviceName: string,
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    this._serviceName = serviceName;
    this._handleError = errorHandler.createHandleError(this._serviceName);
  }

  protected get = (uri: string, criteria: any = undefined): Observable<ApiResponse> => {
    if (!criteria) {
      return this.httpClient.get<ApiResponse>(`${API_URI}/${uri}`, {
        headers: this.getHeaders(), observe: 'response', withCredentials: true
      }).pipe(
        map(response => {
          return {
            code: response.body.code,
            status: response.body.status,
            message: response.body.message,
            data: response.body.data || [],
            totalDataSize: response.body.totalDataSize
          };
        }),
        catchError(this._handleError('get', this.ErrorResponse()))
      );
    } else {
      return this.httpClient.get<ApiResponse>((criteria._id) ?
        `${API_URI}/${uri}?&_id=${criteria._id}`
        : `${API_URI}/${uri}${criteria}`
        , {
          headers: this.getHeaders(), observe: 'response', withCredentials: true
        }).pipe(
          map(response => {
            return {
              code: response.body.code,
              status: response.body.status,
              message: response.body.message,
              data: response.body.data || [],
              totalDataSize: response.body.totalDataSize
            };
          }),
          catchError(this._handleError('get', this.ErrorResponse()))
        );
    }
  }

  protected post = (uri: string, data: any): Observable<ApiResponse> => {
    return this.httpClient.post<ApiResponse>(`${API_URI}/${uri}`, data, {
      headers: this.getHeaders(), observe: 'response', withCredentials: true
    }).pipe(
      map(response => {
        return {
          code: response.body.code,
          status: response.body.status,
          message: response.body.message,
          data: response.body.data || [],
          filter: response.body.filter || [],
          totalDataSize: response.body.totalDataSize,
          count: response.body.count || undefined,
          isOverQuota: response.body.isOverQuota || false,
          done: response.body.done,
          startAt: response.body.startAt,
          usedTime: response.body.usedTime,
          isExpired: response.body.isExpired,
          jobType: response.body.jobType
        };
      }),
      catchError(this._handleError('post', this.ErrorResponse()))
    );
  }

  protected patch = (uri: string, data: any): Observable<ApiResponse> => {
    return this.httpClient.patch<ApiResponse>(`${API_URI}/${uri}`, data, {
      headers: this.getHeaders(), observe: 'response', withCredentials: true
    }).pipe(
      map(response => {
        return {
          code: response.body.code,
          status: response.body.status,
          message: response.body.message,
          data: response.body.data || [],
          filter: response.body.filter || [],
          totalDataSize: response.body.totalDataSize,
          count: response.body.count || undefined,
          isOverQuota: response.body.isOverQuota || false,
          done: response.body.done,
          startAt: response.body.startAt,
          usedTime: response.body.usedTime,
          isExpired: response.body.isExpired
        };
      }),
      catchError(this._handleError('post', this.ErrorResponse()))
    );
  }

  protected put = (uri: string, data: any): Observable<ApiResponse> => {
    return this.httpClient.put<ApiResponse>(`${API_URI}/${uri}`, data, {
      headers: this.getHeaders(), observe: 'response', withCredentials: true
    }).pipe(
      map(response => {
        return {
          code: response.body.code,
          status: response.body.status,
          message: response.body.message,
          data: response.body.data || []
        };
      }),
      catchError(this._handleError('put', this.ErrorResponse()))
    );
  }

  protected delete = (uri: string, _id: any = undefined): Observable<ApiResponse> => {
    return this.httpClient.delete<ApiResponse>((_id) ? `${API_URI}/${uri}/${_id}` : `${API_URI}/${uri}`, {
      headers: this.getHeaders(), observe: 'response', withCredentials: true
    }).pipe(
      map(response => {
        return {
          code: response.body.code,
          status: response.body.status,
          message: response.body.message,
          data: response.body.data || []
        };
      }),
      catchError(this._handleError('delete', this.ErrorResponse()))
    );
  }

  protected getNavigateUrl = (url: string, params: UrlParams) => {
    params.forEach((key: string, value: string) => {
      url = url.replace(`{${key}}`, value);
    });
    return url;
  }

  protected getFile = (uri: any): Observable<ApiResponse> => {
    let headers = new HttpHeaders();
    const authToken = authService.getToken();
    headers = headers.set('Accept', 'application/pdf');
    headers = headers.set('x-access-token', `${authToken}`);
    return this.httpClient.get<ApiResponse>(uri, {
      headers: headers, observe: 'response', withCredentials: true
    }).pipe(
      map(response => {
        console.log(response)
        return {
          code: response.body.code,
          status: response.body.status,
          message: response.body.message,
          data: response.body.data || [],
          headers: response.headers
        };
      }),
      catchError(this._handleError('get', this.ErrorResponse()))
    );
  }

  private getHeaders = (): HttpHeaders => {
    const authToken = authService.getToken();
    let headers: HttpHeaders;
    if (authToken) {
      headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        // .set('Authorization', `Bearer ${authToken}`);
        .set('Access-Control-Expose-Headers', '*')
        .set('x-access-token', `${authToken}`);
    } else {
      headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    }
    return headers;
  }

  protected ErrorResponse(): ApiResponse {
    return <ApiResponse>{
      data: undefined,
      code: 900,
      message: ''
    };
  }

  protected testPost = (uri: any, data: any): Observable<any> => {
    const headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(uri, data, {
      headers: headers, observe: 'response', withCredentials: true
    }).pipe(
      map(response => {
        return {
          data: response.body
        };
      }),
      catchError(this._handleError('post', this.ErrorResponse()))
    );
  }

}
