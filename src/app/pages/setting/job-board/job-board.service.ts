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
export class JobBoardService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('JobBoardService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    if (criteria) {
      var path = `?keyword=${criteria.keyword}&skip=${criteria.skip}&limit=${criteria.limit}`
      return this.get(API_ENDPOINT.CONFIGURATION.JOB_BOARD_LIST, path);
    } else {
      return this.get(API_ENDPOINT.CONFIGURATION.JOB_BOARD_LIST);
    }
  }

  getDetail(_id: any) {
    var path = `?_id=${_id}`
    return this.get(API_ENDPOINT.CONFIGURATION.JOB_BOARD_DETAIL, path);
  }

  create(item: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.JOB_BOARD_LIST, item);
  }

  edit(item: any): Observable<ApiResponse> {
    return this.patch(API_ENDPOINT.CONFIGURATION.JOB_BOARD_LIST, item);
  }

  deleteItem(_id: any): Observable<ApiResponse> {
    return this.delete(API_ENDPOINT.CONFIGURATION.JOB_BOARD_LIST, _id);
  }


}
