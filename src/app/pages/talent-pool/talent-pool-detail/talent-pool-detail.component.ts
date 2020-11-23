import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";
import { TalentPoolService } from '../talent-pool.service';
import { ResponseCode, Paging, InputType } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, Count, Filter, DropDownValue, DropDownGroup } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJdId, getJrId, setFlowId, setCandidateId, setFlagCall, setUserEmail, setFieldName, setJdName, setFlagExam, setAppFormData, setUserToken, setHistoryData, setCompanyId, getHistoryData, getUserSuccess, setFlagEdit, getFlagEdit, getKeyword, setKeyword, getAppURL, getFlagCall, getHCID, setHCID } from '../../../shared/services/auth.service';
import { setTabName, getTabName, setCollapse, getCollapse } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { PopupCommentComponent } from '../../../component/popup-comment/popup-comment.component';
import { PopupRejectComponent } from '../../../component/popup-reject/popup-reject.component';
import { PopupExamDateComponent } from '../../../component/popup-exam-date/popup-exam-date.component';
import { PopupCvComponent } from '../../../component/popup-cv/popup-cv.component';
import { PopupTransferComponent } from '../../../component/popup-transfer/popup-transfer.component';
import { PopupCallHistoryComponent } from '../../../component/popup-call-history/popup-call-history.component';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService, NbDialogRef } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { MESSAGE } from "../../../shared/constants/message";
import { CandidateService } from '../../candidate/candidate.service';
import { AppFormService } from '../../setting/app-form/app-form.service';
import { PopupTrainingDateComponent } from '../../../component/popup-training-date/popup-training-date.component';
import { PopupChatUserComponent } from '../../../component/popup-chat-user/popup-chat-user.component';
import { PopupHistoryComponent } from '../../../component/popup-history/popup-history.component';
import { environment } from '../../../../environments/environment';
import { MENU_PROCESS_FLOW } from "../../pages-menu";
import { JobBoardService } from '../../setting/job-board/job-board.service';
import { elementAt } from 'rxjs/operators';
@Component({
  selector: 'ngx-talent-pool-detail',
  templateUrl: './talent-pool-detail.component.html',
  styleUrls: ['./talent-pool-detail.component.scss']
})
export class TalentPoolDetailComponent implements OnInit {
  role: any;
  jrId: any;
  jrName: any;
  hcId: any;
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
  showCondition: boolean;
  email: boolean = true;
  jobsDB: boolean = true;
  other: boolean = true;
  sourceBy: any;
  soList: any;
  examUserId: any;
  dialogRef: NbDialogRef<any>;
  listExamDialog: any;

  isExpress: boolean = false;
  questionFilter = [];
  questionFilterSelected: Filter[] = [];

  isFilter: boolean;
  // filteredProvince: any;
  // filteredDistrict: any;
  filterBy: any;
  tempFilterBy: any;
  // searchArea: any;
  filterSort: any;

  selectType: any;
  filterType: any;
  // call filter //
  callType: any;
  userLists: any = [];
  userAll: any = [];
  filteredUserAll: any = [];

  // cand filter //
  candType: any;
  startTime: any = {};

