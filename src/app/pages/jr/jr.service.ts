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
export class JrService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('JrService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      },
      criteria: criteria
    }
    return this.post(API_ENDPOINT.JOBREQUEST.LIST, body);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.JOBREQUEST.DELETE, body);
  }

  create(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBREQUEST.CREATE, request);
  }

  getDetail(_id: any) {
    const body = {
      _id: _id
    }
    return this.post(API_ENDPOINT.JOBREQUEST.DETAIL, body);
  }

  edit(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBREQUEST.EDIT, request);
  }

  action(action: any, item: any): Observable<ApiResponse> {
    // const body = {
    //   _id: item._id,
    //   action: action,
    //   refRejection: item.refRejection
    // }
    return this.post(API_ENDPOINT.JOBREQUEST.ACTION, { action, item });
  }

  getJopPositionList(action: any = "notUsed"): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBDESCRIPTION.LIST, { action });
  }

}
