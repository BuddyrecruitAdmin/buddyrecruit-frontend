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
export class MailTemplateService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('MailTemplateService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.MAIL_ACTION_LIST, { criteria });
  }
  getListAll(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.MAIL_TEMPLATE_LIST, { criteria });
  }

  getDetail(id: any): Observable<ApiResponse> {
    const body = {
      _id: id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.MAIL_TEMPLATE_DETAIL, body);
  }
  getDetailEmail(id: any): Observable<ApiResponse> {
    const body = {
      _id: id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.MAIL_ACTION_DETAIL, body);
  }

  create(item: any): Observable<ApiResponse> {
    const body = {
      name: item.name,
      subject: item.subject,
      remark: item.remark,
      cc: item.cc,
      bcc: item.bcc,
      html: item.html,
      type: item.type,
      action: item.action,
    }
    return this.post(API_ENDPOINT.CONFIGURATION.MAIL_TEMPLATE_CREATE, body);
  }

  edit(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id,
      name: item.name,
      subject: item.subject,
      remark: item.remark,
      cc: item.cc,
      bcc: item.bcc,
      type: item.type,
      html: item.html,
      action: item.action,
    }
    return this.post(API_ENDPOINT.CONFIGURATION.MAIL_TEMPLATE_EDIT, body);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.MAIL_TEMPLATE_DELETE, body);
  }
}
