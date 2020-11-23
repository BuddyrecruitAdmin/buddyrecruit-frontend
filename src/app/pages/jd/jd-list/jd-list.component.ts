import { Component, OnInit } from '@angular/core';
import { JdService } from '../jd.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging } from '../../../shared/interfaces/common.interface';
import { getRole, setIsGridLayout, getAuthentication, setAuthentication } from '../../../shared/services/auth.service';
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
  items: any = [];
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  minPageSize = Paging.pageSizeOptions[0];
  loading: boolean;
  isGridLayout: boolean;
  showTips: {
    jobPosition: boolean,
    department: boolean,
  }
  isHybrid: any;
  constructor(
    private service: JdService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private authorizeService: AuthorizeService
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
    this.isGridLayout = this.utilitiesService.setIsGridLayout();
    if (this.role.refAuthorize.jd.editable) {
      this.showTips = {
        jobPosition: false,
        department: false
      };
    }
    this.isHybrid = this.role.refCompany.isHybrid;
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
    };
    this.items = [];
    this.service.getList(this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.items.forEach(element => {
          if (element.department_id) {
            this.getDepartmentName(element.department_id, element);
          }
        });
        this.paging.length = response.totalDataSize;
        if (!this.items.length && this.paging.pageIndex > 0) {
          this.paging.pageIndex--;
          this.search();
        }
      }
      this.loading = false;
    });
  }

  getDepartmentName(arr, item) {
    item.divisionName = arr.val || '';
    // if (arr.list.length > 0) {
    //   arr.list.forEach((ele, i) => {
    //     if (i === 0) {
    //       item.departmentName = ele.val || '';
    //       if (ele.list.length > 0) {
    //         ele.list.forEach((data, j) => {
    //           if (j === 0) {
    //             item.sectionName = data.val || '';
    //           }
    //         });
    //       }
    //     }
    //   });
    // }
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