  // // dialog call //
  // itemCall: any;
  innerHeight: any;
  waitingApprove: boolean = false;
  appfromURL: any;
  isHybrid: any;
  jdType: any;
  callList: any = [];
  statusCodeList: any = [null, '2'];
  maxH: any;
  innerWidth: any;
  constructor(
    private router: Router,
    private service: TalentPoolService,
    private jobService: JobBoardService,
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
    this.hcId = getHCID();
    this.collapseAll = getCollapse();
    this.devices = this.utilitiesService.getDevice();
    this.maxH = window.innerHeight * 0.5;
    this.jdType = getJdId()
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
      if (element.name !== 'SELECTED') {
        this.tabs.push({
          name: element.name,
          icon: icon,
          badgeText: 0,
          badgeStatus: 'default',
        });
      }
    });
    this.steps = this.role.refAuthorize.processFlow.exam.steps.filter(step => {
      return step.refStage.refMain._id === this.role.refCompany.menu.talentPool.refStage._id && step.editable;
    });
    this.startFlag = true;
    this.isExpress = this.role.refCompany.isExpress;
    this.isHybrid = this.role.refCompany.isHybrid || false;
    this.keyword = getKeyword() || '';
    this.appfromURL = this.role
    setKeyword();
    if (this.keyword) {
      let menu = MENU_PROCESS_FLOW.find(element => {
        return element.title === "Talent Pool";
      });
      menu.link = menu.link.replace('detail', 'list');
    }
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.items = [];
    this.comments = [];
    this.soList = [];
    this.sourceBy = [];
    this.filterBy = {};
    this.tempFilterBy = {};
    // this.searchArea = [];
    this.filterType = 'all';
    this.showTips = false;
    this.showCondition = true;
    this.filterSort = 'apply';
    this.selectType = 'sort';
    this.callType = 'pendingCall';
    this.candType = 'new';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.callList = [
      { label: 'All', value: 'all' },
      { label: 'Pending Call', value: 'pendingCall' },
      { label: 'Called', value: 'called' }
    ]
    this.isFilter = false;
    if (!this.isExpress || this.jdType === 3) {
      this.filterBy = this.sourceBy;
      this.tempFilterBy = this.sourceBy;
    } else {
      this.filterBy = {
        filterBy: this.filterType,
        calledBy: this.userLists,
        date: this.startTime
      };
      this.tempFilterBy = {
        filterBy: 'all',
        calledBy: [],
        date: {}
      };
    };
    this.onModel();
  }

  async onModel() {
    if (!this.isExpress || this.jdType === 3) {
      await this.sourceList();
    } else {
      await this.getQuestionFilter();
    }
  }

  sourceList() {
    return new Promise((resolve) => {
      this.jobService.getList().subscribe(response => {
        if (ResponseCode.Success && response.code) {
          this.soList = response.data;
          this.soList.map(element => {
            if (element.active === true) {
              this.sourceBy.push(element._id);
            }
          })
          this.filterBy = this.sourceBy;
          this.search();
        }
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
    if (this.soList.length === 0 && !this.isExpress) {
      this.sourceList();
    } else {
      this.search();
    }
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
          'refSource.name',
        ],
        filters: this.filterBy,
        questionFilters: this.questionFilterSelected,
        sortOrderBy: this.filterSort
      };
      this.items = [];
      this.service.getDetail(this.refStageId, this.jrId, this.tabSelected, this.criteria).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.items = response.data;
          this.jdType = response.jobType.type;
          this.showTips = response.isOverCandidate;
          this.items.map(item => {
            item.collapse = this.collapseAll;
            item.condition = this.setCondition(item);
            item.commentLenght = item.comments.length;
            // appform
            item.hasAppform = false;
            // if (item.refSource) {
            //   item.refSource.map(element => {
            //     if (element.name === 'App-Form') {
            //       item.hasAppform = true;
            //     }
            //   })
            // }
            if (item.generalAppForm && item.generalAppForm.flag) {
              item.hasAppform = true;
            }
            if (this.isExpress) {
              item.facebookLength = (item.inboxes) ? item.inboxes.length : 0;
              if (!item.called.lastChangedInfo) {
                item.called.lastChangedInfo = {
                  refUser: ''
                }
              }
              // if (this.utilitiesService.dateIsValid(item.training.date)) {
              //   item.training.date = this.utilitiesService.convertDateTime(item.training.date);
              // } else {
              //   item.training.date = '';
              // }
              // if (this.utilitiesService.dateIsValid(item.onboard.date)) {
              //   item.onboard.date = this.utilitiesService.convertDateTime(item.onboard.date);
              // } else {
              //   item.onboard.date = '';
              // }
              if (item.called && item.called.lastChangedInfo) {
                if (this.utilitiesService.dateIsValid(item.called.lastChangedInfo.date)) {
                  item.called.lastChangedInfo.date = this.utilitiesService.convertDateTime(item.called.lastChangedInfo.date);
                }
              }
              if (item.called && item.called.callbackDate && this.utilitiesService.dateIsValid(item.called.callbackDate)) {
                item.called.callbackDate = this.utilitiesService.convertDateTime(item.called.callbackDate);
              } else {
                item.called.callbackDate = null
              }
              if (item.callHistory.length > 0) {
                item.callHistory.forEach(element => {
                  element.date = this.utilitiesService.convertDateTime(element.date);
                });
              }
            }
            if (item.refCandidate && item.refCandidate.birth) {
              if (this.utilitiesService.dateIsValid(item.refCandidate.birth) && item.refCandidate.birth !== '1970-01-01T00:00:00.000Z') {
                item.refCandidate.birth = new Date((item.refCandidate.birth));
                var timeDiff = Math.abs(Date.now() - item.refCandidate.birth.getTime());
                item.refCandidate.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
              }
            }
          });
          // filter hub
          // if (response.filter && this.isExpress && !this.filter.data.provinces.length && !this.isHybrid) {
          //   this.filter.isFilter = true;
          //   response.filter.provinces.forEach(element => {
          //     this.filter.data.provinces.push({
          //       label: element.refProvince.name.th,
          //       value: element.refProvince._id
          //     })
          //     this.filter.temp.provinces.push({
          //       label: element.refProvince.name.th,
          //       value: element.refProvince._id
          //     })
          //   });
          //   response.filter.areas.forEach(element => {
          //     let hubName = '';
          //     hubName = element.name;
          //     if (element.hubCode) {
          //       hubName = element.name + '(' + element.hubCode + ')';
          //     }
          //     this.filter.data.areas.push({
          //       label: hubName,
          //       value: element._id,
          //       group: element.refProvince
          //     })
          //     this.filter.temp.areas.push({
          //       label: hubName,
          //       value: element._id,
          //       group: element.refProvince
          //     })
          //   });
          //   response.filter.users.forEach(element => {
          //     this.userAll.push({
          //       label: this.utilitiesService.setFullname(element),
          //       value: element._id
          //     })
          //   });
          //   this.filteredDistrict = this.filter.data.areas.slice();
          //   this.filter.data.provinces = this.removeDuplicates(this.filter.data.provinces, "value")
          //   this.filteredProvince = this.filter.data.provinces.slice();
          //   this.userAll = this.removeDuplicates(this.userAll, "value")
          //   this.filteredUserAll = this.userAll.slice();
          // }
          if (this.isHybrid && this.jdType !== 3) {
            this.isFilter = true;
            this.getUser();
          }

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

  getUser() {
    this.userAll = [];
    this.service.getListUser().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        response.data.forEach(element => {
          this.userAll.push({
            label: this.utilitiesService.setFullname(element),
            value: element._id
          })
        });
        this.filteredUserAll = this.userAll.slice();
      }
    })
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  clearFilter() {
    this.filterBy = this.tempFilterBy;
    this.filterType = 'all';
    this.selectType = 'sort';
    this.filterSort = 'apply';
    this.startTime = {};
    this.userLists = [];
    this.callType = 'pendingCall';
    this.search();
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
    this.filterBy = this.sourceBy;
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
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: 'คุณต้องการทำรายการต่อหรือไม่' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.waitingApprove = true;
        this.candidateService.candidateFlowApprove(item._id).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            // set to processing
            item.waitingCVID = true;
            // let indexA
            // this.items.map((element, index) => {
            //   if (element._id === item._id) {
            //     indexA = index;
            //   }
            // })
            // this.items.splice(indexA, 1);
            // this.tabs.map(element => {
            //   if (element.name === 'PENDING' && element.badgeText !== 0) {
            //     element.badgeText = element.badgeText - 1;
            //   }
            // })
            this.waitingApprove = false;
          } else {
            this.waitingApprove = false;
            this.showToast('danger', 'Error Message', response.message);
          }
        });
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
        // this.search();
        let indexA
        this.items.map((element, index) => {
          if (element._id === item._id) {
            indexA = index;
          }
        })
        this.items.splice(indexA, 1);
        const userBlock = getUserSuccess();
        this.tabs.map(element => {
          if (element.name === 'PENDING') {
            element.badgeText = element.badgeText - 1;
          }
          if (element.name === 'REJECTED' && userBlock !== 'block') {
            element.badgeText = element.badgeText + 1;
          }
        })
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
            // this.search();
            let indexA
            this.items.map((element, index) => {
              if (element._id === item._id) {
                indexA = index;
              }
            })
            this.items.splice(indexA, 1);
            const userBlock = getUserSuccess();
            this.tabs.map(element => {
              if (element.name === 'PENDING') {
                element.badgeText = element.badgeText + 1;
              }
              if (element.name === 'REJECTED') {
                element.badgeText = element.badgeText - 1;
              }
            })
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
    if (!this.isExpress) {
      setTabName(this.tabSelected);
      setCollapse(this.collapseAll);
      setFlowId(item._id);
      setCandidateId(item.refCandidate._id);
      this.router.navigate(["/employer/candidate/detail"]);
    }
  }

  openPopupComment(item: any) {
    setFlowId(item._id);
    this.dialogService.open(PopupCommentComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      // this.search();
      if (result) {
        setFlowId();
      }
      let flag = getFlagEdit();
      setFlagEdit();
      if (flag) {
        let comment = getHistoryData();
        item.commentLenght = comment.length;
      }
    });
  }

  checkExam(dialog: TemplateRef<any>, item, _id) {
    this.examUserId = _id;
    this.listExamDialog = item;
    this.callDialog(dialog)
  }

  openCallHistory(item) {
    setHistoryData(item);
    setFlagEdit(true);
    this.dialogService.open(PopupCallHistoryComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      if (result) {
        let data = getHistoryData();
        setHistoryData();
        // let flag = getFlagCall();
        if (data) {
          item.called.flag = data.called;
          item.called.lastChangedInfo.refUser = data.refUser;
          item.called.lastChangedInfo.date = this.utilitiesService.convertDateTime(data.date);
          item.called.missCall = data.missCall;
          item.called.callbackDate = this.utilitiesService.convertDateTime(data.callbackDate);
          item.refCandidate.callHistory.push({})
        } else {
          item.called.flag = false;
          item.called.lastChangedInfo.refUser = '';
          item.called.lastChangedInfo.date = null;
          item.called.missCall = false;
          item.called.callbackDate = null;
          item.refCandidate.callHistory = [];
        }
        setFlagEdit();
        setFlagCall();
      }
      // let flag = getFlagEdit();
      // setFlagEdit();
      // if (flag) {
      //   let comment = getHistoryData();
      //   item.commentLenght = comment.length;
      // }
    });
    // this.itemCall = item.callHistory;
    // this.callDialog(dialog);
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
      setUserToken(this.role.token);
      setFlagExam('true');
      setCompanyId(this.role.refCompany._id)
      const appURL = getAppURL();
      // window.open(appURL + "appform/detail/" + item.generalAppForm.refGeneralAppForm  + "/" + this.role.token);
      this.router.navigate([]).then(result => {
        // window.open("http://10.35.0.105:4201/appform/flash/d/" + item.generalAppForm.refGeneralAppForm + "/" + this.role.token, '_blank');
        window.open(appURL + "appform/flash/d/" + item.generalAppForm.refGeneralAppForm._id + "/" + this.role.token, '_blank');
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

  sortData(name) {
    if (name === 'score') {
      this.filterSort = 'score';
      this.search();
    } else {
      this.filterSort = 'apply';
      this.search();
    }
  }

  selectSort(type: string) {
    this.selectType = type;
  }

  checkFiltered(name) {
    this.callType = name;
    this.filterType = name;
    this.filterBy = this.tempFilterBy;
    if (name === 'pendingCall') {
      // this.filterBy.push({
      //   name: 'filterBy',
      //   value: this.filterType
      // })
      this.filterBy = { filterBy: this.filterType };
    } else {
      // this.filterBy.push({
      //   name: 'filterBy',
      //   value: this.filterType
      // },
      //   {
      //     name: 'calledBy',
      //     value: this.userLists
      //   },
      //   {
      //     name: 'date',
      //     value: this.startTime
      //   }
      // )
      this.filterBy = {
        filterBy: this.filterType,
        calledBy: this.userLists,
        date: this.startTime
      };
    }
    this.search();
  }

  checkCand(name) {
    this.candType = name;
    this.filterType = name;
    this.filterBy = this.tempFilterBy;
    this.filterBy = {
      filterBy: this.filterType,
      calledBy: this.userLists,
      date: this.startTime
    };
    this.search();
  }

  changeCall(item) {
    // if (item.called.flag) {
    //   const confirm = this.matDialog.open(PopupMessageComponent, {
    //     width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
    //     data: { type: 'C', content: 'คุณต้องการยืนยันการโทรติดตามหรือไม่' }
    //   });
    //   confirm.afterClosed().subscribe(result => {
    //     if (result) {
    //       item.called.isFollow = true;
    //       this.callService(item, item.called);
    //     } else {
    //       const confirm = this.matDialog.open(PopupMessageComponent, {
    //         width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
    //         data: { type: 'C', content: 'คุณต้องการยกเลิกการโทรครั้งก่อนหรือไม่' }
    //       });
    //       confirm.afterClosed().subscribe(result => {
    //         if (result) {
    //           item.called.flag = !item.called.flag;
    //           this.callService(item, item.called);
    //         }
    //       })
    //     }
    //   });
    // } else {
    //   item.called.flag = !item.called.flag;
    //   this.callService(item, item.called);
    // }
    // item.called.flag = !item.called.flag;
    setFlagCall(true);
    this.openCallHistory(item)
    // this.callService(item, item.called);
  }

  callService(item, data) {
    if (!data.flag) {
      setFlagCall(true);
      this.openCallHistory(item)
    } else {
      item.called.flag = !item.called.flag;
      this.candidateService.candidateFlowEdit(item._id, { called: data }).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.showToast('success', 'Success Message', response.message);
          item.called.lastChangedInfo.refUser = this.role;
          item.called.lastChangedInfo.date = this.utilitiesService.convertDateTime(new Date());
          item.refCandidate.callHistory.push({
            refUser: {
              firstname: this.role.firstname,
              lastname: this.role.lastname,
              imageData: this.role.imagePath
            },
            date: this.utilitiesService.convertDateTime(new Date()),
            called: item.called.flag,
            isFollow: item.called.isFollow
          })
        } else {
          this.showToast('danger', 'Error Message', response.message);
        }
      })
    }
  }

  openPopupTrainingDate(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupTrainingDateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        let history = getHistoryData();
        console.log(history)
        if (history.training && history.training.date) {
          if (!history.training.time) {
            history.training.time = {
              hour: 0,
              minute: 0,
              second: 0
            }
          }
          item.training.date = this.utilitiesService.convertDateTime(this.utilitiesService.convertTimePickerToDate(history.training.time, history.training.date));
        } else {
          item.training.date = null;
        }
        if (history.onboard && history.onboard.date) {
          if (!history.onboard.time) {
            history.onboard.time = {
              hour: 0,
              minute: 0,
              second: 0
            }
          }
          item.onboard.date = this.utilitiesService.convertDateTime(this.utilitiesService.convertTimePickerToDate(history.onboard.time, history.onboard.date));
        } else {
          item.onboard.date = null;
        }
      }
    });
  }

  openChatUser(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupChatUserComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        // this.search();
      }
      let flag = getFlagEdit();
      setFlagEdit()
      if (flag) {
        let comment = getHistoryData();
        item.facebookLength = comment.length;
      }
    });
  }

  checkCV(item: any) {
    const url = environment.API_URI + "/pdf/" + item._id;
    // const url = environment.API_URI + "/pdf" + '?id=' + item._id;
    window.open(url, '_blank');
  }

  openHistory(item: any) {
    setHistoryData(item)
    this.dialogService.open(PopupHistoryComponent, {
      closeOnBackdropClick: false,
      hasScroll: true,
    }
    ).onClose.subscribe(result => {
      if (result) {
        // this.search();
        setHistoryData();
      }
    });
  }

  onEventStartEndRange(event) {
    if (event.start && !event.end) {
      this.startTime.start = event.start;
      this.startTime.end = event.start;
    } else {
      this.startTime = event;
    }
    // this.filterBy = [
    //   {
    //     name: 'filterBy',
    //     value: this.filterType
    //   },
    //   {
    //     name: 'calledBy',
    //     value: this.userLists
    //   },
    //   {
    //     name: 'date',
    //     value: this.startTime
    //   }
    // ]
    this.filterBy.date = this.startTime
    this.search();
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
