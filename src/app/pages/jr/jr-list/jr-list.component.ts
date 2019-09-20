import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";
import { JrService } from '../jr.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging } from '../../../shared/interfaces/common.interface';
import { getRole,setFlowId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../shared/services';
import { PopupCvComponent } from '../../../component/popup-cv/popup-cv.component';
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
  constructor(
    private router: Router,
    private service: JrService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
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
    this.search();
  }

  search() {
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'refStatus',
        'department',
        'requiredExam',
        'remark',
        'refJD',
        'refSource',
      ]
    };
    this.items = [];
    this.service.getList(this.criteria, this.role.refCompany).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.paging.length = response.totalDataSize;
        console.log(response.data);
        this.items.map(item => {
          //set label color
          console.log(item)
          switch (item.refStatus.name) {
            case "Waiting for HR Confirm":
              item.refStatus.class = "label1-warning";
              break;
            case "Not Start":
              item.refStatus.class = "label1-info";
              break;
            case "In Progress":
              item.refStatus.class = "label1-success";
              break;
            case "Expired":
              item.refStatus.class = "label1-default";
              break;
            case "Reject":
              item.refStatus.class = "label1-danger";
              break;
            case "Active":
              item.refStatus.class = "label1-green";
              break;
            case "Inactive":
              item.refStatus.class = "label1-black";
              break;
          }
        })
        if (!this.items.length && this.paging.pageIndex > 0) {
          this.paging.pageIndex--;
          this.search();
        }
      }
      this.loading = false;
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

  RejectSave() {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: '40%',
      data: { type: 'C' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        console.log(this.itemSelected)
        this.service.action("reject", this.itemSelected).subscribe(response => {
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
      width: '40%',
      data: { type: 'C' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.action("confirm", item).subscribe(response => {
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

  openPopupComment(item: any) {
    setFlowId(item._id);
    this.dialogService.open(PopupCvComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => setFlowId());
  }

}
