import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId, setButtonId, getButtonId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { PopupPreviewEmailComponent } from '../../component/popup-preview-email/popup-preview-email.component';
import { PopupResendEmailComponent } from '../../component/popup-resend-email/popup-resend-email.component';

@Component({
  selector: 'ngx-popup-sign-date',
  templateUrl: './popup-sign-date.component.html',
  styleUrls: ['./popup-sign-date.component.scss']
})
export class PopupSignDateComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  stageId: any;
  buttonId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  jrName: string;
  signDate: Date;
  signTime: any;
  agreeDate: Date;
  note: string;
  loading: boolean;
  editable: boolean;
  constructor(
    private candidateService: CandidateService,
    private ref: NbDialogRef<PopupSignDateComponent>,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    this.editable = getButtonId();
    setButtonId();
    setFlowId();
    setCandidateId();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.8;
  }

  ngOnInit() {
    this.loading = true;
    this.candidateName = '';
    this.jrName = '';
    this.signDate = null;
    this.signTime = null;
    this.agreeDate = null;
    this.note = '';
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
        this.buttonId = this.utilitiesService.findButtonIdByStage(this.stageId);

        if (this.utilitiesService.dateIsValid(response.data.candidateFlow.pendingSignContractInfo.sign.date)) {
          this.signDate = new Date(response.data.candidateFlow.pendingSignContractInfo.sign.date);
          this.signTime = this.utilitiesService.convertDateToTimePicker(this.signDate);
        }
        if (this.utilitiesService.dateIsValid(response.data.candidateFlow.pendingSignContractInfo.agreeStartDate)) {
          this.agreeDate = new Date(response.data.candidateFlow.pendingSignContractInfo.agreeStartDate);
        }
        this.note = response.data.candidateFlow.pendingSignContractInfo.note;
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

  sendEmail() {
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

  previewEmail() {
    setFlowId(this.flowId);
    setCandidateId(this.candidateId);
    setButtonId(this.buttonId);
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
      pendingSignContractInfo: {
        sign: {
          flag: true,
          date: this.utilitiesService.convertTimePickerToDate(this.signTime, this.signDate)
        },
        agreeStartDate: new Date(this.agreeDate) || null,
        note: this.note,
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
