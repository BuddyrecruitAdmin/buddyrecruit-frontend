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
export class PopupFeedbackService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('PopupFeedbackService', httpClient, errorHandler);
  }

  getList(_id: any, fieldName: any, fieldLabel: any): Observable<ApiResponse> {
    const body = {
      refCandidate: _id,
      fieldName: fieldName,
      fieldText: fieldLabel,
    };
    return this.post(API_ENDPOINT.CV.LIST, body);
  }

  // getDetail(flowId: any) {
  //   const body = {
  //     _id: flowId
  //   }
  //   return this.post(API_ENDPOINT.CANDIDATE.DETAIL, body);
  // }

  // getEducationList(criteria: any = undefined): Observable<ApiResponse> {
  //   return this.post(API_ENDPOINT.JOBDESCRIPTION.EDUCATION, { criteria });
  // }

  // edit(items): Observable<ApiResponse> {
  //   return this.post(API_ENDPOINT.CANDIDATE.EDIT, { items });
  // }

  create(flowId: string,_id: string, fieldName: string, fieldLabel: string, feedbackType: string, bugComment: string): Observable<ApiResponse> {
    const body = {
      refCandidateFlow: flowId,
      refCandidate: _id,
      fieldName: fieldName,
      fieldText: fieldLabel,
      feedbackType: feedbackType,
      remark: bugComment
    };
    return this.post(API_ENDPOINT.CV.CREATE, body);
  }

  deleteItem(_id: string): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.CV.DELETE, {_id})
  }

  // deleteItem(flowId: string, commentId: any): Observable<ApiResponse> {
  //   const body = {
  //     refCandidateFlowId: flowId,
  //     refCommentId: commentId
  //   };
  //   return this.post(API_ENDPOINT.CANDIDATE.FLOW.COMMENT.DELETE, body);
  // }

}
