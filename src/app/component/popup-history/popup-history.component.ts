import { Component, OnInit } from '@angular/core';
import { getHistoryData } from '../../shared/services';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { NbDialogRef } from '@nebular/theme';
@Component({
  selector: 'ngx-popup-history',
  templateUrl: './popup-history.component.html',
  styleUrls: ['./popup-history.component.scss']
})
export class PopupHistoryComponent implements OnInit {
  item: any;
  innerWidth: any;
  innerHeight: any;
  constructor(
    public ref: NbDialogRef<PopupHistoryComponent>,
    private utilitiesService: UtilitiesService,
  ) {
    this.item = getHistoryData();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.8;
  }

  ngOnInit() {
  }

}
