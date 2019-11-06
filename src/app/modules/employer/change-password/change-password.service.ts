import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../../shared/services/network.service';
import { HttpErrorHandler } from '../../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../../shared/interfaces/common.interface';
import { API_ENDPOINT } from '../../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ChangePasswordService', httpClient, errorHandler);
  }

  submitPassword(_id: string, password: string): Observable<ApiResponse> {
    const body = {
      _id: _id,
      password: password
    };
    return this.post(API_ENDPOINT.USERS.CONFIRMPASSWORD, body);
  }
}
