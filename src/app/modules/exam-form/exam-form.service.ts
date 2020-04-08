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
export class ExamFormService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ExamFormService', httpClient, errorHandler);
  }

  getDetail(_id: any, examId, start) {
    const body = {
      candidateFlowId: _id,
      examId: examId,
      start: start
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EXAM_ONLINE_DETAIL, body);
  }

  submit(_id: any, request, examId) {
    const body = {
      candidateFlowId: _id,
      exams: request,
      examId: examId,
    }
    return this.post(API_ENDPOINT.CONFIGURATION.EXAM_ONLINE_SUBMIT, body);
  }

  answerExam(candidateFlowId: any, examId: any): Observable<ApiResponse> {
    const body = {
      candidateFlowId: candidateFlowId,
      examId: examId
    }
    return this.post(API_ENDPOINT.EXAM.EXAM_ANSWER, body);
  }
}
