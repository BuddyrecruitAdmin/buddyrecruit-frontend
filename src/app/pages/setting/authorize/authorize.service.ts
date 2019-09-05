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
export class AuthorizeService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('AuthorizeService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      },
      criteria: criteria
    };
    return this.post(API_ENDPOINT.CONFIGURATION.AUTH_LIST, body);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.AUTH_DELETE, body);
  }

  create(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.AUTH_CREATE, request);
  }

  getDetail(_id: any) {
    const body = {
      _id: _id
    };
    return this.post(API_ENDPOINT.CONFIGURATION.AUTH_DETAIL, body);
  }

  edit(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.AUTH_EDIT, request);
  }

  getDefaultList(refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      }
    };
    return this.post(API_ENDPOINT.CONFIGURATION.AUTH_GET_DEFAULT, body);
  }

  setDefault(_id: any, refHero: any): Observable<ApiResponse> {
    const request = {
      _id: _id,
      refHero: refHero
    };
    return this.post(API_ENDPOINT.CONFIGURATION.AUTH_SET_DEFAULT, request);
  }

  getHeroList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      },
      criteria: criteria
    };
    return this.post(API_ENDPOINT.HERO.LIST, body);
  }

}
