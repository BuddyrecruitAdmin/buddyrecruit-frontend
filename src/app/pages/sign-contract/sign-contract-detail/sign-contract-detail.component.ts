import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SignContractService } from '../sign-contract.service';
import { ResponseCode, Paging, InputType } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, Count, Filter, DropDownValue, DropDownGroup } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId, setCandidateId, setButtonId, setUserCandidate, setIconId, setUserEmail } from '../../../shared/services/auth.service';
import { setTabName, getTabName, setCollapse, getCollapse } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { PopupCommentComponent } from '../../../component/popup-comment/popup-comment.component';
import { PopupRejectComponent } from '../../../component/popup-reject/popup-reject.component';
import { PopupSignDateComponent } from '../../../component/popup-sign-date/popup-sign-date.component';
import { PopupCvComponent } from '../../../component/popup-cv/popup-cv.component';
import { PopupPreviewEmailComponent } from '../../../component/popup-preview-email/popup-preview-email.component';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { MESSAGE } from "../../../shared/constants/message";
import { CandidateService } from '../../candidate/candidate.service';
import { PopupInterviewResultComponent } from '../../../component/popup-interview-result/popup-interview-result.component';
import { AppFormService } from '../../setting/app-form/app-form.service';
import { PopupTrainingDateComponent } from '../../../component/popup-training-date/popup-training-date.component';
import { PopupChatUserComponent } from '../../../component/popup-chat-user/popup-chat-user.component';
@Component({
  selector: 'ngx-sign-contract-detail',
  templateUrl: './sign-contract-detail.component.html',
  styleUrls: ['./sign-contract-detail.component.scss']
})
export class SignContractDetailComponent implements OnInit {
  role: any;
  jrId: any;
  jrName: any;
  refStageId: any;
  tabs: any;
  steps: any;
  items: any;
  itemSelected: any;
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
  count: Count;
  showTips: boolean;
  sourceBy: any;
  soList: any;

  isExpress: boolean = false;
  questionFilter = [];
  questionFilterSelected: Filter[] = [];

  filter: {
    isFilter: boolean,
    data: {
      provinces: DropDownValue[],
      areas: DropDownGroup[]
    },
    temp: {
      provinces: DropDownValue[],
      areas: DropDownGroup[]
    },
    selected: {
      provinces: any,
      areas: any;
    }
  };
  filteredProvince: any;
  filteredDistrict: any;
  filterBy: any;
  searchArea: any;
  filterSort: any;
  constructor(
    private router: Router,
    private service: SignContractService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    public matDialog: MatDialog,
    public candidateService: CandidateService,
    public appFormService: AppFormService,
  ) {
    this.jrId = getJrId();
    if (!this.jrId) {
      this.router.navigate(["/employer/sign-contract/list"]);
    }
    this.role = getRole();
    this.jrName = getJdName();
    this.collapseAll = getCollapse();
    this.devices = this.utilitiesService.getDevice();
    this.refStageId = this.role.refCompany.menu.pendingSignContract.refStage._id;
    const tabs = this.role.refCompany.menu.pendingSignContract.refStage.tabs.filter(tab => {
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
      return step.refStage.refMain._id === this.role.refCompany.menu.pendingSignContract.refStage._id && step.editable;
    });
    this.isExpress = this.role.refCompany.isExpress;
  }

