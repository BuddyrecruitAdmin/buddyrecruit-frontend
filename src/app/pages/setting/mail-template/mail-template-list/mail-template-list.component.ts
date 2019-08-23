import { Component, OnInit, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
// import { JobPositionService } from './job-position.service';
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
  selector: 'ngx-mail-template-list',
  templateUrl: './mail-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./mail-template-list.component.scss']
})
export class MailTemplateListComponent implements OnInit {
  role: any;
  constructor() {
    this.role = getRole();
  }
  ngOnInit() {
  }

}
