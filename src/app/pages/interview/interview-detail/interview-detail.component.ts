import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";
import { InterviewService } from '../interview.service';
import { ResponseCode, Paging, InputType } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, Count, Filter } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId, setCandidateId, setButtonId, setFlagExam, setUserCandidate, setUserEmail, setFieldName, setJdName, setUserToken, getKeyword, setKeyword } from '../../../shared/services/auth.service';
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
import { CalendarService } from '../../calendar/calendar.service';
import { PopupResendEmailComponent } from '../../../component/popup-resend-email/popup-resend-email.component';
import { PopupTransferComponent } from '../../../component/popup-transfer/popup-transfer.component';
import { AppFormService } from '../../setting/app-form/app-form.service';
import { MENU_PROCESS_FLOW } from "../../pages-menu";
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
  sourceBy: any;
  soList: any;
  examUserId: any;
  listExamDialog: any;

  isExpress = false;
  questionFilter = [];
  questionFilterSelected: Filter[] = [];

  constructor(
    private router: Router,
    private service: InterviewService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    public matDialog: MatDialog,
    public candidateService: CandidateService,
    public calendarService: CalendarService,
    public appFormService: AppFormService,
  ) {
    this.jrId = getJrId();
    if (!this.jrId) {
      this.router.navigate(["/employer/interview/list"]);
    }
    this.role = getRole();
    this.jrName = getJdName();
    this.collapseAll = getCollapse();
    this.devices = this.utilitiesService.getDevice();
    this.innerWidth = window.innerWidth * 0.5;
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
    this.isExpress = this.role.refCompany.isExpress;
    this.keyword = getKeyword() || '';
    setKeyword();
    if (this.keyword) {
      let menu = MENU_PROCESS_FLOW.find(element => {
        return element.title === "Pending Interview";
      });
      menu.link = menu.link.replace('detail', 'list');
    }
  }

  ngOnInit() {
    this.items = [];
    this.soList = [];
    this.sourceBy = [];
    // this.keyword = '';
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
      })
    })
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
      filters: this.sourceBy,
      questionFilters: this.questionFilterSelected
    };
    this.items = [];
    this.score = [];
    this.service.getDetail(this.refStageId, this.jrId, this.tabSelected, this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.items.map((item, index) => {
          item.collapse = this.collapseAll;
          item.condition = this.setCondition(item);
          if (this.utilitiesService.dateIsValid(item.refCandidate.birth)) {
            item.refCandidate.birth = new Date((item.refCandidate.birth));
            var timeDiff = Math.abs(Date.now() - item.refCandidate.birth.getTime());
            item.refCandidate.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          }
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

        if (this.isExpress) {
          this.forExpressCompany();
        }
      }
      this.loading = false;
    });
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
        interviewDate: false,
        interviewScore: false,
      },
      button: {
        step: {},
        nextStep: false,
        interviewDate: false,
        interviewScore: false,
        reject: false,
        revoke: false,
        comment: false,
        disabled: false,
        send: false
      },
      isExpired: false,
    };
    let step;
    if (item.refJR.requiredExam) {
      step = this.role.refAuthorize.processFlow.exam.steps.find(step => {
        return step.refStage._id === item.refStage._id;
      });
    } else {
      step = this.role.refAuthorize.processFlow.noExam.steps.find(step => {
        return step.refStage._id === item.refStage._id;
      });
    }
    if (step) {
      condition.button.step = step;
      condition.button.comment = true;

      if (item.pendingInterviewInfo.userInterviews.length) {
        const found = item.pendingInterviewInfo.userInterviews.find(element => {
          return element.refUser === this.role._id;
        });
        if (found) {
          condition.icon.interviewScore = true;
          if (item.pendingInterviewScoreInfo.evaluation.length) {
            condition.button.interviewScore = false;
          } else {
            condition.button.interviewScore = true
          }
        }
        if (this.tabSelected != 'PENDING') {
          condition.button.interviewScore = false;
          condition.icon.interviewScore = false;
        }
      }
      if (step.editable) {
        switch (item.refStage.order) {
          case 401: // Interview Taken
            if (this.tabSelected === 'PENDING') {
              condition.icon.interviewDate = true;
              condition.button.interviewScore = false;
              condition.button.reject = true;
              if (this.utilitiesService.dateIsValid(item.pendingInterviewInfo.startDate)
                && item.pendingInterviewInfo.refLocation
              ) {
                condition.button.nextStep = true;
                if (this.utilitiesService.isDateGreaterThanToday(item.pendingInterviewInfo.startDate)) {
                  condition.button.disabled = true;
                }
              } else {
                condition.button.interviewDate = true;
              }
            } else {
              condition.button.revoke = true;
            }
            break;
          case 402: // Interview Score
            if (this.tabSelected === 'PENDING') {
              condition.button.reject = true;
              if (item.pendingInterviewScoreInfo.evaluation.length) {
                condition.button.nextStep = true;
              } else {
                const found = item.pendingInterviewInfo.userInterviews.find(element => {
                  return element.refUser === this.role._id;
                });
                if (found) {
                  condition.button.interviewScore = true;
                }
              }
            } else {
              condition.icon.interviewScore = false;
              condition.button.interviewScore = false;
              condition.button.send = true;
            }
            break;
        }
      }
    }
    if (item.refJR.refStatus.status !== 'JRS002') {
      condition.isExpired = true;
      condition.icon.interviewDate = false;
      condition.icon.interviewScore = false;
      condition.button.interviewScore = false;
    }
    return condition;
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

  infoResult(item: any) {
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

  checkExam(dialog: TemplateRef<any>, item, _id) {
    this.examUserId = _id;
    this.listExamDialog = item;
    this.callDialog(dialog);
  }

  showExamCand(examId, flag) {
    this.dialogRef.close();
    setFlagExam(flag)
    const path = '/exam-form/view/' + examId + '/' + this.examUserId;
    this.router.navigate([path]);
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
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
      setUserToken(this.role.token);
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