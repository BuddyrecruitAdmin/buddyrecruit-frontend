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
export class BlogService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('BlogService', httpClient, errorHandler);
  }

  create(topic: any, src: any, description: any): Observable<ApiResponse> {
    const body = {
      topic,
      src,
      description
    }
    return this.post(API_ENDPOINT.BLOG.CREATE, body);
  }

  edit(_id: any, topic: any, src: any, description: any): Observable<ApiResponse> {
    const body = {
      _id,
      topic,
      src,
      description
    }
    return this.post(API_ENDPOINT.BLOG.CREATE, body);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    };
    return this.post(API_ENDPOINT.BLOG.LIST, body);
  }

  getDetail(_id: any): Observable<ApiResponse> {
    const body = {
      _id: _id
    };
    return this.post(API_ENDPOINT.BLOG.DETAIL, body);
  }

}
