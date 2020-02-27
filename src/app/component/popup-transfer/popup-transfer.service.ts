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
export class PopupTransferService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('PopupCVService', httpClient, errorHandler);
  }

  getListDepartment(candidateFlowId: any): Observable<ApiResponse> {

    return this.post(API_ENDPOINT.TRANSFER.DEPARTMENT_LIST, { candidateFlowId });
  }

  geListDivision(departmentId: any): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.TRANSFER.DIVISION_LIST, { departmentId });
  }

  geListJR(candidateFlowId: any = null, departmentId: any = null, divisionId: any = null): Observable<ApiResponse> {
    const body = {
      candidateFlowId: candidateFlowId,
      departmentId: departmentId,
      divisionId: divisionId
    }
    return this.post(API_ENDPOINT.TRANSFER.JR_LIST, body);
  }

  edit(item): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.TRANSFER.SAVE, item);
  }
  // getEducationList(criteria: any = undefined): Observable<ApiResponse> {
  //   return this.post(API_ENDPOINT.JOBDESCRIPTION.EDUCATION, { criteria });
  // }

  // edit(items): Observable<ApiResponse> {
  //   return this.post(API_ENDPOINT.CANDIDATE.EDIT, { items });
  // }

  // create(flowId: string, message: any): Observable<ApiResponse> {
  //   const body = {
  //     refCandidateFlowId: flowId,
  //     message: message
  //   };
  //   return this.post(API_ENDPOINT.CANDIDATE.FLOW.COMMENT.CREATE, body);
  // }

  // deleteItem(flowId: string, commentId: any): Observable<ApiResponse> {
  //   const body = {
  //     refCandidateFlowId: flowId,
  //     refCommentId: commentId
  //   };
  //   return this.post(API_ENDPOINT.CANDIDATE.FLOW.COMMENT.DELETE, body);
  // }

  // check(flowId: string,_id: string, fieldName: string, fieldLabel: string, feedbackType: any = undefined, bugComment: any = undefined): Observable<ApiResponse> {
  //   const body = {
  //     refCandidateFlow: flowId,
  //     refCandidate: _id,
  //     fieldName: fieldName,
  //     fieldText: fieldLabel,
  //     feedbackType: feedbackType,
  //     bugComment: bugComment
  //   };
  //   return this.post(API_ENDPOINT.CV.CREATE, body);
  // }

}
