import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId, getButtonId, setButtonId, setUserEmail, getUserEmail } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { PopupCvComponent } from '../../component/popup-cv/popup-cv.component';
import { NbDialogService } from '@nebular/theme';
import { Devices } from '../../shared/interfaces/common.interface';
@Component({
  selector: 'ngx-popup-preview-email',
  templateUrl: './popup-preview-email.component.html',
  styleUrls: ['./popup-preview-email.component.scss']
})
export class PopupPreviewEmailComponent implements OnInit {
  innerWidth: any;
  innerHeight: any;
  role: any;
  flowId: any;
  candidateId: any;
  buttonId: any;
  buttonName: string;
  stageId: any;
  mailOptions: any;
  mailType: any;
  actionUser: any;
  previewEmail: boolean;
  sendEmail: boolean;
  today: Date;
  loading: boolean;
  checkedEmail: any;
  haveEmail: any;
  disMail: boolean = false;
  devices: Devices;
  constructor(
    private candidateService: CandidateService,
    private ref: NbDialogRef<PopupPreviewEmailComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    this.buttonId = getButtonId();
    this.haveEmail = getUserEmail();
    let step = this.role.refAuthorize.processFlow.exam.steps.find(element => {
      return element._id === this.buttonId;
    });
    if (!step) {
      step = this.role.refAuthorize.processFlow.noExam.steps.find(element => {
        return element._id === this.buttonId;
      });
    }
    this.buttonName = step.button || 'Send';
    this.stageId = step.refStage._id;
    setFlowId();
    setCandidateId();
    setButtonId();
    setUserEmail();
    this.devices = this.utilitiesService.getDevice();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.loading = true;
    this.mailOptions = {};
    this.mailType = '';
    this.actionUser = [];
    this.previewEmail = false;
    this.sendEmail = true;
    this.today = new Date();
    if (this.flowId) {
      this.getPreviewEmail();
    } else {
      this.ref.close();
    }
  }

  getPreviewEmail() {
    this.candidateService.candidateFlowPreviewEmail(this.flowId, this.stageId, this.buttonId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.actionUser = response.data.actionUser;
        if (response.status === 'W' || !this.haveEmail) {
          if (response.data.mailOptions) {
            if (!response.data.mailOptions.to[0]) {
              this.checkedEmail = true;
              this.sendEmail = false;
            }
          }
          this.callPopupWarning(response.data);
        } else {
          if (response.data.mailOptions) {
            this.mailOptions = response.data.mailOptions;
            this.mailType = response.data.type;
            this.previewEmail = true;
          } else {
            this.previewEmail = false;
            this.nextStep();
          }
        }
      } else {
        this.actionUser = response.data.actionUser;
        this.previewEmail = false;
        this.nextStep();
      }
      this.loading = false;
    });
  }

  callPopupWarning(data: any) {
    let type = 'C';
    let contents = [];
    if (data.otherJR && data.otherJR.length) {
      const found = data.otherJR.find(element => {
        return element.refStage.refMain.order === 600;
      });
      if (found) {
        this.disMail = true;
        type = 'I';
        contents.push(`ไม่สามารถทำรายการได้ เนื่องจากผู้สมัครได้เซ็นสัญญากับ`);
        contents.push(`JR: ${found.refJR.refJD.position} - Department: ${found.refJR.departmentName} แล้ว`);
      } else {
        type = 'W';
        if (!this.haveEmail) {
          contents.push('***ไม่พบอีเมลของผู้สมัคร*** ');
        } else {
          setUserEmail(this.haveEmail);
        }
        contents.push('พบผู้สมัครอยู่หลาย JR ดังต่อไปนี้');
        data.otherJR.map((element, index) => {
          contents.push(`${index + 1}. JR: ${element.refJR.refJD.position} - Department: ${element.refJR.departmentName} (${element.refStage.refMain.name})`);
        });
        contents.push('คุณต้องการทำรายการต่อหรือไม่ ?');
      }
    } else
      if (!this.haveEmail) {
        type = 'W';
        contents.push('ไม่พบอีเมลของผู้สมัคร ');
        contents.push('คุณต้องการทำรายการต่อหรือไม่ ?');
      } else {
        setUserEmail(this.haveEmail);
      }
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: type, contents: contents }
    });
    confirm.afterClosed().subscribe(result => {
      if (result && !this.disMail) {
        if (result === 'edit') {
          this.info();
        } else if (data.mailOptions) {
          this.mailOptions = data.mailOptions;
          this.mailType = data.type;
          this.actionUser = data.actionUser;
          this.previewEmail = true;
        } else {
          this.loading = true;
          const request = this.setRequest();
          this.candidateService.candidateFlowApprove(this.flowId, this.stageId, this.buttonId, request).subscribe(response => {
            if (response.code === ResponseCode.Success) {
              this.showToast('success', 'Success Message', response.message);
            } else {
              this.showToast('danger', 'Error Message', response.message);
            }
            this.loading = false;
            this.ref.close(true);
          });
        }
      } else {
        this.ref.close();
      }
    });
  }

  info() {
    setFlowId(this.flowId);
    setCandidateId(this.candidateId);
    this.dialogService.open(PopupCvComponent,
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

  nextStep() {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: `Do you want to ${this.buttonName}?` }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        const request = this.setRequest();
        this.candidateService.candidateFlowApprove(this.flowId, this.stageId, this.buttonId, request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
          this.ref.close(true);
        });
      } else {
        this.ref.close();
      }
    });
  }

  setRequest(): any {
    let data = {};
    data = {
      flagSendEmail: this.sendEmail,
      mailOptions: this.mailOptions,
      mailType: this.mailType,
      actionUser: this.actionUser,
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
