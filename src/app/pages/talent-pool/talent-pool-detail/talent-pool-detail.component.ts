import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";
import { TalentPoolService } from '../talent-pool.service';
import { ResponseCode, Paging, InputType } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, Count, Filter } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId, setCandidateId, setButtonId, setUserEmail, setFieldName, setJdName, setFlagExam } from '../../../shared/services/auth.service';
import { setTabName, getTabName, setCollapse, getCollapse } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { PopupCommentComponent } from '../../../component/popup-comment/popup-comment.component';
import { PopupRejectComponent } from '../../../component/popup-reject/popup-reject.component';
import { PopupExamDateComponent } from '../../../component/popup-exam-date/popup-exam-date.component';
import { PopupCvComponent } from '../../../component/popup-cv/popup-cv.component';
import { PopupPreviewEmailComponent } from '../../../component/popup-preview-email/popup-preview-email.component';
import { PopupTransferComponent } from '../../../component/popup-transfer/popup-transfer.component';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService, NbDialogRef } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { MESSAGE } from "../../../shared/constants/message";
import { CandidateService } from '../../candidate/candidate.service';
import { resolve } from 'url';
import { AppFormService } from '../../setting/app-form/app-form.service';

@Component({
  selector: 'ngx-talent-pool-detail',
  templateUrl: './talent-pool-detail.component.html',
  styleUrls: ['./talent-pool-detail.component.scss']
})
export class TalentPoolDetailComponent implements OnInit {
  role: any;
  jrId: any;
  jrName: any;
  refStageId: any;
  tabs: any;
  steps: any;
  items: any;
  comments: any;
  startFlag: boolean;

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
  showTips: boolean;
  email: boolean = true;
  jobsDB: boolean = true;
  other: boolean = true;
  sourceBy: any;
  soList: any;
  examUserId: any;
  dialogRef: NbDialogRef<any>;
  listExamDialog: any;

  isExpress = false;
  questionFilter = [];
  questionFilterSelected: Filter[] = [];

