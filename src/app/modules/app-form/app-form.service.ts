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
export class AppFormService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('AppFormService', httpClient, errorHandler);
  }

  getList(flowId): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.COMMENT.LIST, body);
  }

  getDetail(_id, isUser, userId: any = undefined, candidateFlowId: any = undefined): Observable<ApiResponse> {
    const body = {
      _id: _id,
      isUser: isUser,
      userId: userId,
      candidateFlowId: candidateFlowId
    }
    return this.post(API_ENDPOINT.APPFORM.DETAIL, body);
  }

  getEducationList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBDESCRIPTION.EDUCATION, { criteria });
  }

  edit(items): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CANDIDATE.EDIT, { items });
  }

  create(flowId: string, message: any): Observable<ApiResponse> {
    const body = {
      refCandidate: flowId,
      message: message
    };
    return this.post(API_ENDPOINT.APPFORM.CREATE, body);
  }

  deleteItem(flowId: string, commentId: any): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      refCommentId: commentId
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.COMMENT.DELETE, body);
  }

}
