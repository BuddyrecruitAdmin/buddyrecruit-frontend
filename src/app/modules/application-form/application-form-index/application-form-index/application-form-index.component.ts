import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { ResponseCode } from '../../../../shared/app.constants';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';

import { setLangPath, setLanguage, getLanguage, setAppformIndex } from '../../../../shared/services';
import { TranslateService } from '../../../../translate.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { ApplicationFormService } from '../../application-form.service';

@Component({
  selector: 'ngx-application-form-index',
  templateUrl: './application-form-index.component.html',
  styleUrls: ['./application-form-index.component.scss']
})
export class ApplicationFormIndexComponent implements OnInit {
  innerHeight: any;
  language = 'en';
  loading = false;

  companyId: string;
  appformId: string;

  phone: string;
  birth: Date;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private service: ApplicationFormService,
  ) {
    this.innerHeight = window.innerHeight;
    this.language = getLanguage() || 'en';
    this.setLang(this.language);
    setLangPath("RESUME");
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.companyId = params.id;
    });
  }

  setLang(lang) {
    this.language = lang;
    this.translate.use(lang);
    setLanguage(this.language);
  }

  checkStatus() {
    if (this.phone && this.birth) {
      this.loading = true;
      const birth = new Date(this.birth.getFullYear(), this.birth.getMonth(), this.birth.getDate() + 1)
      this.service.getStatusList(this.companyId, this.phone, birth).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          const appFormIndex = {
            companyId: this.companyId,
            phone: this.phone,
            birth: birth,
          };
          setAppformIndex(appFormIndex);
          this.router.navigate(['/application-form/status']);
        } else {
          this.matDialog.open(PopupMessageComponent, {
            width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
            data: {
              type: 'I',
              content: this.language === 'en' ? 'No registered.' : 'ไม่พบข้อมูลการสมัครงาน',
            }
          });
        }
        this.loading = false;
      });
    }
  }

  register() {
    this.router.navigate([`/application-form/submit/${this.companyId}`]);
  }

}
