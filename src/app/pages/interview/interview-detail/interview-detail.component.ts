import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";
import { InterviewService } from '../interview.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, Count } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId, setCandidateId, setButtonId,setUserCandidate } from '../../../shared/services/auth.service';
import { setTabName, getTabName, setCollapse, getCollapse } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { PopupCommentComponent } from '../../../component/popup-comment/popup-comment.component';
import { PopupRejectComponent } from '../../../component/popup-reject/popup-reject.component';
import { PopupInterviewResultComponent } from '../../../component/popup-interview-result/popup-interview-result.component';
import { PopupInterviewDateComponent } from '../../../component/popup-interview-date/popup-interview-date.component';
import { PopupEvaluationComponent } from '../../../component/popup-evaluation/popup-evaluation.component';
import { PopupSignContractComponent } from '../../../component/popup-sign-contract/popup-sign-contract.component';
import { PopupCvComponent } from '../../../component/popup-cv/popup-cv.component';
import { PopupPreviewEmailComponent } from '../../../component/popup-preview-email/popup-preview-email.component';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService, NbDialogRef } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { MESSAGE } from "../../../shared/constants/message";
import { CandidateService } from '../../candidate/candidate.service';
import { elementAt } from 'rxjs/operators';
import { debug } from 'util';
import { CalendarService } from '../../calendar/calendar.service';

@Component({
  selector: 'ngx-interview-detail',
  templateUrl: './interview-detail.component.html',
  styleUrls: ['./interview-detail.component.scss']
})
export class InterviewDetailComponent implements OnInit {
  role: any;
  jrId: any;
  jrName: any;
  refStageId: any;
  tabs: any;
  steps: any;
  items: any;
  itemSelected: any;
  collapseAll: boolean;
  tabSelected: string;
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  minPageSize = Paging.pageSizeOptions[0] || 10;
  devices: Devices;
  loading: boolean;
  count: Count;
  rankName: any;
  score: any;
  dialogRef: NbDialogRef<any>;
  itemDialog: any;
  innerWidth: any;
  innerHeight: any;
  showTips: boolean;

