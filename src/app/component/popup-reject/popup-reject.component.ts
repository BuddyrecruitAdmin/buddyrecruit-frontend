import { Component, OnInit } from '@angular/core';
import { PopupRejectService } from './popup-reject.service';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId, setUserSuccess } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { PopupResendEmailComponent } from '../../component/popup-resend-email/popup-resend-email.component';
import { MESSAGE } from "../../shared/constants/message";
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import * as _ from 'lodash';
import { Devices } from '../../shared/interfaces/common.interface';

@Component({
  selector: 'ngx-popup-reject',
  templateUrl: './popup-reject.component.html',
  styleUrls: ['./popup-reject.component.scss']
})
export class PopupRejectComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  stageId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  jrName: string;
  rejection: any;
  rejectId: any;
  remark: string;
  history: any;
  loading: boolean;
  result: boolean = false;
  devices: Devices;
  isExpress: boolean;
  constructor(
    private service: PopupRejectService,
    private candidateService: CandidateService,
    public ref: NbDialogRef<PopupRejectComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    setFlowId();
    setCandidateId();
    this.innerHeight = window.innerHeight * 0.8;
    this.devices = this.utilitiesService.getDevice();
    if (this.devices.isMobile) {
      this.innerWidth = window.innerWidth * 0.8;
    } else {
      this.innerWidth = window.innerWidth * 0.4;
    }
    this.isExpress = this.role.refCompany.isExpress;
  }

  ngOnInit() {
    this.loading = true;
    this.rejection = [];
    this.candidateName = '';
    this.jrName = '';
    if (this.flowId) {
      this.getList();
    } else {
      this.ref.close();
    }
  }

  getList() {
    this.loading = true;
    this.rejection = [];

    this.service.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.candidateName = this.utilitiesService.setFullname(response.data);
        this.jrName = response.data.candidateFlow.refJR.refJD.position;
        this.stageId = response.data.candidateFlow.refStage._id;
        this.history = response.data.reject;

        const mainStage = response.data.candidateFlow.refStage.refMain.name;
        this.service.getList().subscribe(response => {
          if (response.code === ResponseCode.Success) {
            switch (mainStage) {
              case 'Talent Pool':
                this.rejection = response.data.talentPool;
                break;
              case 'Pending Exam':
                this.rejection = response.data.pendingExam;
                break;
              case 'Pending Appointment':
                this.rejection = response.data.pendingAppointment;
                break;
              case 'Pending Interview':
                this.rejection = response.data.pendingInterview;
                break;
              case 'Pending Sign Contract':
                this.rejection = response.data.pendingSignContract;
                break;
              case 'Onboard':
                this.rejection = response.data.onboard;
                break;
              default:
                response.data.talentPool.forEach(element => {
                  this.rejection.push(element);
                });
                response.data.pendingExam.forEach(element => {
                  this.rejection.push(element);
                });
                response.data.pendingAppointment.forEach(element => {
                  this.rejection.push(element);
                });
                response.data.pendingInterview.forEach(element => {
                  this.rejection.push(element);
                });
                response.data.pendingSignContract.forEach(element => {
                  this.rejection.push(element);
                });
                response.data.onboard.forEach(element => {
                  this.rejection.push(element);
                });
                break;
            }
            if (this.rejection && this.rejection.length) {
              this.service.getListAll().subscribe(response => {
                if (response.code === ResponseCode.Success) {
                  let rejection = [];
                  this.rejection.forEach(element => {
                    if (response.data.find(item => {
                      return item._id === element._id && item.active;
                    })) {
                      rejection.push(element);
                    }
                  });
                  console.log(rejection)
                  this.rejection = _.cloneDeep(rejection);
                }
              });
            }
            this.loading = false;
          }
        });
      }
    });
  }

  reject() {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: MESSAGE[43] }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.candidateService.candidateFlowReject(this.flowId, this.rejectId, this.remark).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            if (!this.isExpress) {
              this.sendEmail();
            } else {
              this.ref.close(true);
            }
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
          this.loading = false;
        });
      }
    });
  }

  block() {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: MESSAGE[159] }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.candidateService.candidateBlock(this.candidateId, this.flowId, this.remark, this.rejectId).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            setUserSuccess('block');
            this.ref.close(true);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
          this.loading = false;
        });
      }
    });
  }

  sendEmail() {
    setFlowId(this.flowId);
    setCandidateId(this.candidateId);
    this.dialogService.open(PopupResendEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      this.ref.close(true);
    });
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
