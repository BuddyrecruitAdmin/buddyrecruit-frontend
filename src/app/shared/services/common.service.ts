import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../shared/services/network.service';
import { HttpErrorHandler } from '../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../shared/interfaces/common.interface';

@Injectable({
    providedIn: 'root'
})
export class CommonService extends NetworkService {
    baseUri = '';
    constructor(
        protected httpClient: HttpClient,
        protected errorHandler: HttpErrorHandler) {
        super('CommonService', httpClient, errorHandler);
    }

}
