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
export class ExamOnlineService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ExamOnlineService', httpClient, errorHandler);
  }


  create(request: any, jdId: any, examName: any): Observable<ApiResponse> {
    const body = {
      departmentId: jdId,
      exams: request,
      name: examName
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EXAM_ONLINE_CREATE, body);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    const body = {

      criteria: criteria
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EXAM_ONLINE_LIST, body);
  }
  // getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
  //   const body = {
  //     userData: {
  //       refCompany: refCompany._id
  //     },
  //     criteria: criteria
  //   }
  //   return this.post(API_ENDPOINT.CONFIGURATION.EVALUATION_LIST, body);
  // }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EXAM_ONLINE_DELETE, body);
  }


  getDetail(_id: any) {
    const body = {
      _id: _id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EXAM_ONLINE_DETAIL, body);
  }

  edit(request: any, jdId: any, examName: any, _id: any): Observable<ApiResponse> {
    const body = {
      departmentId: jdId,
      exams: request,
      name: examName,
      _id: _id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EXAM_ONLINE_EDIT, body);
  }

}
