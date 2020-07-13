import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NbDialogService } from '@nebular/theme';

import { ResponseCode } from '../../../../shared/app.constants';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';

import { setLangPath, setLanguage, getLanguage, getAppformIndex, setUserToken, setAppFormData, setFlowId, setUserSuccess, setAppformIndex, setAppformStatus, setUserEmail, setFacebookId, getFacebookId } from '../../../../shared/services';
import { TranslateService } from '../../../../translate.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { ApplicationFormService } from '../../application-form.service';

export interface TableElement {
  appFormId: string;
  flowId: string;
  position: string;
  hub: string;
  hubStatus: string;
  date: string;
  trainDate: string;
  startDate: string;
  status: any;
  comId: string;
  action: boolean;
}

@Component({
  selector: 'ngx-application-form-status',
  templateUrl: './application-form-status.component.html',
  styleUrls: ['./application-form-status.component.scss']
})
export class ApplicationFormStatusComponent implements OnInit {
  language = 'en';
  loading = true;

  displayedColumns: string[] = ['position', 'hub', 'hubStatus', 'date', 'trainDate', 'startDate', 'status', 'action'];
  dataSource: TableElement[] = [];
  tokenId: any;
  fullName: string;
  comName: string;
  hubName: string;
  actionUser: any;
  facebook: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private service: ApplicationFormService,
    private dialogService: NbDialogService
  ) {
    setLangPath("RESUME");
    this.language = getLanguage() || 'en';
    this.setLang(this.language);
    this.facebook = getFacebookId();
  }

  ngOnInit() {
    this.getStatusList();
  }

  setLang(lang) {
    this.language = lang;
    this.translate.use(lang);
    setLanguage(this.language);
  }

  getStatusList() {
    const data = getAppformIndex();
    if (data) {
      this.service.getStatusList(data.companyId, data.idCard, this.facebook).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.dataSource = [];
          this.tokenId = response.data.token;
          this.actionUser = response.data.action;
          this.hubName = '-'
          this.comName = response.data.company.name || '';
          this.fullName = response.data ?
            `${response.data.title} ${response.data.firstname} ${response.data.lastname}` : 'Unknown';
          response.data.positions.forEach(element => {
            if (element.hub.province) {
              this.hubName = element.hub.province + ' (' + element.hub.area + ')';
            }
            this.dataSource.push({
              comId: response.data.company._id,
              flowId: "",
              position: element.position,
              hub: this.hubName,
              hubStatus: element.hub.status,
              date: this.utilitiesService.convertDateTimeFromSystem(element.date.apply) || '-',
              trainDate: this.utilitiesService.convertDateTimeFromSystem(element.date.training) || '-',
              startDate: this.utilitiesService.convertDateTimeFromSystem(element.date.onboard) || '-',
              status: this.setStatus(element.stage),
              appFormId: element.generalAppFormId,
              action: element.action
            });
          });
          // response.data.forEach(element => {
          //   this.comName = element.refCompany.name || '';
          //   this.fullName = element.refCandidate ?
          //     `${element.refCandidate.title} ${element.refCandidate.firstname} ${element.refCandidate.lastname}` : 'Unknown';
          //   if (element.hubs.length > 0) {
          //     element.hubs.forEach(element => {
          //       this.hubName = element.refProvince.name.th + ' (' + element.hubName + ')';
          //       if (element.status) {
          //         this.hubName = this.hubName + ' - ' + element.status;
          //       }
          //     });

          //   }
          //   this.dataSource.push({
          //     comId: element.refJR.refJD.refPosition.refCompany,
          //     flowId: element._id,
          //     position: element.refJR.refJD.position,
          //     date: this.utilitiesService.convertDateTimeFromSystem(element.timestamp) || '-',
          //     status: this.setStatus(element),
          //     appFormId: element.generalAppForm,
          //     hub: this.hubName,
          //     isSuccessed: element.isSuccessed
          //   });
          // });
        }
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  setStatus(element): any {
    let status = {
      nameEN: '',
      nameTH: '',
      color: '',
      editable: true,
      reserve: false,
    };
    switch (element.order.toString().substring(0, 1)) {
      case '0':
        status.color = 'label-danger';
        break
      case '1' || '2':
        status.color = 'label-warning';
        if (element.isSuccessed) {
          // status.nameEN = 'Registered';
          status.nameTH = 'ยื่นสมัครแล้ว';
        }
        break;

      case '3':
        // if (this.utilitiesService.convertDateTime(element.pendingInterviewInfo.startDate)) {
        //   status.nameEN = 'Interview date confirmed';
        //   status.nameTH = 'ยืนยันวันสัมภาษณ์แล้ว';
        //   status.color = 'label-primary';
        // } else {
        //   status.nameEN = 'Confirm nterview date';
        //   status.nameTH = 'รอการยืนยันวันสัมภาษณ์';
        //   status.color = 'label-info';
        //   status.reserve = true;
        // }
        break;

      case '4':
        // status.nameEN = 'Waiting for Approval';
        status.nameTH = 'รอการพิจารณา';
        status.color = 'label-warning';
        break;
      case '5':
        status.color = 'label-warning';
        break;

      case '7':
        // status.nameEN = 'Waiting more information';
        status.nameTH = 'รอการเพิ่มข้อมูล';
        status.color = 'label-warning';
        break;

      default:
        // status.nameEN = 'Approved';
        status.nameTH = 'ผ่านการพิจารณา';
        status.color = 'label-success';
        status.editable = false;
        break;

    }

    // Replace from backend
    // status.nameEN = (element.refStage.text && element.refStage.text.en) || status.nameEN;
    status.nameTH = element.text || status.nameTH;
    // status.editable = !element.isSuccessed;
    // status.reserve = element.isReserve;

    return status;
  }

  editAppForm(comId: string, appFormId: string, flowId: string, isSuccessed) {
    // canUploadOnly
    setUserSuccess(isSuccessed.canUploadOnly);
    setUserToken(this.tokenId);
    setAppFormData(appFormId);
    setFlowId(flowId);
    this.router.navigate([`/application-form/edit/${comId}`]);
  }
  // element.appFormId
  // appformId
  createNew() {
    if (this.actionUser.canCreate && this.actionUser.reSign) {
      setUserEmail('skipEmail')
      let message = 'You are already an employee in company.';
      let message2 = ['Do you want to register again?'];
      if (this.language === 'th') {
        message = 'ท่านผ่านการพิจารณาเป็นพนักงานเรียบร้อยเเล้ว';
        message2 = ['ท่านต้องการที่จะสมัครงานใหม่หรือไม่']
      }
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'W', content: message, contents: message2 }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          window.close();
          const data = {
            token: this.tokenId,
            appformId: this.dataSource[this.dataSource.length - 1].appFormId
          }
          setAppformStatus(data);
          this.router.navigate([`/application-form/submit/${this.dataSource[this.dataSource.length - 1].comId}`]);
        }
      });
    } else {
      const data = {
        token: this.tokenId,
        appformId: this.dataSource[this.dataSource.length - 1].appFormId
      }
      setAppformStatus(data);
      this.router.navigate([`/application-form/submit/${this.dataSource[this.dataSource.length - 1].comId}`]);
    }
  }

  reserveDate(dialog: TemplateRef<any>, flowId: string) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

}
