import { Component, OnInit } from '@angular/core';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getJrId, getJdName, setJrId, setJdName } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { JrService } from '../../pages/jr/jr.service';
import { Devices } from '../../shared/interfaces/common.interface';
@Component({
  selector: 'ngx-popup-jr-info',
  templateUrl: './popup-jr-info.component.html',
  styleUrls: ['./popup-jr-info.component.scss']
})
export class PopupJrInfoComponent implements OnInit {
  role: any;
  innerWidth: any;
  jrId: any;
  loading: boolean;
  jrDetail: any = '';
  devices: Devices;
  constructor(
    public ref: NbDialogRef<PopupJrInfoComponent>,
    private jrService: JrService,
    public utilitiesService: UtilitiesService,
  ) {
    this.role = getRole();
    this.jrId = getJrId();
    setJrId();
    this.devices = this.utilitiesService.getDevice();
    if (this.devices.isMobile) {
      this.innerWidth = window.innerWidth * 0.8;
    } else {
      this.innerWidth = window.innerWidth * 0.4;
    }
  }

  ngOnInit() {
    this.loading = true;
    this.jrService.getDetail(this.jrId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.jrDetail = response.data;
        this.loading = false;
      }
    });
  }
}
