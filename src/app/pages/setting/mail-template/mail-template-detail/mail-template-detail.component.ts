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
@Component({
  selector: 'ngx-mail-template-detail',
  templateUrl: './mail-template-detail.component.html',
  styleUrls: ['./mail-template-detail.component.scss']
})
export class MailTemplateDetailComponent implements OnInit {
  items: any;
  itemDialog: any;
  constructor(
    private service: MailTemplateService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService
  ) {

  }

  ngOnInit() {
     this.itemDialog = {
      _id: undefined,
      name: undefined,
      subject: undefined,
      remark: undefined,
      cc: undefined,
      bcc: undefined
    }
  }


}
