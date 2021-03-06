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
export class RejectionService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('RejectionService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.REASONS_REJECT_LIST, { criteria });
  }

  create(item: any): Observable<ApiResponse> {
    const body = {
      name: item.name,
      candidateFlag: item.candidateFlag,
      point: item.point
    }
    return this.post(API_ENDPOINT.CONFIGURATION.REASONS_REJECT_CREATE, body);
  }

  edit(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id,
      name: item.name,
      active: item.active,
      candidateFlag: item.candidateFlag,
      point: item.point
    }
    return this.post(API_ENDPOINT.CONFIGURATION.REASONS_REJECT_EDIT, body);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.REASONS_REJECT_DELETE, body);
  }
}
