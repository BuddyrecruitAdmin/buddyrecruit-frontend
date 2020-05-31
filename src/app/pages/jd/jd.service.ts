import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../shared/services/network.service';
import { HttpErrorHandler } from '../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../shared/interfaces/common.interface';
import { API_ENDPOINT } from "../../shared/constants";
import { environment } from '../../../environments/environment';
const URL = environment.API_URI + "/" + API_ENDPOINT.FILE.DOWNLOAD;
const URL2 = environment.API_URI + "/" + API_ENDPOINT.CV.CANDIDATE_ORIGINAL;
@Injectable({
  providedIn: "root"
})
export class JdService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('JdService', httpClient, errorHandler);
  }

  downloadFile(file: String) {
    // const body = { uploadName: file };
    // return this.post(API_ENDPOINT.FILE.DOWNLOAD, body);
    const body = { uploadName: file };
    return this.httpClient.post(URL, body, {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  // originalCV(id: String) {
  //   const body = { _id: id };
  //   return this.post(API_ENDPOINT.CV.CANDIDATE_ORIGINAL, body);
  // }

  originalCV(id: String, userId: string, stagingId: any = undefined): Observable<any> {
    const body = {
      _id: id,
      userId: userId,
      stagingId: stagingId
    };
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.post(URL2, body, { headers: headers, responseType: 'blob' });

    // return this.httpClient.post(URL2, body, {
    //   responseType: "blob" as 'json',
    //   headers: new HttpHeaders().append("Content-Type", "application/json")
    // });
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      },
      criteria: criteria
    }
    return this.post(API_ENDPOINT.JOBDESCRIPTION.LIST, body);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.JOBDESCRIPTION.DELETE, body);
  }

  create(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBDESCRIPTION.CREATE, request);
  }

  getDetail(_id: any) {
    const body = {
      _id: _id
    }
    return this.post(API_ENDPOINT.JOBDESCRIPTION.DETAIL, body);
  }

  edit(request: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBDESCRIPTION.EDIT, request);
  }

  getPositionList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.POSITION_LIST, { criteria });
  }
  getDepartmentList(activeOnly: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.DEPARTMENT_LIST, { activeOnly });
  }
  getEducationList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBDESCRIPTION.EDUCATION, { criteria });
  }
}
