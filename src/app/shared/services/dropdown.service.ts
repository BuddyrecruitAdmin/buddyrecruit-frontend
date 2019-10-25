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
export class DropdownService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('DropdownService', httpClient, errorHandler);
  }

  getDepartment(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.DROPDOWN.DEPARTMENT_LIST, criteria);
  }

  getPosition(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.DROPDOWN.JOBPOSITION_LIST, criteria);
  }

  getUser(departmentId: any = undefined, divisionId: any = undefined): Observable<ApiResponse> {
    const body = {
      departmentId: departmentId,
      divisionId: divisionId
    }
    return this.post(API_ENDPOINT.DROPDOWN.USER_LIST, body);
  }

}
