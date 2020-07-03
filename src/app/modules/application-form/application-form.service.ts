import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../shared/services/network.service';
import { HttpErrorHandler } from '../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../shared/interfaces/common.interface';
import { API_ENDPOINT } from "../../shared/constants";
import { IApplicationForm } from './application-form.interface';

@Injectable({
  providedIn: "root"
})
export class ApplicationFormService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ApplicationFormService', httpClient, errorHandler);
  }

  getList(): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.APPLICATION_FORM.LIST, {});
  }

  getDetail(token: string, appFormID: string, flowId: string): Observable<ApiResponse> {
    const body = {
      token,
      appFormID,
      flowId
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.DETAIL, body);
  }

  create(request: IApplicationForm): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.APPLICATION_FORM.CREATE, request);
  }

  edit(request: IApplicationForm): Observable<ApiResponse> {
    const body = {
      appForm: request,
    };
    return this.post(API_ENDPOINT.APPLICATION_FORM.EDIT, { body });
  }

  deleteItem(_id: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.APPLICATION_FORM.DELETE, { _id: _id });
  }

  getTemplate(refCompany, refTemplate, positionId = undefined): Observable<ApiResponse> {
    const body = {
      refCompany: refCompany,
      refTemplate: refTemplate,
      positionId: positionId
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.GET_TEMPLATE, body);
  }

  getJR(refCompany = undefined): Observable<ApiResponse> {
    const body = {
      refCompany: refCompany
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.JR_LIST, body);
  }
  
  getTitle(refCompany = undefined): Observable<ApiResponse> {
    const body = {
      refCompany: refCompany
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.TITLE_LIST, body);
  }

  getHub(refCompany = undefined): Observable<ApiResponse> {
    const body = {
      refCompany: refCompany
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.HUB_LIST, body);
  }

  getStatusList(refCompany, idCard): Observable<ApiResponse> {
    const body = {
      refCompany: refCompany,
      // phone: phone,
      idCard: idCard
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.GET_STATUS_LIST, body);
  }

  fileDownload(refCompany: string, uploadName = ''): Observable<ApiResponse> {
    const body = {
      refCompany: refCompany,
      uploadName: uploadName,
      isCV: false
    }
    return this.post(API_ENDPOINT.FILE.FILE_DOWNLOAD, body);
  }

  getCompany(_id ): Observable<ApiResponse> {
    const body = {
      _id ,
    }
    return this.post(API_ENDPOINT.APPLICATION_FORM.COMPANY, body);
  }

  getProvince(): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.PROVINCE, undefined);
  }

  getDistrict(provinceId: any): Observable<ApiResponse> {
    const body = {
      provinceId: provinceId
    }
    return this.post(API_ENDPOINT.CONFIGURATION.DISTRICT, body);
  }

  getSubDistrict(districtId : any): Observable<ApiResponse> {
    const body = {
      districtId : districtId 
    }
    return this.post(API_ENDPOINT.CONFIGURATION.SUB_DISTRICT, body);
  }


}
