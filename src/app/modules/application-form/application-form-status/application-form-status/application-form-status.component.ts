import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NbDialogService } from '@nebular/theme';

import { ResponseCode } from '../../../../shared/app.constants';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';

import { setLangPath, setLanguage, getLanguage, getAppformIndex } from '../../../../shared/services';
import { TranslateService } from '../../../../translate.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { ApplicationFormService } from '../../application-form.service';

export interface TableElement {
  appFormId: string;
  flowId: string;
  position: string;
  date: string;
  status: any;
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private service: ApplicationFormService,
    private dialogService: NbDialogService
  ) {
    this.language = getLanguage() || 'en';
    this.setLang(this.language);
    setLangPath("RESUME");
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
          response.data.data.forEach(element => {
            this.dataSource.push({
              appFormId: element.generalAppForm.refGeneralAppForm._id,
              flowId: element._id,
              position: element.refJR.refJD.position,
              date: this.utilitiesService.convertDateTime(element.pendingInterviewInfo.startDate) || '-',
              status: this.setStatus(element),
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
      status.nameEN = 'Rejected';
      status.nameTH = 'ไม่ผ่านการพิจารณา';
      status.color = 'label-gray';
    } else {
      switch (element.refStage.order.toString().substring(0, 1)) {
        case '1' || '2':
          status.nameEN = 'Registered';
          status.nameTH = 'ยื่นสมัครแล้ว';
          status.color = 'label-info';
          status.editable = true;
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

        default:
          status.nameEN = 'Approved';
          status.nameTH = 'ผ่านการพิจารณา';
          status.color = 'label-success';
          break;
      }
    }
    return status;
  }

  editAppForm(appFormId: string) {

  }

  reserveDate(dialog: TemplateRef<any>, flowId: string) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

}
