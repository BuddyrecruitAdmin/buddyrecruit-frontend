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

  getListDepartment(keyword: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.REPORT.DEPARTMENT, keyword);
  }

}
