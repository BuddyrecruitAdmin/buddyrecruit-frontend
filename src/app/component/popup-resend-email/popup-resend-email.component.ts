import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-popup-resend-email',
  templateUrl: './popup-resend-email.component.html',
  styleUrls: ['./popup-resend-email.component.scss']
})
export class PopupResendEmailComponent implements OnInit {
  innerWidth: any;
  innerHeight: any;
  role: any;
  flowId: any;
  candidateId: any;
  stageId: any;
  isReject: boolean;
  mailOptions: any;
  mailType: any;
  previewEmail: boolean;
  today: Date;
  loading: boolean;

  constructor(
    private candidateService: CandidateService,
    private ref: NbDialogRef<PopupResendEmailComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    setFlowId();
    setCandidateId();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.loading = true;
    this.stageId = '';
    this.mailOptions = {};
    this.mailType = '';
    this.previewEmail = false;
    this.today = new Date();
    if (this.flowId) {
      this.getReSendEmail();
    } else {
      this.ref.close();
    }
  }

  getReSendEmail() {
    this.candidateService.getCandidateDetail(this.candidateId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.stageId = response.data.candidateFlow.refStage._id;
        this.isReject = response.data.candidateFlow.reject.flag;

        this.candidateService.candidateFlowReSendEmail(this.flowId, this.stageId, this.isReject).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            if (response.data.mailOptions) {
              this.mailOptions = response.data.mailOptions;
              this.mailType = response.data.type;
              this.previewEmail = true;
            } else {
              this.previewEmail = false;
              this.ref.close();
            }
          } else {
            this.previewEmail = false;
            this.ref.close();
          }
          this.loading = false;
        });
      }
    });
  }

  sendEmail() {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: '40%',
      data: { type: 'C', content: `Do you want to Resend Email?` }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        const request = this.setRequest();
        this.candidateService.candidateFlowSendEmail(this.flowId, this.stageId, request, this.isReject).subscribe(response => {
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
      } else {
        this.ref.close();
      }
    });
  }

  setRequest(): any {
    let data = {};
    if (this.sendEmail) {
      data = {
        mailOptions: this.mailOptions,
        mailType: this.mailType
      }
    }
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
