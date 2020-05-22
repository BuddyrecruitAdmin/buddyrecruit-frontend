import { Component, OnInit } from '@angular/core';
import { getCompanyName, getFlagConsent, setFlagConsent, getCompanyId } from '../../shared/services/auth.service';
import { NbDialogRef } from '@nebular/theme';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { ConsentListService } from '../../pages/setting/consent/consent-list.service';
import { ResponseCode } from '../../shared/app.constants';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'ngx-popup-consent',
  templateUrl: './popup-consent.component.html',
  styleUrls: ['./popup-consent.component.scss']
})
export class PopupConsentComponent implements OnInit {
  companyName: any;
  companyId: any;
  checked: boolean;
  innerHeight: any;
  innerWidth: any;
  text: SafeHtml;
  constructor(
    public ref: NbDialogRef<PopupConsentComponent>,
    private utilitiesService: UtilitiesService,
    private service: ConsentListService,
    public sanitizer: DomSanitizer
  ) {
    this.companyName = getCompanyName();
    this.companyId = getCompanyId();
    this.checked = getFlagConsent();
    this.innerHeight = window.innerHeight * 0.8;
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
  }

  ngOnInit() {
    this.service.getDetail(this.companyId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.text = this.sanitizer.bypassSecurityTrustHtml(response.data.text);
      }
    })
  }

  toggle(checked: boolean) {
    this.checked = checked;
  }

  sendStatus(status) {
    setFlagConsent(this.checked);
    this.ref.close(status);
  }

}
