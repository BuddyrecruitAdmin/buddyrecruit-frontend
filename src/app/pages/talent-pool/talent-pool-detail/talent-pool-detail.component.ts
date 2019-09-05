import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";
import { TalentPoolService } from '../talent-pool.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { PopupCommentComponent } from '../../../component/popup-comment/popup-comment.component';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbWindowService } from '@nebular/theme';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MESSAGE } from "../../../shared/constants/message";

@Component({
  selector: 'ngx-talent-pool-detail',
  templateUrl: './talent-pool-detail.component.html',
  styleUrls: ['./talent-pool-detail.component.scss']
})
export class TalentPoolDetailComponent implements OnInit {
  @ViewChild('contentTemplate', { static: false }) contentTemplate: TemplateRef<any>;
  role: any;
  jrId: any;
  jrName: any;
  refStageId: any;
  tabs: any;
  steps: any;
  items: any;
  comments: any;

  collapseAll: boolean;
  tabSelected: string;

  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  minPageSize = Paging.pageSizeOptions[0] || 10;
  devices: Devices;
  loading: boolean;

  constructor(
    private router: Router,
    private service: TalentPoolService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    public matDialog: MatDialog,
  ) {
    this.jrId = getJrId();
    if (!this.jrId) {
      this.router.navigate(["/talent-pool/list"]);
    }
    this.role = getRole();
    this.jrName = getJdName();
    this.devices = this.utilitiesService.getDevice();
    this.refStageId = this.role.refCompany.menu.talentPool.refStage._id;
    const tabs = this.role.refCompany.menu.talentPool.refStage.tabs.filter(tab => {
      if (tab.relatedJobsDB) {
        return tab.visible && this.role.refCompany.activeJobsDB;
      } else {
        return tab.visible;
      }
    });
    this.tabs = [];
    tabs.forEach(element => {
      let icon: string;
      switch (element.name) {
        case 'NOT BUY':
          icon = 'lock-outline';
          break;
        case 'PENDING':
          icon = 'clock-outline';
          break;
        case 'SELECTED':
          icon = 'done-all-outline';
          break;
        case 'REJECTED':
          icon = 'slash-outline';
          break;
        default:
          icon = 'clock-outline';
          break;
      }
      this.tabs.push({
        name: element.name,
        icon: icon,
      })
    });
    this.steps = this.role.refAuthorize.processFlow.exam.steps.filter(step => {
      return step.refStage.refMain._id === this.role.refCompany.menu.talentPool.refStage._id && step.editable;
    });
  }

  ngOnInit() {
    this.items = [];
    this.comments = [];
    this.collapseAll = false;
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
  }

  onSelectTab(event: any) {
    this.tabSelected = event.tabTitle;
    this.search();
  }

  search() {
    this.loading = true;
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'refCandidate.firstname',
        'refCandidate.lastname',
      ]
    };
    this.items = [];
    this.service.getDetail(this.refStageId, this.jrId, this.tabSelected, this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.items.map(item => {
          item.collapse = this.collapseAll;
        });
        this.paging.length = response.totalDataSize;
      }
      this.loading = false;
    });
  }

  onClickCollapseAll(value: any) {
    if (this.items.length) {
      this.items.map(element => {
        element.collapse = value;
      });
    }
  }

  approve(item: any, button: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: '40%',
      data: { type: 'C', content: 'Do you want to ' + button.button + '?' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.candidateFlowApprove(item._id, this.refStageId, button._id).subscribe(response => {
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

  reject(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: '40%',
      data: { type: 'C', content: MESSAGE[43] }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.candidateFlowReject(item._id, this.refStageId).subscribe(response => {
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

  revoke(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: '40%',
      data: { type: 'C', content: MESSAGE[44] }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.candidateFlowRevoke(item._id, this.refStageId).subscribe(response => {
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

  openCandidateDetail(item: any) {
    this.windowService.open(
      this.contentTemplate,
      {
        title: item.refCandidate.name || item.refCandidate._id || '-No Name-',
        context: {
          text: 'some text to pass into template',
        },
        closeOnBackdropClick: false
      },
    );
  }

  openPopupComment(item: any) {
    setFlowId(item._id);
    this.dialogService.open(PopupCommentComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => setFlowId());
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
