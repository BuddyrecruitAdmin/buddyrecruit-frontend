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
export class LocationService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('LocationService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.LOCATION_LIST, { criteria });
  }

  create(item: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.LOCATION_CREATE, item);
  }

  edit(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id,
      name: item.name,
      active: item.active,
      address: item.address,
      isDefault: item.isDefault
    }
    return this.post(API_ENDPOINT.CONFIGURATION.LOCATION_EDIT, body);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.LOCATION_DELETE, body);
  }
}
