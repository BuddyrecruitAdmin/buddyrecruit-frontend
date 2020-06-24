import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';

import { ResponseCode } from '../../../../shared/app.constants';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';

import { setLangPath, setLanguage, getLanguage, setAppformIndex, getRole } from '../../../../shared/services';
import { TranslateService } from '../../../../translate.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { ApplicationFormService } from '../../application-form.service';

@Component({
  selector: 'ngx-application-form-index',
  templateUrl: './application-form-index.component.html',
  styleUrls: ['./application-form-index.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ApplicationFormIndexComponent implements OnInit {
  role: any;
  innerHeight: any;
  language = 'en';
  loading = false;

  companyId: string;
  appformId: string;

  phone: string;
  idCard: string;
  // birth: Date;
  companyName: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private service: ApplicationFormService,
    private _adapter: DateAdapter<any>
  ) {
    this.role = getRole();
    this.innerHeight = window.innerHeight;
    setLangPath("RESUME");
    this.language = getLanguage() || 'en';
    this.setLang(this.language);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.companyId = params.id;
      this.service.getCompany(this.companyId).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.companyName = response.data.name;
        }
      })
    });
  }

  setLang(lang) {
    this.language = lang;
    this.translate.use(lang);
    this._adapter.setLocale(lang === 'en' ? 'en-GB' : 'th-TH');
    setLanguage(this.language);
  }

  checkStatus() {
    if (this.phone && this.idCard) {
      this.loading = true;
      // let birth = new Date(this.birth);
      // birth = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate() + 1);
      this.service.getStatusList(this.companyId, this.phone, this.idCard).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          const appFormIndex = {
            companyId: this.companyId,
            phone: this.phone,
            idCard: this.idCard,
          };
          setAppformIndex(appFormIndex);
          this.router.navigate(['/application-form/status']);
        } else {
          this.router.navigate([`/application-form/submit/${this.companyId}`]);
          // this.matDialog.open(PopupMessageComponent, {
          //   width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
          //   data: {
          //     type: 'I',
          //     content: this.language === 'en' ? 'No registered.' : 'ไม่พบข้อมูลการสมัครงาน',
          //   }
          // });
        }
        this.loading = false;
      });
    }
  }
  // ยุบปุ่มรวมกันเเยกcase ข้างบน
  // register() {
  //   this.router.navigate([`/application-form/submit/${this.companyId}`]);
  // }

}
