import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { CandidateService } from '../candidate.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, DropDownValue } from '../../../shared/interfaces/common.interface';
import { getRole, getCandidateId, setCandidateId, setFlowId, setJdId, setJdName, setJrId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { PopupCommentComponent } from '../../../component/popup-comment/popup-comment.component';
import { PopupRejectComponent } from '../../../component/popup-reject/popup-reject.component';
import { MESSAGE } from "../../../shared/constants/message";
import { MENU_PROCESS_FLOW } from "../../pages-menu";

export interface CandidateDetail {

}

@Component({
  selector: 'ngx-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {
  role: any;
  steps: any;
  candidateId: any;
  item: any = {};
  loading: boolean;
  interviewScore = {
    score: '',
    avgScore: '',
    result: '',
    remark: '',
  };

  constructor(
    private router: Router,
    private location: Location,
    private service: CandidateService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.candidateId = getCandidateId() || '';
    // setCandidateId();
    this.steps = this.role.refAuthorize.processFlow.exam.steps;
  }

  ngOnInit() {
    this.getDetail();
  }

  back() {
    this.location.back();
  }

  getDetail() {
    this.loading = true;
    this.service.getDetail(this.candidateId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.item = response.data;
      }
      this.loading = false;
    });
  }

  gotoStage() {
    const menu = MENU_PROCESS_FLOW.find(element => {
      return element.title === this.item.candidateFlow.refStage.refMain.name;
    });
    menu.link = menu.link.replace('detail', 'list');
    if (menu) {
      this.router.navigate([menu.link]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  gotoJR() {
    let menu = MENU_PROCESS_FLOW.find(element => {
      return element.title === this.item.candidateFlow.refStage.refMain.name;
    });
    menu.link = menu.link.replace('list', 'detail');
    if (menu) {
      setJdId(this.item.candidateFlow.refJR.refJD._id);
      setJdName(this.item.candidateFlow.refJR.refJD.position);
      setJrId(this.item.candidateFlow.refJR._id);
      this.router.navigate([menu.link]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  approve(item: any, button: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: 'Do you want to ' + button.button + '?' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.candidateFlowApprove(item.candidateFlow._id, item.candidateFlow.refStage._id, button._id).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.getDetail();
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    });
  }

  reject(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(this.candidateId);
    this.dialogService.open(PopupRejectComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      if (result) {
        this.getDetail();
      }
    });
  }

  revoke(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: MESSAGE[44] }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.candidateFlowRevoke(item.candidateFlow._id, item.candidateFlow.refStage._id).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.getDetail();
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    });
  }

  openPopupComment(item: any) {
    setFlowId(item.candidateFlow._id);
    this.dialogService.open(PopupCommentComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      if (result) {
        setFlowId();
        this.getDetail();
      }
    });
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
