import { Component, OnInit, TemplateRef } from '@angular/core';
import { JobPositionService } from './job-position.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId, getIsGridLayout, setIsGridLayout } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
@Component({
  selector: 'ngx-job-position',
  templateUrl: './job-position.component.html',
  styleUrls: ['./job-position.component.scss']
})
export class JobPositionComponent implements OnInit {
  role: any;
  items: any;
  itemDialog: any;
  statusList = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];
  dialogRef: NbDialogRef<any>;

  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  loading: boolean;
  minPageSize = Paging.pageSizeOptions[0];
  devices: Devices;
  isGridLayout: boolean;
  noticeHeight: any;
  isExpress: boolean = false;
  constructor(
    private service: JobPositionService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
    this.isGridLayout = getIsGridLayout();
    this.noticeHeight = window.innerHeight * 0.85;
    this.isExpress = this.role.refCompany.isExpress;
    if (!this.isGridLayout) {
      if (this.devices.isMobile || this.devices.isTablet) {
        this.isGridLayout = true;
      } else {
        this.isGridLayout = false;
      }
    }
  }

  ngOnInit() {
    this.loading = true;
    this.refresh();
  }

  initialModel(): any {
    const itemDialog = {
      _id: undefined,
      name: undefined,
      remark: undefined,
      active: undefined,
      isUsed: undefined,
      specification: undefined,
      qualification: undefined
    }
    return itemDialog;
  }

  refresh() {
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
        'name',
        'lastChangedInfo.refUser.firstname',
        'lastChangedInfo.refUser.lastname',
        'lastChangedInfo.date',
        'remark',
        'active',
      ]
    };
    this.items = [];
    this.service.getList(this.criteria).subscribe(response => {
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

  create(dialog: TemplateRef<any>) {
    this.itemDialog = this.initialModel();
    if (this.isExpress) {
      this.itemDialog.active = false;
    } else {
      this.itemDialog.active = true;
    }
    this.callDialog(dialog);
  }

  edit(item: any, dialog: TemplateRef<any>) {
    this.itemDialog = _.cloneDeep(item);
    this.callDialog(dialog);
  }

  save() {
    if (this.dialogRef) {
      if (this.itemDialog._id) {
        this.service.edit(this.itemDialog).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.dialogRef.close();
            this.showToast('success', 'Success Message', response.message);
            this.search();
          } else {
            this.dialogRef.close();
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      } else {
        this.service.create(this.itemDialog).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            const pageIndex = Math.ceil((this.paging.length + 1) / this.paging.pageSize);
            this.paging.pageIndex = pageIndex - 1;
            this.dialogRef.close();
            this.showToast('success', 'Success Message', response.message);
            this.search();
          } else {
            this.dialogRef.close();
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    }
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

  changePaging(event) {
    this.paging = {
      length: event.length,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.loading = true;
    this.search();
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
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
