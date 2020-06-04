import { Component, OnInit, TemplateRef } from '@angular/core';
import { Criteria, Paging as IPaging, Devices } from '../../../shared/interfaces/common.interface';
import { PageEvent } from '@angular/material/paginator';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { JobPositionService } from '../job-position/job-position.service';
import { MatDialog } from '@angular/material';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { getRole, getJdName, getJrId, setFlowId, getIsGridLayout, setIsGridLayout } from '../../../shared/services/auth.service';
import { NbDialogService, NbDialogRef, NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import * as _ from 'lodash';
import { DropDownValue } from '../../../shared/interfaces/common.interface';
@Component({
  selector: 'ngx-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent implements OnInit {
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
  provinceList: DropDownValue[];
  provinceSelect: any;
  filteredList: any;
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

  edit(item: any, dialog: TemplateRef<any>) {
    this.itemDialog = _.cloneDeep(item);
    this.loading = true;
    this.loadState().then((response) => {
      this.callDialog(dialog);
    })
  }

  async loadState() {
    await this.loadProvince();
  }

  loadProvince() {
    return new Promise((resolve) => {
      this.provinceList = [];
      this.service.getProvince().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          response.data.forEach(item => {
            this.provinceList.push({
              label: item.name,
              value: item._id
            });
          });
          this.filteredList = this.provinceList.slice();
        }
        resolve();
      });
    });
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
