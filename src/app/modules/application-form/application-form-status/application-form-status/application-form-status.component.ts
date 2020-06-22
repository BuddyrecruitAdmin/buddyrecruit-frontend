import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NbDialogService } from '@nebular/theme';

import { ResponseCode } from '../../../../shared/app.constants';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';

import { setLangPath, setLanguage, getLanguage, getAppformIndex, setUserToken, setAppFormData, setFlowId } from '../../../../shared/services';
import { TranslateService } from '../../../../translate.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { ApplicationFormService } from '../../application-form.service';

export interface TableElement {
  appFormId: string;
  flowId: string;
  position: string;
  date: string;
  status: any;
  comId: string;
}

@Component({
  selector: 'ngx-application-form-status',
  templateUrl: './application-form-status.component.html',
  styleUrls: ['./application-form-status.component.scss']
})
export class ApplicationFormStatusComponent implements OnInit {
  language = 'en';
  loading = true;

  displayedColumns: string[] = ['position', 'date', 'status', 'action'];
  dataSource: TableElement[] = [];
  tokenId: any;
  fullName: string;

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
      this.service.getStatusList(data.companyId, data.phone, data.birth).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.dataSource = [];
          this.tokenId = response.data.token;
          response.data.data.forEach(element => {
            this.fullName = element.refCandidate ?
              `${element.refCandidate.title} ${element.refCandidate.firstname} ${element.refCandidate.lastname}` : 'Unknown';
            this.dataSource.push({
              comId: element.refJR.refJD.refPosition.refCompany,
              flowId: element._id,
              position: element.refJR.refJD.position,
              date: this.utilitiesService.convertDateTime(element.pendingInterviewInfo.startDate) || '-',
              status: this.setStatus(element),
              appFormId: element.generalAppForm
            });
          });
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
      editable: false,
      reserve: false,
    };

    if (element.reject.flag) {
      status.color = 'label-gray';
    } else {
      switch (element.refStage.order.toString().substring(0, 1)) {
        case '1' || '2':
          status.color = 'label-info';
          status.editable = true;
          if (element.isSuccessed) {
            status.nameEN = 'Registered';
            status.nameTH = 'ยื่นสมัครแล้ว';
          } else {
            status.nameEN = 'Waiting more information';
            status.nameTH = 'รอการเพิ่มข้อมูล';
            status.color = 'label-warning';
          }
          break;

        case '3':
          if (this.utilitiesService.convertDateTime(element.pendingInterviewInfo.startDate)) {
            status.nameEN = 'Interview date confirmed';
            status.nameTH = 'ยืนยันวันสัมภาษณ์แล้ว';
            status.color = 'label-primary';
          } else {
            status.nameEN = 'Confirm nterview date';
            status.nameTH = 'รอการยืนยันวันสัมภาษณ์';
            status.color = 'label-info';
            status.reserve = true;
          }
          break;

        case '4':
          status.nameEN = 'Waiting for Approval';
          status.nameTH = 'รอการพิจารณา';
          status.color = 'label-warning';
          break;

        case '7':
          status.color = 'label-warning';
          break;

        default:
          status.nameEN = 'Approved';
          status.nameTH = 'ผ่านการพิจารณา';
          status.color = 'label-success';
          break;
      }
    }

    // Replace from backend
    status.nameEN = (element.refStage.text && element.refStage.text.en) || status.nameEN;
    status.nameTH = (element.refStage.text && element.refStage.text.th) || status.nameTH;
    status.editable = !element.isSuccessed;
    status.reserve = element.isReserve;

    return status;
  }

  editAppForm(comId: string, appFormId: string, flowId: string) {
    setUserToken(this.tokenId);
    setAppFormData(appFormId);
    setFlowId(flowId);
    this.router.navigate([`/application-form/edit/${comId}`]);
  }

  reserveDate(dialog: TemplateRef<any>, flowId: string) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

}
