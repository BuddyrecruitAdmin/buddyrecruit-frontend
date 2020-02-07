import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { ApiResponse } from '../interfaces/common.interface';
import { ResponseCode } from '../app.constants';
import * as authService from './auth.service';
import { getRole } from '../../shared/services/auth.service';

declare const Pusher: any;

@Injectable()
export class PusherService {
  pusher: any;
  channel: any;

  constructor(private http: HttpClient) {
    const role = getRole();
    if (role && role._id) {
      this.pusher = new Pusher('637bdb1e8f9e10380448', {
        cluster: 'ap1',
        encrypted: true
      });
      this.channel = this.pusher.subscribe(`counter-${role._id}`);
    }
  }

}
