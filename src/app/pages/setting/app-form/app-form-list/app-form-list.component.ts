import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import * as _ from 'lodash';

import { ResponseCode, Paging } from '../../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices } from '../../../../shared/interfaces/common.interface';

import { AppFormService } from '../app-form.service';
import { getRole, getIsGridLayout, setIsGridLayout, getAppURL } from '../../../../shared/services/auth.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';
@Component({
  selector: 'ngx-app-form-list',
  templateUrl: './app-form-list.component.html',
  styleUrls: ['./app-form-list.component.scss']
})
export class AppFormListComponent implements OnInit {
  items: any;
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  minPageSize = Paging.pageSizeOptions[0];
  loading: boolean;
  devices: Devices;
  isGridLayout: boolean;
  role: any;
  haveActive = false;
  url: string;
  isExpress: boolean;
  appformURL: any;
  constructor(
    private router: Router,
    private service: AppFormService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
    this.isGridLayout = getIsGridLayout();
    this.appformURL = getAppURL();
    if (!this.isGridLayout) {
      if (this.devices.isMobile || this.devices.isTablet) {
        this.isGridLayout = true;
      } else {
        this.isGridLayout = false;
      }
    }
    this.isExpress = this.role.refCompany.isExpress;
    if (this.isExpress) {
      // this.url = window.location.origin + '/application-form/index/' + this.role.refCompany._id;
      this.url = (this.appformURL) ? this.appformURL : 'https://qas-application.web.app/index/';
      this.url = this.url + this.role.refCompany._id;
      // this.url = 'https://qas-application.web.app/index/' + this.role.refCompany._id;
    } else {
      this.url = (this.appformURL) ? this.appformURL : 'https://qas-application.web.app/appform/submit/';
      this.url = this.url + this.role.refCompany._id;
      // this.url = window.location.origin + '/application-form/submit/' + this.role.refCompany._id;
      // this.url = 'https://qas-application.web.app/appform/submit/' + this.role.refCompany._id;

    }
  }

  ngOnInit() {
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.search();
  }

  search() {
    this.loading = true;
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'formName',
        'formRemark',
      ]
    };
    this.items = [];
    this.service.getList(this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.paging.length = response.totalDataSize;

        if (this.items.find(item => {
          return item.active;
        })) {
          this.haveActive = true;
        }
      }
      this.loading = false;
    });
  }

  preview(item: any) {
    // this.url = 'https://applicationform-e3e84.web.app/appform/submit/' + this.role.refCompany._id;
    // const url = `/application-form/preview/${item._id}`;
    this.url = (this.appformURL) ? this.appformURL : 'https://qas-application.web.app/appform/preview/';
    this.url = this.url + this.role.refCompany._id;
    // const url = 'https://qas-application.web.app/appform/preview/' + this.role.refCompany._id;
    this.router.navigate([]).then(result => { window.open(this.url, '_blank'); });
  }

  copyToClipboardByCompany() {
    const el = document.createElement('textarea');
    el.value = this.url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.showToast('success', 'Copied!', '');
  };

  copyToClipboard(item: any) {
    const el = document.createElement('textarea');
    el.value = window.location.origin + '/application-form/index/' + item._id;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.showToast('success', 'Copied!', '');
  };

  delete(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'D' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.service.deleteItem(item).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.search();
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    });
  }

  toggleActive(item) {
    this.service.toggleActive(item._id, item.active).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
        this.search();
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    });
  }

  changePaging(event) {
    this.paging = {
      length: event.length,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.search();
  }

  changeLayout(value) {
    this.isGridLayout = value;
    setIsGridLayout(value);
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 5000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    this.toastrService.show(body, title, config);
  }
}
