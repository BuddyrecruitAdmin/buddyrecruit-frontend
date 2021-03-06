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
export class AppointmentService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('AppointmentService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      },
      criteria: criteria
    };
    return this.post(API_ENDPOINT.PENDING_APPOINTMENT.LIST, body);
  }

  getDetail(refStageId: string, jrId: string, tabName: string, criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      refStageId: refStageId,
      jrId: jrId,
      tabName: tabName,
      criteria: criteria
    };
    return this.post(API_ENDPOINT.PENDING_APPOINTMENT.DETAIL, body);
  }

  sourceList(jrId: any): Observable<ApiResponse> {
    const body = {
      jrId: jrId
    };
    return this.post(API_ENDPOINT.TALENT_POOL.SOURCE, body);
  }

  saveDate(item: any): Observable<ApiResponse> {
    const body = {
      item
    };
    return this.post(API_ENDPOINT.PENDING_APPOINTMENT.DATE_CREATE, body);
  }

  listDate(jrId: string): Observable<ApiResponse> {
    const body = {
      jrId
    };
    return this.post(API_ENDPOINT.PENDING_APPOINTMENT.DATE_LIST, body);
  }

}
