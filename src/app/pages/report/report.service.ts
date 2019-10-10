import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../shared/services/network.service';
import { HttpErrorHandler } from '../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../shared/interfaces/common.interface';
import { API_ENDPOINT } from "../../shared/constants";
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: "root"
})
export class ReportService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ReportService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    }
    return this.post(API_ENDPOINT.REPORT.LIST, body);
  }
  getListReport(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    }
    return this.post(API_ENDPOINT.REPORT.LISTFEEDBACK, body);
  }

  getPositionList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBDESCRIPTION.LIST, { criteria });
  }

  edit(_id: any, checkList: boolean): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.REPORT.EDIT, { _id, checkList });
  }
  // deleteItem(item: any): Observable<ApiResponse> {
  //   const body = {
  //     _id: item._id
  //   }
  //   return this.post(API_ENDPOINT.JOBREQUEST.DELETE, body);
  // }

  // create(request: any): Observable<ApiResponse> {
  //   return this.post(API_ENDPOINT.JOBREQUEST.CREATE, request);
  // }

  // getDetail(_id: any) {
  //   const body = {
  //     _id: _id
  //   }
  //   return this.post(API_ENDPOINT.JOBREQUEST.DETAIL, body);
  // }

  // edit(request: any): Observable<ApiResponse> {
  //   return this.post(API_ENDPOINT.JOBREQUEST.EDIT, request);
  // }

  // getJopPositionList(action: any = undefined): Observable<ApiResponse> {
  //   return this.post(API_ENDPOINT.JOBDESCRIPTION.LIST, { action });
  // }

  // getEvaluationList(action: any = undefined): Observable<ApiResponse> {
  //   return this.post(API_ENDPOINT.CONFIGURATION.EVALUATION_LIST, { action });
  // }

}
