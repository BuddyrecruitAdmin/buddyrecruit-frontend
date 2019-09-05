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
export class PopupCommentService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('PopupCommentService', httpClient, errorHandler);
  }

  getList(flowId): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.COMMENT.LIST, body);
  }

  create(flowId: string, message: any): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      message: message
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.COMMENT.CREATE, body);
  }

  deleteItem(flowId: string, commentId: any): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      refCommentId: commentId
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.COMMENT.DELETE, body);
  }

}
