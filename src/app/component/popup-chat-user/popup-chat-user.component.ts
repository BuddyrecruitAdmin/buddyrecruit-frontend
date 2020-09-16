import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId, setButtonId, getButtonId, setIconId, getIconId, setHistoryData, setFlagEdit } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { PopupResendEmailComponent } from '../../component/popup-resend-email/popup-resend-email.component';
import { Devices } from '../../shared/interfaces/common.interface';


@Component({
  selector: 'ngx-popup-chat-user',
  templateUrl: './popup-chat-user.component.html',
  styleUrls: ['./popup-chat-user.component.scss']
})
export class PopupChatUserComponent implements OnInit {

  role: any;
  items: any;
  flowId: any;
  candidateId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  textTemp: string = '';
  loading: boolean;
  infoFlag: boolean;
  devices: Devices;
  condition: any;
  checkChange: boolean = false;
  fbName: string;
  fbLink: any;
  jrName: any;
  constructor(
    private candidateService: CandidateService,
    public ref: NbDialogRef<PopupChatUserComponent>,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    setButtonId();
    setFlowId();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight;
    this.devices = this.utilitiesService.getDevice();
  }

  ngOnInit() {
    this.loading = true;
    this.fbLink = '';
    this.items = [];
    this.infoFlag = false;
    this.condition = {
      flag: false
    };
    this.candidateName = '';
    this.fbName = '';
    if (this.flowId) {
      this.getDetail();
    } else {
      this.ref.close();
    }
  }

  getDetail() {
    this.items = [];
    this.candidateService.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data.candidateFlow.inboxes.length > 0) {
          response.data.candidateFlow.inboxes.forEach(element => {
            this.items.push({
              _id: element._id,
              name: this.utilitiesService.setFullname(element.refUser),
              title: this.utilitiesService.convertDateTimeFromSystem(element.date),
              picture: element.refUser.imageData,
              message: element.message,
              accent: element.refUser._id === this.role._id ? 'success' : 'default',
            })
          });
        }
        this.candidateName = this.utilitiesService.setFullname(response.data);
        this.fbName = (response.data.FBInfo) ? this.utilitiesService.setFullname(response.data.FBInfo) : '';
        this.fbLink = (response.data.FBInfo) ? response.data.FBInfo.conversationsLink : '';
        this.condition = response.data.candidateFlow.offer;
        this.infoFlag = response.data.candidateFlow.offer.flag;
        this.jrName = response.data.candidateFlow.refJR.refJD.position;
        if (this.checkChange) {
          this.checkChange = false;
          setHistoryData(response.data.candidateFlow.inboxes);
          setFlagEdit('true')
        }
      }
      this.loading = false;
    });
  }

  save() {
    // if (this.textTemp.length <= 2000) {
    this.loading = true;
    const request = this.setRequest();
    this.candidateService.sendMessage(this.flowId, request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
        this.textTemp = '';
        this.checkChange = true;
        this.getDetail();
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
      this.loading = false;
    });
    // }
  }

  setRequest(): any {
    const data = {
      offer: {
        flag: this.infoFlag
      },
      textTemp: this.textTemp
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

