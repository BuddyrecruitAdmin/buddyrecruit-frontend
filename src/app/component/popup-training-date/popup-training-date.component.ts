import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId, setButtonId, getButtonId, setIconId, getIconId, setHistoryData } from '../../shared/services/auth.service';
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
  remark: string;
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
    this.editable = false;
    setButtonId();
    setFlowId();
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
    this.remark = '';
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
        this.training = response.data.candidateFlow.data.training;
        if (this.utilitiesService.dateIsValid(this.training.date)) {
          this.training.date = new Date(this.training.date)
        }
        this.onboard = response.data.candidateFlow.data.onboard;
        if (this.utilitiesService.dateIsValid(this.onboard.date)) {
          this.onboard.date = new Date(this.onboard.date)
        }
        this.remark = response.data.candidateFlow.data.remark;
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
        setHistoryData(request);
        this.ref.close(true);
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.ref.close(false);
      }
      this.loading = false;
    });
  }

  setRequest(): any {
    const data = {
      training: this.training,
      onboard: this.onboard,
      remark: this.remark
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
