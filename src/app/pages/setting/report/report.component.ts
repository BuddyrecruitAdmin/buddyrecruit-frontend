import { Component, OnInit, TemplateRef } from '@angular/core';
import { ReportService } from './report.service';
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
@Component({
  selector: 'ngx-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  role: any;
  items: any;
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
  constructor(
    private service: ReportService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService
  ) {
     this.role = getRole();
  }

  ngOnInit() {
    this.refresh();
  }

  initialModel(): any {
    const itemDialog = {
      _id: undefined,
      name: undefined,
      active: undefined,
      price: undefined,
      isFree: false,

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
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'name',
        'lastChangedInfo.refUser.firstname',
        'lastChangedInfo.refUser.lastname',
        'lastChangedInfo.date',
        'price',
        'isFree',
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
    });
  }
  checkFree() {
    if (this.itemDialog.isFree) {
      // this.itemDialog.Isfree = false // true
      console.log(this.itemDialog.isFree)
    } else {
      this.itemDialog.price = 0;//clcik = false
      console.log(this.itemDialog.isFree)
    }
  }
  create(dialog: TemplateRef<any>) {
    this.itemDialog = this.initialModel();
    this.itemDialog.active = true;
    // if(this.itemDialog.IsFree = undefined){
    //   this.itemDialog.IsFree = false
    // }
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
          console.log(this.itemDialog)
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
      width: '40%',
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
