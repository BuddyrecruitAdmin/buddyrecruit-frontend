import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";
import { ExamService } from '../exam.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, Count } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId, setCandidateId, setButtonId, setUserEmail, setFieldName, setJdName } from '../../../shared/services/auth.service';
import { setTabName, getTabName, setCollapse, getCollapse } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { PopupCommentComponent } from '../../../component/popup-comment/popup-comment.component';
import { PopupRejectComponent } from '../../../component/popup-reject/popup-reject.component';
import { PopupExamDateComponent } from '../../../component/popup-exam-date/popup-exam-date.component';
import { PopupExamInfoComponent } from '../../../component/popup-exam-info/popup-exam-info.component';
import { PopupExamScoreComponent } from '../../../component/popup-exam-score/popup-exam-score.component';
import { PopupCvComponent } from '../../../component/popup-cv/popup-cv.component';
import { PopupPreviewEmailComponent } from '../../../component/popup-preview-email/popup-preview-email.component';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService, NbDialogRef } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { MESSAGE } from "../../../shared/constants/message";
import { CandidateService } from '../../candidate/candidate.service';
import { PopupResendEmailComponent } from '../../../component/popup-resend-email/popup-resend-email.component';
import { PopupTransferComponent } from '../../../component/popup-transfer/popup-transfer.component';
import { DropDownValue } from '../../../shared/interfaces/common.interface';
@Component({
  selector: 'ngx-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss']
})
export class ExamDetailComponent implements OnInit {
  role: any;
  jrId: any;
  jrName: any;
  refStageId: any;
  tabs: any;
  steps: any;
  items: any;
  itemSelected: any;
  comments: any;
  dialogRef: NbDialogRef<any>;
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
  sourceBy: any;
  soList: any;
  ExamLists: DropDownValue[];
  filteredListExam: any;
  exanTest: any;
  examUserId: any;
  listExamDialog: any;
  constructor(
    private router: Router,
    private service: ExamService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    public matDialog: MatDialog,
    public candidateService: CandidateService,
  ) {
    this.jrId = getJrId();
    if (!this.jrId) {
      this.router.navigate(["/employer/exam/list"]);
    }
    this.role = getRole();
    this.jrName = getJdName();
    this.collapseAll = getCollapse();
    this.devices = this.utilitiesService.getDevice();
    this.refStageId = this.role.refCompany.menu.pendingExam.refStage._id;
    const tabs = this.role.refCompany.menu.pendingExam.refStage.tabs.filter(tab => {
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
      return step.refStage.refMain._id === this.refStageId;
    });
  }

  ngOnInit() {
    this.items = [];
    this.comments = [];
    this.soList = [];
    this.sourceBy = [];
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.onModel();
  }

  async onModel() {
    await this.sourceList();
    await this.search();
    await this.examShowList();
  }

