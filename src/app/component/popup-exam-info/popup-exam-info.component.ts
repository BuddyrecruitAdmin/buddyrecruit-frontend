import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-popup-exam-info',
  templateUrl: './popup-exam-info.component.html',
  styleUrls: ['./popup-exam-info.component.scss']
})
export class PopupExamInfoComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  stageId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  jrName: string;
  availableDate: Date;
  afterSignContract: number;
  remark: string;
  loading: boolean;
  canApprove: boolean;

  constructor(
    private candidateService: CandidateService,
    private ref: NbDialogRef<PopupExamInfoComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    setFlowId();
    setCandidateId();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.8;
  }

  ngOnInit() {
    this.loading = true;
    this.canApprove = false;
    this.candidateName = '';
    this.jrName = '';
    this.availableDate = null;
    this.afterSignContract = null;
    this.remark = '';
    if (this.flowId) {
      this.getDetail();
    } else {
      this.ref.close();
    }
  }

  getDetail() {
    this.candidateService.getDetail(this.candidateId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.candidateName = this.utilitiesService.setFullname(response.data);
        this.jrName = response.data.candidateFlow.refJR.refJD.position;
        this.stageId = response.data.candidateFlow.refStage._id;
        if (this.utilitiesService.dateIsValid(response.data.candidateFlow.pendingExamInfo.availableDate)) {
          this.availableDate = new Date(response.data.candidateFlow.pendingExamInfo.availableDate);
        }
        this.afterSignContract = response.data.candidateFlow.pendingExamInfo.afterSignContract;
        this.remark = response.data.candidateFlow.pendingExamInfo.remark;
        if (response.data.candidateFlow.refStage.name === 'Exam Taken') {
          this.canApprove = true;
        }
      }
      this.loading = false;
    });
  }

  save() {
    this.loading = true;
    const request = this.setRequest();
    this.candidateService.candidateFlowEdit(this.flowId, request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
      this.loading = false;
      this.ref.close(true);
    });
  }

  examTaken() {
    this.loading = true;
    const request = this.setRequest();
    this.candidateService.candidateFlowEdit(this.flowId, request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.candidateService.candidateFlowApprove(this.flowId, this.stageId, request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            if (response.code === ResponseCode.Success) {
              this.showToast('success', 'Success Message', response.message);
            } else {
              this.showToast('danger', 'Error Message', response.message);
            }
            this.loading = false;
            this.ref.close(true);
          }
        });
      }
    });
  }

  setRequest(): any {
    let availableDate = new Date(this.availableDate);
    const data = {
      pendingExamInfo: {
        availableDate: availableDate,
        afterSignContract: this.afterSignContract,
        remark: this.remark,
        flag: true
      }
    };
    return data;
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 5000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    this.toastrService.show(body, title, config);
  }
}
