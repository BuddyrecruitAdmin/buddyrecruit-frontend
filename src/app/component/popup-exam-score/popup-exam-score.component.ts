import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId, setButtonId, setUserEmail } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { PopupPreviewEmailComponent } from '../../component/popup-preview-email/popup-preview-email.component';
import { Devices } from '../../shared/interfaces/common.interface';

@Component({
  selector: 'ngx-popup-exam-score',
  templateUrl: './popup-exam-score.component.html',
  styleUrls: ['./popup-exam-score.component.scss']
})
export class PopupExamScoreComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  stageId: any;
  buttonId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  jrName: string;
  examScore: number;
  examRemark: string;
  attitudeScore: number;
  attitudeRemark: string;
  loading: boolean;
  result: boolean = false;
  devices: Devices;
  attitudeFlag: boolean;
  touchedExam: boolean;
  touchedAtt: boolean;
  errorExam: string;
  errorAtt: string;
  emailCandidate: any;
  constructor(
    private candidateService: CandidateService,
    public ref: NbDialogRef<PopupExamScoreComponent>,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    setFlowId();
    setCandidateId();
    this.devices = this.utilitiesService.getDevice();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.85;
  }

  ngOnInit() {
    this.loading = true;
    this.candidateName = '';
    this.jrName = '';
    this.examScore = null;
    this.examRemark = '';
    // this.attitudeScore = null;
    this.attitudeFlag = false;
    this.attitudeRemark = '';
    if (this.flowId) {
      this.getDetail();
    } else {
      this.ref.close();
    }
  }

  getDetail() {
    this.candidateService.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.candidateName = this.utilitiesService.setFullname(response.data);
        this.jrName = response.data.candidateFlow.refJR.refJD.position;
        this.stageId = response.data.candidateFlow.refStage._id;
        this.buttonId = this.utilitiesService.findButtonIdByStage(this.stageId, response.data.candidateFlow.refJR.requiredExam);
        this.emailCandidate = response.data.email;
        this.examScore = response.data.candidateFlow.pendingExamScoreInfo.examScore;
        this.examRemark = response.data.candidateFlow.pendingExamScoreInfo.examRemark;
        this.attitudeScore = response.data.candidateFlow.pendingExamScoreInfo.attitudeScore;
        this.attitudeRemark = response.data.candidateFlow.pendingExamScoreInfo.attitudeRemark;
        this.attitudeFlag = response.data.candidateFlow.refJR.requiredAttitude;
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

  passToAppointment() {
    if (this.validation()) {
      this.loading = true;
      const request = this.setRequest();
      this.candidateService.candidateFlowEdit(this.flowId, request).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.previewEmail();
        } else {
          this.showToast('danger', 'Error Message', response.message);
          this.ref.close();
        }
      });
    }
  }

  validation(): boolean {
    let isValid = true;
    this.touchedAtt = false;
    this.touchedExam = false;
    if (!this.examScore) {
      this.touchedExam = true;
      isValid = false;
      this.errorExam = "please enter exam score";
    }
    if (!this.attitudeScore && this.attitudeFlag) {
      this.touchedAtt = true;
      isValid = false;
      this.errorAtt = "please enter attitude score";
    }
    return isValid;
  }

  previewEmail() {
    setFlowId(this.flowId);
    setCandidateId(this.candidateId);
    setButtonId(this.buttonId);
    setUserEmail(this.emailCandidate)
    this.dialogService.open(PopupPreviewEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      setButtonId();
      if (result) {
        this.ref.close(true);
      }
      this.loading = false;
    });
  }

  setRequest(): any {
    const data = {
      pendingExamScoreInfo: {
        examScore: this.examScore,
        examRemark: this.examRemark,
        attitudeScore: this.attitudeScore,
        attitudeRemark: this.attitudeRemark,
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
