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
export class ExamService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ExamService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined, refCompany: any): Observable<ApiResponse> {
    const body = {
      userData: {
        refCompany: refCompany._id
      },
      criteria: criteria
    };
    return this.post(API_ENDPOINT.PENDING_EXAM.LIST, body);
  }

  getDetail(refStageId: string, jrId: string, tabName: string, criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      refStageId: refStageId,
      jrId: jrId,
      tabName: tabName,
      criteria: criteria
    };
    return this.post(API_ENDPOINT.PENDING_EXAM.DETAIL, body);
  }

  sourceList(jrId: any): Observable<ApiResponse> {
    const body = {
      jrId: jrId
    };
    return this.post(API_ENDPOINT.TALENT_POOL.SOURCE, body);
  }

  // getListExamOnline(criteria: any = undefined): Observable<ApiResponse> {
  //   const body = {

  //     criteria: criteria
  //   }
  //   return this.post(API_ENDPOINT.CONFIGURATION.EXAM_ONLINE_LIST, body);
  // }
  getListExamOnline(_id: any) {
    const body = {
      _id: _id
    }
    return this.post(API_ENDPOINT.JOBREQUEST.DETAIL, body);
  }

  semdExam(examId: any, candidateFlowId: any): Observable<ApiResponse> {
    const body = {
      examId: examId,
      candidateFlowId: candidateFlowId
    }
    return this.post(API_ENDPOINT.EXAM.EXAM_TEST, body);
  }
  answerExam(candidateFlowId: any, examId: any): Observable<ApiResponse> {
    const body = {
      candidateFlowId: candidateFlowId,
      examId: examId
    }
    return this.post(API_ENDPOINT.EXAM.EXAM_ANSWER, body);
  }
}
