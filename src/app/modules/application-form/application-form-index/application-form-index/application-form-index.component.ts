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

import { setLangPath, setLanguage, getLanguage, setAppformIndex, getRole, setAppFormData, setFacebookId } from '../../../../shared/services';
import { TranslateService } from '../../../../translate.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { ApplicationFormService } from '../../application-form.service';
import { FormControl, Validators } from '@angular/forms';

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
  language = 'th';
  loading = false;

  companyId: string;
  appformId: string;

  phone: string;
  idCard: string;
  // birth: Date;
  companyName: string;
  fIdCard: FormControl;
  IdError: string;
  faceId: any;
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
    // this.language = getLanguage() || 'th';
    this.setLang(this.language);
  }

  ngOnInit() {
    this.fIdCard = new FormControl('', [Validators.required, Validators.minLength(13)]);
    this.activatedRoute.queryParams.subscribe(param => {
      console.log(param.id);
      if (param.id) {
        this.faceId = param;
        setFacebookId(param);
      } else {
        setFacebookId();
      }
    })
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
    if (this.validation()) {
      this.loading = true;
      // let birth = new Date(this.birth);
      // birth = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate() + 1);
      this.service.getStatusList(this.companyId, this.idCard, this.faceId).subscribe(response => {
        const appFormIndex = {
          companyId: this.companyId,
          // phone: this.phone,
          idCard: this.idCard,
        };
        if (response.code === ResponseCode.Success) {
          setAppformIndex(appFormIndex);
          this.router.navigate(['/application-form/status']);
        } else if (response.code === ResponseCode.Unauthorized) {
          this.matDialog.open(PopupMessageComponent, {
            width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
            data: {
              type: 'I',
              content: response.message,
            }
          });
        } else {
          setAppformIndex(appFormIndex);
          this.router.navigate([`/application-form/submit/${this.companyId}`]);
        }
        this.loading = false;
      });
    }
  }

  validation(): boolean {
    let isValid = true;
    this.IdError = '';
    if (this.idCard.length !== 13 || this.idCard.toString().substring(0, 1) === '0') {
      isValid = false;
      this.IdError = 'เลขบัตรประชาชนไม่ถูกต้อง';
      this.fIdCard.setErrors({})
    }
    return isValid;
  }
  // ยุบปุ่มรวมกันเเยกcase ข้างบน
  // register() {
  //   this.router.navigate([`/application-form/submit/${this.companyId}`]);
  // }

}