  constructor(
    private router: Router,
    private service: InterviewService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    public matDialog: MatDialog,
    public candidateService: CandidateService,
    public calendarService: CalendarService,
  ) {
    this.jrId = getJrId();
    if (!this.jrId) {
      this.router.navigate(["/interview/list"]);
    }
    this.role = getRole();
    this.jrName = getJdName();
    this.collapseAll = getCollapse();
    this.devices = this.utilitiesService.getDevice();
    this.innerWidth = window.innerWidth *0.5;
    this.innerHeight = window.innerHeight * 0.8;
    this.refStageId = this.role.refCompany.menu.pendingInterview.refStage._id;
    const tabs = this.role.refCompany.menu.pendingInterview.refStage.tabs.filter(tab => {
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
        badgeText: 0,
        badgeStatus: 'default',
      })
    });
    this.steps = this.role.refAuthorize.processFlow.exam.steps.filter(step => {
      return step.refStage.refMain._id === this.role.refCompany.menu.pendingInterview.refStage._id && step.editable;
    });
    this.showTips = false;
    this.calendarService.getListByJR(this.jrId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data.userInterviews.length) {
          const calendar = response.data.userInterviews.find(element => {
            return element.refUser._id === this.role._id;
          });
          if (calendar) {
            const found = calendar.calendar.availableDates.find(element => {
              return new Date(element.endDate) > new Date();
            });
            if (found) {
              this.showTips = false;
            } else {
              this.showTips = true;
            }
          }
        }
      }
    });
  }

  ngOnInit() {
    this.items = [];
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
  }

  onSelectTab(event: any) {
    if (!this.tabSelected && getTabName()) {
      this.tabSelected = getTabName();
      setTabName();
    } else {
      this.tabSelected = event.tabTitle;
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
        'refCandidate.firstname',
        'refCandidate.lastname',
      ]
    };
    this.items = [];
    this.score = [];
    this.service.getDetail(this.refStageId, this.jrId, this.tabSelected, this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.items.map((item, index) => {
          item.collapse = this.collapseAll;
          item.button = this.setButton(item);
          // this.score[index] =this.showScore(item);

          let sum = 0;
          let totalPass = 0;
          let totalCompare = 0;
          let totalReject = 0;
          item.pendingInterviewScoreInfo.evaluation.map((element) => {
            if (this.role._id === element.createdInfo.refUser._id) {
              item.score = element.point;
              item.comment = element.additionalComment
            }
            sum = sum + element.point;
            if (element.rank.selected === 1) {
              totalPass += 1;
            }
            else if (element.rank.selected === 2) {
              totalCompare += 1;
            } else {
              totalReject += 1;
            }
          });
          item.avg = sum / item.pendingInterviewScoreInfo.evaluation.length;
          let fullResult = '';
          fullResult = 'ผ่าน' + ' : ' + totalPass + ' , ' + 'รอพิจารณา' + ' : '
            + totalCompare + ' , ' + 'ไม่ผ่าน' + ' : ' + totalReject;
          fullResult = fullResult.trim();
          item.result = fullResult;
        });
        this.paging.length = (response.count && response.count.data) || response.totalDataSize;
        this.setTabCount(response.count);
      }
      this.loading = false;
    });
  }

  setButton(item: any): any {
    let button = {
      nextStep: false,
      interviewTaken: false,
      interviewScore: false,
    };
    switch (item.refStage.order) {
      case 401:
        if (item.pendingInterviewInfo) {
          if (this.utilitiesService.dateIsValid(item.pendingInterviewInfo.startDate) && item.pendingInterviewInfo.refLocation) {
            button.nextStep = true;
          } else {
            button.interviewTaken = true;
          }
        }
        break;
      case 402:
        if (item.pendingInterviewScoreInfo) {
          if (item.pendingInterviewScoreInfo.evaluation.length) {
            button.nextStep = true;
          } else {
            button.interviewScore = true;
          }
        }
        break;
    }
    return button;
  }

  setTabCount(count: Count) {
    if (count) {
      this.count = count;
      this.tabs.map(element => {
        switch (element.name) {
          case 'PENDING':
            element.badgeText = count.pending;
            element.badgeStatus = 'danger';
            break;
          case 'SELECTED':
            element.badgeText = count.selected;
            element.badgeStatus = 'danger';
            break;
          case 'REJECTED':
            element.badgeText = count.rejected;
            element.badgeStatus = 'danger';
            break;
          default:
            element.badgeText = '0';
            element.badgeStatus = 'default';
        }
      });
    }
  }

  onClickCollapseAll(value: any) {
    setCollapse(value);
    if (this.items.length) {
      this.items.map(element => {
        element.collapse = value;
      });
    }
  }

  approve(item: any, button: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    setButtonId(button._id);
    this.dialogService.open(PopupPreviewEmailComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      setButtonId();
      if (result) {
        this.search();
      }
    });
  }

  reject(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupRejectComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.search();
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
        this.candidateService.candidateFlowRevoke(item._id, this.refStageId).subscribe(response => {
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

  info(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupCvComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.search();
      }
    });
  }

  infoResult(item: any){
    setUserCandidate(item);
    this.dialogService.open(PopupInterviewResultComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
      ).onClose.subscribe(result => {
        setUserCandidate();
      })
  }
  
  openCandidateDetail(item: any) {
    setTabName(this.tabSelected);
    setCollapse(this.collapseAll);
    setCandidateId(item.refCandidate._id);
    this.router.navigate(["/candidate/detail"]);
  }

  openPopupComment(item: any) {
    setFlowId(item._id);
    this.dialogService.open(PopupCommentComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      if (result) {
        setFlowId();
        this.search();
      }
    });
  }

  openPopupInterviewDate(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupInterviewDateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.search();
      }
    });
  }

  openPopupEvaluation(item: any) {
    // setFlowId(item._id);
    setCandidateId(item._id);
    this.dialogService.open(PopupEvaluationComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.search();
      }
    });
  }

  openPopupSignContract(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupSignContractComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.search();
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