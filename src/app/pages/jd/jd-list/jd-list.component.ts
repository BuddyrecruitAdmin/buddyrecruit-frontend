import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { JdService } from '../jd.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices } from '../../../shared/interfaces/common.interface';
import { getRole, getIsGridLayout, setIsGridLayout, getAuthentication, setAuthentication } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AuthorizeService } from '../../../pages/setting/authorize/authorize.service';
import { JobPositionService } from '../../../pages/setting/job-position/job-position.service';
import { DepartmentService } from '../../../pages/setting/department/department.service';

@Component({
  selector: 'ngx-jd-list',
  templateUrl: './jd-list.component.html',
  styleUrls: ['./jd-list.component.scss']
})
export class JdListComponent implements OnInit {
  role: any;
  items: [];
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  minPageSize = Paging.pageSizeOptions[0];
  devices: Devices;
  loading: boolean;
  isGridLayout: boolean;
  showTips: {
    jobPosition: boolean,
    department: boolean,
  }

  constructor(
    private router: Router,
    private service: JdService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private authorizeService: AuthorizeService,
    private jobPositionService: JobPositionService,
    private departmentService: DepartmentService,
  ) {
    this.role = getRole();
    if (this.role && this.role.refAuthorize) {
      this.authorizeService.getDetail(this.role.refAuthorize._id).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.role.refAuthorize = response.data;
          let token = getAuthentication();
          token.role = this.role;
          setAuthentication(token);
        }
      });
    }
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
    this.isGridLayout = getIsGridLayout();
    if (!this.isGridLayout) {
      if (this.devices.isMobile || this.devices.isTablet) {
        this.isGridLayout = true;
      } else {
        this.isGridLayout = false;
      }
    }
    if (this.role.refAuthorize.jd.editable) {
      this.showTips = {
        jobPosition: false,
        department: false
      };
      this.jobPositionService.getList().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (!response.data || !response.data.length) {
            this.showTips.jobPosition = true;
          }
        }
      });
      this.service.getList(undefined, this.role.refCompany).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (!response.data || !response.data.length) {
            this.showTips.department = true;
          }
        }
      });
    }
  }

  ngOnInit() {
    this.loading = true;
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    };

    this.search();
  }

  search() {
    this.loading = true;
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'position',
        'department',
        'keywordSearch',
        'division',
      ]
    };
    this.items = [];
    this.service.getList(this.criteria, this.role.refCompany).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.paging.length = response.totalDataSize;
        if (!this.items.length && this.paging.pageIndex > 0) {
          this.paging.pageIndex--;
          this.search();
        }
      }
      this.loading = false;
    });
  }

  changeLayout(value) {
    this.isGridLayout = value;
    setIsGridLayout(value);
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

  delete(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'D' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
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
