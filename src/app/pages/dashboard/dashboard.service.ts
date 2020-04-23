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
export class DashboardService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('DashboardService', httpClient, errorHandler);
  }

  getDashboard(recruitmentStatus: any, rejection: any, enabledJobboard: any): Observable<ApiResponse> {
    const body = {
      recruitmentStatus: recruitmentStatus,
      rejection: rejection,
      enabledJobboard: enabledJobboard
    };
    return this.post(API_ENDPOINT.DASHBOARD.DASHBOARD, body);
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany && refCompany._id
      },
      criteria: criteria
    }
    return this.post(API_ENDPOINT.CONFIGURATION.DASHBOARD_LIST, body);
  }

}
