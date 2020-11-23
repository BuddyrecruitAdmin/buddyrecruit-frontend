import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../../shared/services/network.service';
import { HttpErrorHandler } from '../../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../../shared/interfaces/common.interface';
import { API_ENDPOINT } from "../../../shared/constants";

@Injectable({
  providedIn: "root"
})
export class LocationService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('LocationService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined, types: any = '', provicnes: any = ''): Observable<ApiResponse> {
    var path = (criteria) ? `?keyword=${criteria.keyword}&skip=${criteria.skip}&limit=${criteria.limit}&provinces=${criteria.filters[0].value}&types=${criteria.filters[1].value}` : `?types=${types}&provinces=${provicnes}`
    return this.get(API_ENDPOINT.CONFIGURATION.LOCATION_LIST, path);
  }

  getLocationType(branches: any = '', provinces: any = ''): Observable<ApiResponse> {
    var path = undefined;
    // if (provinces) {
    path = `?province=${provinces}&branches=${branches}`
    // }
    return this.get(API_ENDPOINT.CONFIGURATION.LOCATION_TYPE, path);
  }

  getProvincesType(branches: any = '', types: any = ''): Observable<ApiResponse> {
    var path = `?branches=${branches}&types=${types}`
    return this.get(API_ENDPOINT.CONFIGURATION.LOCATION_PROVINCES, path);
  }

  create(item: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.LOCATION_CREATE, item);
  }

  edit(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id,
      nickname: item.nickname
    }
    return this.patch(API_ENDPOINT.CONFIGURATION.LOCATION_EDIT, body);
  }

}
