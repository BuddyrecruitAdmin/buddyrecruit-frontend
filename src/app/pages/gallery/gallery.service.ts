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
export class GalleryService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('GalleryService', httpClient, errorHandler);
  }

  fileDownload(uploadName: any): Observable<ApiResponse> {
    var path = `?filename=${uploadName}`
    return this.get(API_ENDPOINT.FILE.FILE_EXTER, path);
  }

}