  ngOnInit() {
    this.items = [];
    this.comments = [];
    this.keyword = '';
    this.soList = [];
    this.sourceBy = [];
    this.showTips = false;
    this.filterBy = [];
    this.searchArea = [];
    this.filterSort = 'apply';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.filter = {
      isFilter: false,
      data: {
        provinces: [],
        areas: []
      },
      temp: {
        provinces: [],
        areas: []
      },
      selected: {
        provinces: [],
        areas: []
      }
    }
    if (!this.isExpress) {
      this.filterBy = this.sourceBy;
    } else {
      this.filterBy = [
        {
          name: 'province',
          value: this.filter.selected.provinces
        },
        {
          name: 'area',
          value: this.searchArea
        }
      ]
    };
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
      filters: this.filterBy,
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
          if (this.utilitiesService.dateIsValid(item.refCandidate.birth)) {
            item.refCandidate.birth = new Date((item.refCandidate.birth));
            var timeDiff = Math.abs(Date.now() - item.refCandidate.birth.getTime());
            item.refCandidate.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          }
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
        // filter hub
        if (response.filter && this.isExpress && !this.filter.data.provinces.length) {
          this.filter.isFilter = true;
          response.filter.provinces.forEach(element => {
            this.filter.data.provinces.push({
              label: element.refProvince.name.th,
              value: element.refProvince._id
            })
            this.filter.temp.provinces.push({
              label: element.refProvince.name.th,
              value: element.refProvince._id
            })
          });
          response.filter.areas.forEach(element => {
            this.filter.data.areas.push({
              label: element.name,
              value: element._id,
              group: element.refProvince
            })
            this.filter.temp.areas.push({
              label: element.name,
              value: element._id,
              group: element.refProvince
            })
          });
          this.filter.data.provinces = this.removeDuplicates(this.filter.data.provinces, "value")
          this.filteredProvince = this.filter.data.provinces.slice();
        }
        this.sortData('apply')
        this.paging.length = (response.count && response.count.data) || response.totalDataSize;
        this.setTabCount(response.count);

        if (this.isExpress) {
          this.forExpressCompany();
        }
      }
      this.loading = false;
    });
  }

  changeFilter(calculate: boolean = true) {
    if (calculate) {
      this.filter.data.areas = [];
      this.searchArea = [];
      this.filter.selected.provinces.forEach(province => {
        const districts = this.filter.temp.areas.filter(district => {
          return district.group === province;
        });
        districts.forEach(district => {
          this.filter.data.areas.push({
            label: district.label,
            value: district.value,
            group: province
          });
        });
      });
      const districtSelected = _.cloneDeep(this.filter.selected.areas);
      this.filter.selected.areas = [];
      if (districtSelected.length) {
        districtSelected.forEach(district => {
          const found = this.filter.data.areas.find(element => {
            return element.value === district;
          });
          if (found) {
            this.filter.selected.areas.push(found.value);
            this.searchArea.push({
              refProvince: found.group,
              _id: found.value
            })
          }
        });
      }
      this.filter.data.areas = this.removeDuplicates(this.filter.data.areas, "value")
      this.filteredDistrict = this.filter.data.areas.slice();
    }
    this.filterBy = [
      {
        name: 'province',
        value: this.filter.selected.provinces
      },
      {
        name: 'area',
        value: this.searchArea
      }
    ]
    this.search();
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  clearFilter() {
    this.filter.selected.provinces = [];
    this.filter.selected.areas = [];
    this.filterBy = [
      {
        name: 'province',
        value: this.filter.selected.provinces
      },
      {
        name: 'area',
        value: this.searchArea
      }
    ]
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
    this.search();
  }

  setCondition(item: any): any {
    let condition = {
      icon: {
        signContract: false,
        onBoard: false,
      },
      button: {
        step: {},
        nextStep: false,
        reject: false,
        revoke: false,
        comment: false,
        signInfo: false
      },
      isExpired: false
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
      if (step.editable) {
        if (this.tabSelected === 'PENDING') {
          condition.icon.signContract = true;
          condition.button.nextStep = true;
          condition.button.reject = true;
          if (!this.utilitiesService.convertDateTime(item.pendingSignContractInfo.sign.date) && !this.isExpress
          ) {
            condition.button.signInfo = true;
            condition.button.nextStep = false;
          }
        } else {
          condition.button.revoke = true;
        }
      }
    }
    if (item.refJR.refStatus.status !== 'JRS002') {
      condition.isExpired = true;
      condition.icon.signContract = false;
    }
    return condition;
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
    if (item.refJR.isDefault) {
      // this.refStageId = item.refStage._id;
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'C', content: 'คุณต้องการทำรายการต่อหรือไม่' }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          this.candidateService.candidateFlowApprove(item._id, item.refStage._id, button, undefined).subscribe(response => {
            if (response.code === ResponseCode.Success) {
              this.showToast('success', 'Success Message', response.message);
              this.search();
            } else {
              this.showToast('danger', 'Error Message', response.message);
            }
          });
        }
      });
    } else {
      if (item.refCandidate.email) {
        setUserEmail(item.refCandidate.email);
      }
      if (this.utilitiesService.dateIsValid(item.pendingSignContractInfo.agreeStartDate)) {
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
      } else {
        this.nextStep(item, button);
      }
    }
  }

  nextStep(item: any, button: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: `Do you want to pass to onboard?` }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
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
        this.candidateService.candidateFlowApprove(item._id, step.refStage._id, button._id, item).subscribe(response => {
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

  openPopupSignContractDate(item: any, icon: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    // if (this.utilitiesService.isDateLowerThanToday(item.pendingSignContractInfo.sign.date)) {
    //   setIconId("True");
    // }
    this.dialogService.open(PopupSignDateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      setIconId();
      if (result) {
        this.search();
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

  sortData(name) {
    if (name === 'score') {
      this.items.sort(function (a, b) {
        return b.totalScore - a.totalScore
      })
    } else {
      this.items.sort(function (a, b) {
        const aa = new Date(a.timestamp);
        const bb = new Date(b.timestamp);
        return aa < bb ? -1 : aa > bb ? 1 : 0;
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
        this.search();
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
