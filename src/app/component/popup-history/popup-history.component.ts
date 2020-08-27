import { Component, OnInit } from '@angular/core';
import { getHistoryData } from '../../shared/services';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { NbDialogRef } from '@nebular/theme';
import { ResponseCode } from '../../shared/app.constants';
import { CandidateService } from '../../pages/candidate/candidate.service'
@Component({
  selector: 'ngx-popup-history',
  templateUrl: './popup-history.component.html',
  styleUrls: ['./popup-history.component.scss']
})
export class PopupHistoryComponent implements OnInit {
  items: any;
  _id: any;
  innerWidth: any;
  innerHeight: any;
  loading: boolean;
  constructor(
    public ref: NbDialogRef<PopupHistoryComponent>,
    private service: CandidateService,
    private utilitiesService: UtilitiesService,
  ) {
    this._id = getHistoryData();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.8;
  }

  ngOnInit() {
    this.items = {
      exist: true,
      latest: []
    };
    this.loading = true;
    this.service.getHistory(this._id).subscribe(response => {
      if (ResponseCode.Success === response.code) {
        this.items = response.data;
      }
      this.loading = false;
    })
  }

}
