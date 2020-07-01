import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId, setButtonId, getButtonId, setIconId, getIconId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { PopupResendEmailComponent } from '../../component/popup-resend-email/popup-resend-email.component';
import { Devices } from '../../shared/interfaces/common.interface';


@Component({
  selector: 'ngx-popup-training-date',
  templateUrl: './popup-training-date.component.html',
  styleUrls: ['./popup-training-date.component.scss']
})
export class PopupTrainingDateComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  jrName: string;
  training: any;
  onboard: any;
  note: string;
  loading: boolean;
  editable: boolean;
  errMsg = {
    date: ''
  }
  minuteStep: any;
  result: any;
  devices: Devices;
  constructor(
    private candidateService: CandidateService,
    public ref: NbDialogRef<PopupTrainingDateComponent>,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    this.editable = false;
    setButtonId();
    setFlowId();
    setCandidateId();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.8;
    this.devices = this.utilitiesService.getDevice();
  }

  ngOnInit() {
    this.loading = true;
    this.candidateName = '';
    this.jrName = '';
    this.training = {
      date: null,
      time: null
    };
    this.onboard = {
      date: null,
      time: null
    };
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
        // if (this.utilitiesService.dateIsValid(response.data.candidateFlow.pendingSignContractInfo.sign.date)) {
        //   this.signDate = new Date(response.data.candidateFlow.pendingSignContractInfo.sign.date);
        //   this.signTime = this.utilitiesService.convertDateToTimePicker(this.signDate);
        // }
        // if (this.utilitiesService.dateIsValid(response.data.candidateFlow.pendingSignContractInfo.agreeStartDate)) {
        //   this.agreeDate = new Date(response.data.candidateFlow.pendingSignContractInfo.agreeStartDate);
        // }
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

  setRequest(): any {
    const data = {
      training: this.training,
      onboard: this.onboard
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
