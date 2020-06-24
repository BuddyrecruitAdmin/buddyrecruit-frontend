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
export class JobPositionService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('JobPositionService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.POSITION_LIST, { criteria });
  }

  create(item: any): Observable<ApiResponse> {
    const body = {
      name: item.name,
      remark: item.remark,
      specification: item.specification,
      qualification: item.qualification
    }
    return this.post(API_ENDPOINT.CONFIGURATION.POSITION_CREATE, body);
  }

  edit(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id,
      name: item.name,
      active: item.active,
      remark: item.remark,
      specification: item.specification,
      qualification: item.qualification
    }
    return this.post(API_ENDPOINT.CONFIGURATION.POSITION_EDIT, body);
  }

  deleteItem(item: any): Observable<ApiResponse> {
    const body = {
      _id: item._id
    }
    return this.post(API_ENDPOINT.CONFIGURATION.POSITION_DELETE, body);
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

  getDetail(positionId : any): Observable<ApiResponse> {
    const body = {
      positionId 
    }
    return this.post(API_ENDPOINT.CONFIGURATION.HUB_DETAIL, body);
  }


  hubEdit(_id : any, provinces: any): Observable<ApiResponse> {
    // const body = {
    //   _id ,
    //   provinces
    // }
    return this.post(API_ENDPOINT.CONFIGURATION.HUB_EDIT, provinces);
  }
  
  getHubList(criteria: any = undefined, refCompany: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CONFIGURATION.HUB_LIST, { criteria, refCompany });
  }
}
