import { Component, OnInit, TemplateRef } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging } from '../../../shared/interfaces/common.interface';
import { getRole } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

export interface Item {
  _id?: any;
  code: string;
  name: string;
  active: boolean;
  isFree: boolean;
  price: number;
  isNew: boolean;
}

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  role: any;
  masterList: Item[];
  items: Item[];
  itemDialog: any;
  CheckPrice: any;
  statusList = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];
  dialogRef: NbDialogRef<any>;
  candidateText: string;
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  minPageSize = Paging.pageSizeOptions[0];
  loading: boolean;

  constructor(
    private service: DashboardService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.loading = true;
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
    if (this.role.refHero.isSuperAdmin) {
      this.getDataForSuperAdmin();
    } else {
      this.getDataForAdmin();
    }
  }

  getDataForSuperAdmin() {
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

  async getDataForAdmin() {
    await this.getMasterList();
    await this.getItemList();
    this.loading = false;
  }

  getMasterList() {
    this.masterList = [];
    return new Promise((resolve) => {
      this.service.getMasterList().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          response.data.forEach(element => {
            this.masterList.push({
              _id: element._id,
              code: element.code,
              name: element.name,
              active: false,
              isFree: element.isFree,
              price: element.price,
              isNew: true
            });
          });
        }
        resolve();
      });
    });
  }

  getItemList() {
    this.items = _.cloneDeep(this.masterList);
    return new Promise((resolve) => {
      this.service.getList(undefined, this.role.refCompany).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.items.map(element => {
            let found: any;
            found = undefined;
            for (const key in response.data) {
              if (response.data[key].refDashboard._id === element._id) {
                found = response.data[key];
                break;
              }
            }
            if (found) {
              element._id = found._id;
              element.active = found.active;
              element.isNew = false;
            }
          });
        }
        resolve();
      });
    });
  }

  create(dialog: TemplateRef<any>) {
    this.itemDialog = this.initialModel();
    this.itemDialog.active = true;
    this.callDialog(dialog);
  }

  initialModel(): any {
    const itemDialog = {
      _id: undefined,
      code: '',
      name: '',
      active: true,
      price: 0,
      isFree: true,
    }
    return itemDialog;
  }

  edit(item: any, dialog: TemplateRef<any>) {
    this.itemDialog = _.cloneDeep(item);
    this.callDialog(dialog);
  }

  toggleStatus(item: any) {
    const request = {
      _id: item._id,
      code: item.code,
      name: item.name,
      active: item.active,
      price: item.price,
      isFree: item.isFree,
    };
    this.service.edit(request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    });
  }

  save() {
    const request = this.setRequest();
    if (request._id) {
      this.service.edit(request).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.closeDialog();
          this.showToast('success', 'Success Message', response.message);
          this.search();
        } else {
          this.closeDialog();
          this.showToast('danger', 'Error Message', response.message);
        }
      });
    } else {
      this.service.create(request).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          const pageIndex = Math.ceil((this.paging.length + 1) / this.paging.pageSize);
          this.paging.pageIndex = pageIndex - 1;
          this.closeDialog();
          this.showToast('success', 'Success Message', response.message);
          this.search();
        } else {
          this.closeDialog();
          this.showToast('danger', 'Error Message', response.message);
        }
      });
    }
  }

  setRequest(): any {
    const request = _.cloneDeep(this.itemDialog);
    if (request.isFree) {
      request.price = 0;
    }
    return request;
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
    this.search();
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
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
