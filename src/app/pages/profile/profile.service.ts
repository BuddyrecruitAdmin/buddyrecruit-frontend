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
export class ProfileService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ProfileService', httpClient, errorHandler);
  }

  // getList(criteria: any = undefined): Observable<ApiResponse> {
  //   return this.post(API_ENDPOINT.CONFIGURATION.USER_LIST, { criteria });
  // }

  // create(item: any): Observable<ApiResponse> {
  //   const body = {
  //     name: item.name
  //   }
  //   return this.post(API_ENDPOINT.CONFIGURATION.USER_CREATE, body);
  // }

  edit(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id,
      firstname: item.firstname,
      lastname: item.lastname,
      notifyEmail: item.notifyEmail,
      passwordCur: item.passwordCur,
      passwordNew: item.passwordNew,
      setting : item.setting


    }
    return this.post(API_ENDPOINT.CONFIGURATION.USER_PROFILE_EDIT, body);
  }
  getProfile(_id: any): Observable<ApiResponse> {
    const body = {
      _id: _id,
    }
    return this.post(API_ENDPOINT.CONFIGURATION.USER_PROFILE, body);
  }

  // deleteItem(item: any): Observable<ApiResponse> {
  //   const body = {
  //     _id: item._id
  //   }
  //   return this.post(API_ENDPOINT.CONFIGURATION.POSITION_DELETE, body);
  // }
}