  examShowList() {
    this.service.getListExamOnline(this.jrId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data.exams) {
          console.log(response.data.exams)
          response.data.exams.map(element => {
            this.ExamLists.push({
              label: element.refExam.name,
              value: element.refExam._id
            });
          });
          this.filteredListExam = this.ExamLists.slice();
          console.log(this.filteredListExam)
          console.log(this.ExamLists)
        }
      }
    });
  }

  sourceList() {
    return new Promise((resolve) => {
      this.service.sourceList().subscribe(response => {
        if (ResponseCode.Success && response.code) {
          this.soList = response.data;
          this.soList.map(element => {
            if (element.active === true) {
              this.sourceBy.push(element._id);
            }
          })
        }
        resolve();
      })
    })
  }

  onSelectTab(event: any) {
    if (!this.tabSelected && getTabName()) {
      this.tabSelected = getTabName();
      setTabName();
    } else {
      this.tabSelected = event.tabTitle;
    }
    this.paging.pageIndex = 0;
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
        'refCandidate.age',
        'refCandidate.phone',
        'refCandidate.email',
        'refStage.name',
        'refSource.name'
      ],
      filters: this.sourceBy
    };
    this.items = [];
    this.ExamLists = [];
    this.exanTest = [];

    this.service.getDetail(this.refStageId, this.jrId, this.tabSelected, this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.items.map(item => {
          item.collapse = this.collapseAll;
          item.condition = this.setCondition(item);
          if (this.utilitiesService.dateIsValid(item.refCandidate.birth)) {
            item.refCandidate.birth = new Date((item.refCandidate.birth));
            var timeDiff = Math.abs(Date.now() - item.refCandidate.birth.getTime());
            item.refCandidate.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          }
        });
        this.paging.length = (response.count && response.count.data) || response.totalDataSize;
        this.setTabCount(response.count);
      }
      this.loading = false;
    });
  }

  setCondition(item: any): any {
    let condition = {
      icon: {
        examDate: false,
        examInfo: false,
        examScore: false,
      },
      button: {
        step: {},
        nextStep: false,
        examTaken: false,
        examScore: false,
        reject: false,
        revoke: false,
        comment: false,
        send: false,
        trans: true
      },
      isExpired: false
    };
    const step = this.role.refAuthorize.processFlow.exam.steps.find(step => {
      return step.refStage._id === item.refStage._id;
    });
    if (step) {
      condition.button.step = step;
      condition.button.comment = true;
      if (step.editable) {
        switch (item.refStage.order) {
          case 201: // Exam Taken
            if (this.tabSelected === 'PENDING') {
              condition.icon.examDate = true;
              condition.icon.examInfo = true;
              condition.button.reject = true;
              if (item.pendingExamInfo) {
                if (this.utilitiesService.dateIsValid(item.pendingExamInfo.availableDate) || item.pendingExamInfo.afterSignContract) {
                  condition.button.nextStep = true;
                } else {
                  condition.button.examTaken = true;
                }
              }
            } else {
              condition.button.revoke = true;
            }
            break;
          case 202: // Exam Score
            if (this.tabSelected === 'PENDING') {
              condition.icon.examInfo = true;
              condition.icon.examScore = true;
              condition.button.reject = true;
              if (item.pendingExamScoreInfo) {
                if (item.pendingExamScoreInfo.examScore || item.pendingExamScoreInfo.attitudeScore) {
                  condition.button.nextStep = true;
                } else {
                  condition.button.examScore = true;
                }
              }
            } else {
              condition.button.send = true;
              condition.button.trans = false;
            }
            break;
        }
      }
    }
    if (item.refJR.refStatus.status !== 'JRS002') {
      condition.isExpired = true;
      condition.icon.examDate = false;
      condition.icon.examInfo = false;
      condition.icon.examScore = false;
    }
    return condition;
  }

  filterSource(event, _id) {
    this.sourceBy = [];
    this.soList.map(element => {
      if (element._id === _id) {
        element.active = event;
        if (element.active === true) {
          this.sourceBy.push(element._id);
        }
      } else if (element.active === true) {
        this.sourceBy.push(element._id);
      }
    })
    this.search();
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
            element.badgeStatus = 'default';
            break;
          case 'REJECTED':
            element.badgeText = count.rejected;
            element.badgeStatus = 'default';
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
    if (item.refCandidate.email) {
      setUserEmail(item.refCandidate.email);
    }
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

  openPopupTransfer(item: any) {
    setFlowId(item._id);
    setFieldName(this.utilitiesService.setFullname(item.refCandidate));
    setJdName(this.jrName);
    this.dialogService.open(PopupTransferComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      this.search();
      if (result) {
        setFlowId();
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

  sendEmail(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupResendEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
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
      if (result) {
        this.search();
      }
    });
  }

  openCandidateDetail(item: any) {
    setTabName(this.tabSelected);
    setCollapse(this.collapseAll);
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.router.navigate(["/employer/candidate/detail"]);
  }

  openPopupSendExam(dialog: TemplateRef<any>, _id) {
    this.examUserId = _id;
    this.callDialog(dialog);
  }

  sendExam() {
    this.service.semdExam(this.exanTest, this.examUserId).subscribe((response) => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
        this.search();
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    })
    this.dialogRef.close();
  }

  checkExam(dialog: TemplateRef<any>, item, _id) {
    this.examUserId = _id;
    this.listExamDialog = item;
    this.callDialog(dialog)
  }

  showExamCand(examId) {
    const path = '/exam-form/view/' + examId + '/' + this.examUserId;
    this.router.navigate([path]);
    // this.service.answerExam(this.examUserId, examId).subscribe((response) => {
    //   if (response.code === ResponseCode.Success) {

    //   } else {
    //     this.showToast('danger', 'Error Message', response.message);
    //   }
    // })
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  }


  openPopupComment(item: any) {
    setFlowId(item._id);
    this.dialogService.open(PopupCommentComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      this.search();
      if (result) {
        setFlowId();
      }
    });
  }

  openPopupExamDate(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    setUserEmail(item.refCandidate.email);
    this.dialogService.open(PopupExamDateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      if (result) {
        this.search();
      }
    });
  }

  openPopupExamInfo(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    setUserEmail(item.refCandidate.email);
    this.dialogService.open(PopupExamInfoComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      if (result) {
        this.search();
      }
    });
  }

  openPopupExamScore(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    setUserEmail(item.refCandidate.email);
    this.dialogService.open(PopupExamScoreComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
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
