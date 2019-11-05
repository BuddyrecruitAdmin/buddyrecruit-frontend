import { Component, OnInit, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { MailTemplateService } from '../mail-template.service';
import { ResponseCode, Paging } from '../../../../shared/app.constants';
import { Criteria, Paging as IPaging } from '../../../../shared/interfaces/common.interface';
import { getRole } from '../../../../shared/services/auth.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { color } from 'd3-color';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'ngx-mail-template-list',
  templateUrl: './mail-template-list.component.html',
  styleUrls: ['./mail-template-list.component.scss']
})
export class MailTemplateListComponent implements OnInit {
  role: any;
  internal: any;
  external: any;
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  dialogRef: NbDialogRef<any>;
  itemDialog: any;
  tabSelected: string;
  minPageSize = Paging.pageSizeOptions[0];
  loading: boolean;
  mailOptions: any;
  innerWidth: any;
  innerHeight: any;
  editorConfig: AngularEditorConfig = {
    editable: false,
    showToolbar: false,
  }
  constructor(
    private service: MailTemplateService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.innerWidth = `${this.utilitiesService.getWidthOfPopupCard()}px`;
    this.innerHeight = window.innerHeight * 0.8;
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
  }

  search() {
    this.loading = true;
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'name',
        'bcc',
        'cc',
        'remark',
        'lastChangedInfo.refUser.firstname',
        'lastChangedInfo.refUser.lastname',
        'lastChangedInfo.date',
        'html',
        'type',
        'action',
      ]
    };
    this.internal = [];
    this.external = [];
    this.service.getListAll(this.tabSelected, this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.paging.length = (response.count && response.count.data) || response.totalDataSize;
        response.data.forEach(element => {
          if (element.type === "true") {
            this.internal.push(element)
          } else {
            this.external.push(element)
          }
        });
      }
      this.loading = false;
    });
  }

  onSelectTab(event: any) {
    if (event.tabTitle === "Internal") {
      this.tabSelected = "I";
    } else {
      this.tabSelected = "E";
    }
    this.paging.pageIndex = 0;
    this.search();
  }

  preEmail(item: any, dialog: TemplateRef<any>) {
    this.mailOptions = _.cloneDeep(item);
    this.callDialog(dialog);
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
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
