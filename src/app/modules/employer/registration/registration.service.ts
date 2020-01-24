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
export class RegistrationService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('RegistrationService', httpClient, errorHandler);
  }

  test(): Observable<ApiResponse> {
    const body = {
      lineId: 'U165f95b715c2b3060874a4d269eb4114',
      command: 'REGIS',
      username: 'vsengi@outlook.com',
    }
    return this.testPost(body);
  }

}
