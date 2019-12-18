import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { JrService } from '../jr.service';
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
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { AuthorizeService } from '../../../pages/setting/authorize/authorize.service';

@Component({
  selector: 'ngx-jr-list',
  templateUrl: './jr-list.component.html',
  styleUrls: ['./jr-list.component.scss']
})
export class JrListComponent implements OnInit {
  role: any;
  items: any;
  item: any;
  itemSelected: any;
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  txtReject: string;
  dialogRef: NbDialogRef<any>;
  loading: boolean;
  isOverQuota: boolean;
  showTips: boolean;
  minPageSize = Paging.pageSizeOptions[0];
  devices: Devices;
  isGridLayout: boolean;

  constructor(
    private router: Router,
    private service: JrService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private authorizeService: AuthorizeService,
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
  }

  ngOnInit() {
    this.loading = true;
    this.isOverQuota = false;
    this.showTips = false;
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
        'refStatus.name',
        'department.name',
        'requiredExam',
        'remark',
        'refJD.position',
        'refSource',
        'capacity',
        'lastChangedInfo.refUser.firstname',
        'lastChangedInfo.refUser.lastname',
        'lastChangedInfo.date'
      ]
    };
    this.items = [];
    this.service.getList(this.criteria, this.role.refCompany).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.paging.length = response.totalDataSize;
        this.isOverQuota = response.isOverQuota;
        this.showTips = response.isOverQuota;
        this.items = response.data;
        this.items.map(item => {
          item.canEdit = true;
          item.canDelete = true;
          switch (item.refStatus.status) {
            case 'JRS001': // Waiting for HR Confirm
              item.refStatus.class = 'label-warning';
              break;
            case 'JRS002': // Active
              item.refStatus.class = 'label-success';
              item.canDelete = false;
              break;
            case 'JRS003': // Expired
              item.refStatus.class = 'label-primary';
              item.canDelete = false;
              break;
            case 'JRS004': // Rejected
              item.refStatus.class = 'label-danger';
              item.canEdit = false;
              break;
            case 'JRS005': // Closed
              item.refStatus.class = 'label-gray';
              item.canEdit = false;
              break;
            default:
              item.refStatus.class = 'label-gray';
              break;
          }
        });
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

  RejectSave() {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.action('reject', this.itemSelected).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.search();
            this.dialogRef.close();
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });

      }
    })

  }

  Approve(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.action('confirm', item).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.search();
            this.dialogRef.close();
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    })

  }

  Reject(item: any, dialog: TemplateRef<any>) {
    this.itemSelected = _.cloneDeep(item);
    this.callDialog(dialog);
  }

  switchActive(item: any) {
    this.service.toggleStatus(item._id).subscribe(res => {
      if (res.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', res.message);
        this.search();
      } else {
        this.showToast('danger', 'Error Message', res.message);
      }
    })
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
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
