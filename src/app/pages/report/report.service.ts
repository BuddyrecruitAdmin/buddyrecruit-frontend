import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkService } from '../../shared/services/network.service';
import { HttpErrorHandler } from '../../shared/services/http-error-handler.service';
import { ApiResponse } from '../../shared/interfaces/common.interface';
import { API_ENDPOINT } from "../../shared/constants";
import { Subject } from 'rxjs/Subject';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: "root"
})
export class ReportService extends NetworkService {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler) {
    super('ReportService', httpClient, errorHandler);
  }

  getList(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    }
    return this.post(API_ENDPOINT.REPORT.LIST, body);
  }
  getListReport(criteria: any = undefined): Observable<ApiResponse> {
    const body = {
      criteria: criteria
    }
    return this.post(API_ENDPOINT.REPORT.LISTFEEDBACK, body);
  }

  getPositionList(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.JOBDESCRIPTION.LIST, { criteria });
  }

  edit(_id: any, checkList: boolean): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.REPORT.EDIT, { _id, checkList });
  }

  getListDepartment(keyword: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.REPORT.DEPARTMENT, keyword);
  }

  getListCandidate(criteria: any = undefined): Observable<ApiResponse> {
    return this.post(API_ENDPOINT.REPORT.ListCandidate, { criteria })
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
