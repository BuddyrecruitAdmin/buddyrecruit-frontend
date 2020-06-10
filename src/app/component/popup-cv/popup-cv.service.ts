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
export class PopupCVService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('PopupCVService', httpClient, errorHandler);
  }

  getList(flowId): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.COMMENT.LIST, body);
  }

  getDetail(flowId: any): Observable<ApiResponse> {
    const body = {
      _id: flowId
    }
    return this.post(API_ENDPOINT.CANDIDATE.DETAIL, body);
  }

  getEducationList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBDESCRIPTION.EDUCATION, { criteria });
  }

  edit(items): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CANDIDATE.EDIT, { items });
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

  check(flowId: string, _id: string, fieldName: string, fieldLabel: string, feedbackType: any = undefined, bugComment: any = undefined): Observable<ApiResponse> {
    const body = {
      refCandidateFlow: flowId,
      refCandidate: _id,
      fieldName: fieldName,
      fieldText: fieldLabel,
      feedbackType: feedbackType,
      bugComment: bugComment
    };
    return this.post(API_ENDPOINT.CV.CREATE, body);
  }

  saveExtract(stagingId: any, companyId: any,data): Observable<ApiResponse> {
    const body = {
      stgID: stagingId._id,
      company: companyId,
      data: data  
    }
    return this.post(API_ENDPOINT.CV.GEN, body)
  }

}
