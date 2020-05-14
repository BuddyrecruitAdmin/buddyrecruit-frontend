import { Component, OnInit } from '@angular/core';
import { getCompanyName, getFlagConsent, setFlagConsent } from '../../shared/services/auth.service';
import { NbDialogRef } from '@nebular/theme';
import { UtilitiesService } from '../../shared/services/utilities.service';
@Component({
  selector: 'ngx-popup-consent',
  templateUrl: './popup-consent.component.html',
  styleUrls: ['./popup-consent.component.scss']
})
export class PopupConsentComponent implements OnInit {
  companyName: any;
  checked: boolean;
  innerHeight: any;
  innerWidth: any;
  constructor(
    public ref: NbDialogRef<PopupConsentComponent>,
    private utilitiesService: UtilitiesService,
  ) {
    this.companyName = getCompanyName();
    this.checked = getFlagConsent();
    this.innerHeight = window.innerHeight;
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
  }

  ngOnInit() {
  }

  toggle(checked: boolean) {
    this.checked = checked;
  }

  sendStatus(status) {
    setFlagConsent(this.checked);
    this.ref.close(status);
  }

}