  constructor(
    private router: Router,
    private service: TalentPoolService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    public matDialog: MatDialog,
    public candidateService: CandidateService,
    public appFormService: AppFormService,
  ) {
    this.jrId = getJrId();
    if (!this.jrId) {
      this.router.navigate(["/employer/talent-pool/list"]);
    }
    this.role = getRole();
    this.jrName = getJdName();
    this.collapseAll = getCollapse();
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
        badgeText: 0,
        badgeStatus: 'default',
      });
    });
    this.steps = this.role.refAuthorize.processFlow.exam.steps.filter(step => {
      return step.refStage.refMain._id === this.role.refCompany.menu.talentPool.refStage._id && step.editable;
    });
    this.startFlag = true;
    this.isExpress = this.role.refCompany.isExpress;
  }

  ngOnInit() {
    this.items = [];
    this.comments = [];
    this.soList = [];
    this.sourceBy = [];
    this.keyword = '';
    this.showTips = false;
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.onModel();
  }

  async onModel() {
    if (!this.isExpress) {
      await this.sourceList();
    } else {
      await this.getQuestionFilter();
    }
    // await this.search();
  }

  sourceList() {
    return new Promise((resolve) => {
      this.service.sourceList(this.jrId).subscribe(response => {
        if (ResponseCode.Success && response.code) {
          this.soList = response.data;
          this.soList.map(element => {
            if (element.active === true) {
              this.sourceBy.push(element._id);
            }
          })
        }
        this.search();
        resolve();
      });
    });
  }

  getQuestionFilter() {
    return new Promise((resolve) => {
      this.appFormService.getActive().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data.questions) {
            response.data.questions.forEach(filter => {
              if (filter.isFilter) {
                switch (filter.type) {
                  case InputType.Radio || InputType.ChcekBox || InputType.Dropdown:
                    this.questionFilter.push({
                      name: filter.title,
                      value: filter.answer.options.map(option => { return option.label })
                    });
                    break;
                  case InputType.ParentChild:
                    this.questionFilter.push({
                      name: filter.title,
                      value: filter.parentChild.map(option => { return option.name })
                    });
                    break;
                }
              }
            });
          }
        }
        resolve();
      });
    });
  }

  onSelectTab(event: any) {
    if (this.startFlag) {
      this.startFlag = false;
      if (getTabName()) {
        this.tabSelected = getTabName();
        setTabName();
      } else {
        this.tabSelected = 'PENDING';
      }
    } else {
      this.tabSelected = event.tabTitle;
    }
    this.paging.pageIndex = 0;
    this.search();
  }

  search() {
    return new Promise((resolve) => {
      this.loading = true;
      this.criteria = {
        keyword: this.keyword.trim(),
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
        filters: this.sourceBy,
        questionFilters: this.questionFilterSelected
      };
      this.items = [];
      this.service.getDetail(this.refStageId, this.jrId, this.tabSelected, this.criteria).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.items = response.data;
          this.showTips = response.isOverCandidate;
          this.items.map(item => {
            item.collapse = this.collapseAll;
            item.condition = this.setCondition(item);
            if (item.refCandidate && item.refCandidate.birth) {
              if (this.utilitiesService.dateIsValid(item.refCandidate.birth)) {
                item.refCandidate.birth = new Date((item.refCandidate.birth));
                var timeDiff = Math.abs(Date.now() - item.refCandidate.birth.getTime());
                item.refCandidate.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
              }
            }
          });
          this.paging.length = (response.count && response.count.data) || response.totalDataSize;
          this.setTabCount(response.count);

          if (this.isExpress) {
            this.forExpressCompany();
          }
        }
        this.loading = false;
        resolve();
      });
    })
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

  setCondition(item: any): any {
    let condition = {
      icon: {
        examDate: false
      },
      status: {
        class: ''
      },
      button: {
        step: {},
        nextStep: false,
        examDate: false,
        buyCV: false,
        reject: false,
        revoke: false,
        comment: false,
      },
      isExpired: false
    };

    if (this.tabSelected === 'NOT BUY') {
      condition.button.comment = true;
      condition.button.reject = true;
      condition.status.class = 'label-gray';
      switch (item.refCVStatus.status) {
        case 'CVS001': // Not Buy
          condition.button.buyCV = true;
          condition.status.class = 'label-gray';
          break;
        case 'CVS002': // Waiting Buy..
          condition.status.class = 'label-warning';
          condition.button.reject = false;
          break;
        case 'CVS003': // Can't Buy
          condition.status.class = 'label-danger';
          break;
        case 'CVS004': // Buy Success
          condition.status.class = 'label-success';
          condition.button.reject = false;
          break;
        case 'CVS005': // Send job Ad
          condition.status.class = 'label-info';
          break;
      }
      if (item.refJR.refStatus.status !== 'JRS002') {
        condition.isExpired = true;
      }
    } else {
      let thisStage: any;
      let nextStage: any;
      if (item.refJR.requiredExam) {
        thisStage = this.role.refAuthorize.processFlow.exam.steps.find(step => {
          return step.refStage._id === item.refStage._id;
        });
        nextStage = this.role.refAuthorize.processFlow.exam.steps.find(step => {
          return step.refStage._id === thisStage.refNextStage;
        });
      } else {
        thisStage = this.role.refAuthorize.processFlow.noExam.steps.find(step => {
          return step.refStage._id === item.refStage._id;
        });
        nextStage = this.role.refAuthorize.processFlow.noExam.steps.find(step => {
          return step.refStage._id === thisStage.refNextStage;
        });
      }
      if (thisStage) {
        condition.button.step = thisStage;
        condition.button.comment = true;
        switch (this.tabSelected) {
          case 'NOT BUY':
            break;
          case 'PENDING':
            if (thisStage.editable) {
              condition.button.nextStep = true;
              condition.button.reject = true;
              if (thisStage.refStage.refMain._id !== nextStage.refStage.refMain._id) {
                if (item.refJR.requiredExam) {
                  condition.icon.examDate = true;
                  if (!this.utilitiesService.dateIsValid(item.examInfo.date)) {
                    condition.button.nextStep = false;
                    condition.button.examDate = true;
                  }
                }
              }
            }
            break;
          case 'SELECTED':
            break;
          case 'REJECTED':
            if (thisStage.editable) {
              condition.button.revoke = true;
            }
            break;
        }
        if (item.refJR.refStatus.status !== 'JRS002') {
          condition.isExpired = true;
          condition.icon.examDate = false;
        }
      }
    }
    return condition;
  }

  setTabCount(count: Count) {
    if (count) {
      this.count = count;
      this.tabs.map(element => {
        switch (element.name) {
          case 'NOT BUY':
            element.badgeText = count.notBuy;
            element.badgeStatus = 'default';
            break;
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

  toScroll(namee): void {
    setTimeout(() => {
      var el = document.getElementById(namee);
      el.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }, 500);
  }

  onClickCollapseAll(value: any) {
    setCollapse(value);
    if (this.items.length) {
      this.items.map(element => {
        element.collapse = value;
      });
    }
  }

  approve(item: any, button: any, dialog: any) {
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

  appointmentExam(item: any) {
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

  info(item: any, pageNum: any) {
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
        this.getScroll(pageNum);
      }
    });
  }

  async getScroll(pageNum: any) {
    await this.search();
    this.toScroll(pageNum)
  }

  openCandidateDetail(item: any) {
    setTabName(this.tabSelected);
    setCollapse(this.collapseAll);
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.router.navigate(["/employer/candidate/detail"]);
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

  checkExam(dialog: TemplateRef<any>, item, _id) {
    this.examUserId = _id;
    this.listExamDialog = item;
    this.callDialog(dialog)
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  }

  showExamCand(examId, flag) {
    this.dialogRef.close();
    setFlagExam(flag)
    const path = '/exam-form/view/' + examId + '/' + this.examUserId;
    this.router.navigate([path]);
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

  buyCV(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: MESSAGE[39] }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.buyCV(item._id).subscribe(response => {
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

  forExpressCompany() {
    if (this.items && this.items.length) {
      this.items.map(item => {
        let scores = [];
        item.submitScore = 0;
        item.maxScore = 0;
        if (item.questions && item.questions.length) {
          item.questions.forEach(question => {
            if (question.score && question.score.isScore) {
              scores.push({
                title: question.title,
                submitScore: question.score.submitScore,
                maxScore: question.score.maxScore
              });
              item.submitScore += question.score.submitScore;
              item.maxScore += question.score.maxScore;
            }
          });
        }
        item.scores = scores;
      });
    }
  }

  openApplicationForm(item: any) {
    if (item.generalAppForm.refGeneralAppForm) {
      this.router.navigate([]).then(result => {
        window.open(`/application-form/detail/${item.generalAppForm.refGeneralAppForm}`, '_blank');
      });
    }
  }

  changeQuestionFilter(name, filter) {
    const found = this.questionFilterSelected.find(element => {
      return element.name === name;
    });
    if (found) {
      this.questionFilterSelected.forEach(element => {
        if (element.name === name) {
          element.value = filter.value;
        }
      });
    } else {
      this.questionFilterSelected.push({
        name: name,
        value: filter.value
      });
    }
    this.search();
  }

  getProgressBarColor(index: number): string {
    const colors = ['primary', 'info', 'success', 'warning', 'danger'];
    let color = colors[0];
    index = index % colors.length;
    color = colors[index];
    return color;
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
