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
export class ContactUsService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ContactUsService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    }
    return this.post(API_ENDPOINT.CONTACT.LIST, body);
  }

  getDetail(_id: any) {
    const body = {
      _id: _id
    }
    return this.post(API_ENDPOINT.CONTACT.DETAIL, body);
  }

  edit(body: any) {
    return this.post(API_ENDPOINT.CONTACT.EDIT, body);
  }

  isCreated(_id: any) {
    const body = {
      _id: _id,
      createdDate: new Date()
    }
    return this.post(API_ENDPOINT.CONTACT.EDIT, body);
  }

  deleteItem(_id: any) {
    const body = {
      _id: _id
    }
    return this.post(API_ENDPOINT.CONTACT.DELETE, body);
  }
}
