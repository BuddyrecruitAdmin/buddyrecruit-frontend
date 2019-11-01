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
export class CandidateService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('CandidateService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      },
      criteria: criteria
    };
    return this.post(API_ENDPOINT.CANDIDATE.LIST, body);
  }

  getDetail(flowId: string): Observable<ApiResponse> {
    const body = {
      _id: flowId
    };
    return this.post(API_ENDPOINT.CANDIDATE.DETAIL, body);
  }

  candidateFlowEdit(flowId: string, data: any): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      data: data
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.EDIT, body);
  }

  candidateFlowApprove(flowId: string, stageId: string, buttonId: string, data?: any): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      refStageId: stageId,
      buttonId: buttonId,
      data: data
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.APPROVE, body);
  }

  candidateFlowReject(flowId: string, rejectId: string, remark: string): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      rejectId: rejectId,
      remark: remark,
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.REJECT, body);
  }

  candidateFlowRevoke(flowId: string, stageId: string): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      refStageId: stageId
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.REVOKE, body);
  }

  candidateBlock(candidateId: string, flowId: string, remark: string): Observable<ApiResponse> {
    const body = {
      refCandidateId: candidateId,
      refCandidateFlowId: flowId,
      remark: remark
    };
    return this.post(API_ENDPOINT.CANDIDATE.BLOCK, body);
  }

  candidateUnblock(candidateId: string, flowId: string): Observable<ApiResponse> {
    const body = {
      refCandidateId: candidateId,
      refCandidateFlowId: flowId,
    };
    return this.post(API_ENDPOINT.CANDIDATE.UNBLOCK, body);
  }

  candidateFlowPreviewEmail(flowId: string, stageId: string, buttonId: string): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      refStageId: stageId,
      buttonId: buttonId
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.PREVIEW_EMAIL, body);
  }

  candidateFlowReSendEmail(flowId: string, stageId: string, isReject: boolean = false): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      refStageId: stageId,
      isReject: isReject
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.RESEND_EMAIL, body);
  }

  candidateFlowSendEmail(flowId: string, stageId: string, data: any, isReject: boolean = false): Observable<ApiResponse> {
    const body = {
      refCandidateFlowId: flowId,
      refStageId: stageId,
      data: data,
      isReject: isReject
    };
    return this.post(API_ENDPOINT.CANDIDATE.FLOW.SEND_EMAIL, body);
  }

  getCandidateDetail(refCandidateId: string): Observable<ApiResponse> {
    const body = {
      _id: refCandidateId
    };
    return this.post(API_ENDPOINT.CANDIDATE.DETAIL, body);
  }

  evaluationDetail(refCandidateId: string): Observable<ApiResponse> {
    const body = {
      _id: refCandidateId
    };
    return this.post(API_ENDPOINT.CANDIDATE.EVALUATION.DETAIL, body);
  }

  evaluationEdit(flowId: string, data: any): Observable<ApiResponse> {
    const body = {
      _id: flowId,
      data: data
    };
    return this.post(API_ENDPOINT.CANDIDATE.EVALUATION.EDIT, body);
  }

  getBlacklist(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      },
      criteria: criteria
    };
    return this.post(API_ENDPOINT.CANDIDATE.BLACKLIST, body);
  }

}
