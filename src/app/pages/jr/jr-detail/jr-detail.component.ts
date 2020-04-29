import { Component, OnInit, TemplateRef } from '@angular/core';
import { JrService } from '../jr.service';
import { ResponseCode, Paging, State } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, DropDownGroup } from '../../../shared/interfaces/common.interface';
import { getRole, setFlowId, setAllList, setAllListName } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DropDownValue } from '../../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { DropdownService } from '../../../shared/services/dropdown.service';
import * as _ from 'lodash';
import { MESSAGE } from '../../../shared/constants/message';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { PopupEvaluationComponent } from '../../../component/popup-evaluation/popup-evaluation.component';
import { PopupSearchDropdownComponent } from '../../../component/popup-search-dropdown/popup-search-dropdown.component';
import { resolve } from 'url';

@Component({
  selector: 'ngx-jr-detail',
  templateUrl: './jr-detail.component.html',
  styleUrls: ['./jr-detail.component.scss']
})
export class JrDetailComponent implements OnInit {
  jr: any;
  _id: any;
  state: string;
  jobDB: boolean;
  jobStatus: any;
  editExam: boolean;
  duplicateCheck: boolean;
  role: any;
  editCheck: boolean;
  emailCheck: boolean;
  touchedEva: boolean;
  sErrorEvaluation: string;
  touched: boolean;
  sErrorPosition: string;
  touchedStart: boolean;
  sErrorStart: string;
  touchedEnd: boolean;
  sErrorEnd: string;
  touchedCheck: boolean;
  sErrorCheck: string;
  touchedCap: boolean;
  sErrorCap: string;
  touchedOn: boolean;
  sErrorOn: string;
  JobPosition: DropDownValue[];
  ExamLists: DropDownValue[];
  Evaluation: DropDownValue[];
  Users: DropDownGroup[];
  sErrorUser: string;
  checkPreview: boolean;
  jobId: any;
  loading: any;
  filteredList: any;
  filteredList2: any;
  filteredList3: any;
  filteredListExam: any;
  examShow: any;
  dialogRef: NbDialogRef<any>;
  tempExam: any;
  innerWidth: any;
  innerHeight: any;
  constructor(
    private service: JrService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    private dropdownService: DropdownService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.role = getRole();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.6;
  }

  ngOnInit() {
    this.loading = true;
    this.tempExam = [];
    this.examShow = [];
    this.initialModel();
    this.activatedRoute.params.subscribe(params => {
      this.emailCheck = true;
      this.jobDB = false;
      this.checkPreview = false;
      if (params.id) {
        this._id = params.id;
        this.duplicateCheck = false;
        this.editCheck = false;
        if (params.action === State.Edit) {
          this.state = State.Edit;
        } else if (params.action === 'duplicate') {
          this.state = 'duplicate';
        } else if (params.action === 'preview') {
          this.state = 'preview';
          this.checkPreview = true;
        }
        this.initialDropDown().then((response) => {
          this.getDetail();
        });
      } else {
        this.state = State.Create;
        this.jr.requiredExam = false;
        this.jr.requiredAttitude = false;
        this.jr.capacity = 0;
        this.jobStatus = 'notUsed';
        this.loading = false;
        this.editExam = true;
        this.initialDropDown();
      }
    });
  }

  initialModel(): any {
    this.jr = {
      _id: undefined,
      refJD: {
        _id: undefined
      },
      capacity: undefined,
      duration: {
        startDate: null,
        endDate: null,
      },
      onboardDate: null,
      requiredExam: undefined,
      requiredAttitude: undefined,
      refSource: undefined,
      remark: '',
      refStatus: undefined,
      refEvaluation: undefined,
      userInterviews: [],
    }
  }

  async initialDropDown() {
    await this.getJobPosition();
    await this.getUserList();
    await this.getEvaluationList();
    await this.getExamOnlineList();
  }

  getExamOnlineList() {
    return new Promise((resolve) => {
      this.ExamLists = [];
      this.service.getListExamOnline().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            console.log(response.data)
            response.data.forEach(element => {
              this.ExamLists.push({
                label: element.name,
                value: element._id
              });
            });
            this.filteredListExam = this.ExamLists.slice();
          }
        }
        resolve();
      });
    });
  }

  getJobPosition() {
    return new Promise((resolve) => {
      this.JobPosition = [];
      // this.JobPosition.push({
      //   label: '- Select Job Position -',
      //   value: undefined
      // });
      this.service.getJobPositionList(this.jobStatus).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            this.jobId = response.data;
            response.data.forEach(element => {
              this.JobPosition.push({
                label: element.position,
                value: element._id
              });
            });
            this.filteredList = this.JobPosition.slice();
          }
        }
        resolve();
      });
    });
  }

  getUserList() {
    return new Promise((resolve) => {
      this.Users = [];
      // this.Users.push({
      //   label: '- Select Users Interview -',
      //   value: undefined,
      //   group: 'disabled'
      // });
      this.dropdownService.getUser().subscribe(res => {
        if (res.code === ResponseCode.Success) {
          res.data.forEach(item => {
            this.Users.push({
              label: this.utilitiesService.setFullname(item.refUser),
              value: item._id,
              group: 'disabled'
            });
          });
        }
      });
      resolve();
    });
  }

  getEvaluationList() {
    return new Promise((resolve) => {
      this.Evaluation = [];
      // this.Evaluation.push({
      //   label: '- Select Evaluation -',
      //   value: undefined
      // });
      this.service.getEvaluationList().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            response.data.forEach(element => {
              this.Evaluation.push({
                label: element.name,
                value: element._id
              })
            });
            this.filteredList3 = this.Evaluation.slice();
          }
        }
      });
      resolve();
    });
  }

  onChangeJobposition(value) {
    const jobId = this.jobId.find(elem => {
      return elem._id === value;
    });
    this.Users.forEach(opt => {
      opt.group = 'disabled';
    })
    this.dropdownService.getUser(jobId.departmentId, jobId.divisionId).subscribe(res => {
      if (res.code === ResponseCode.Success) {
        res.data.forEach(item => {
          this.Users.forEach(option => {
            if (option.value === item._id) {
              option.group = 'enable';
            }
          })
        })
        this.filteredList2 = this.Users.slice();
      }
    });
  }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.jr = response.data;
          if (response.data.exams) {
            let getExam = [];
            response.data.exams.map((element) => {
              getExam.push(element.refExam._id);
              this.examShow.push({
                name: element.refExam.name,
                _id: element.refExam._id
              });
            });
            this.jr.exams = getExam;
          }
          if (this.utilitiesService.dateIsValid(response.data.duration.startDate)) {
            this.jr.duration.startDate = new Date(response.data.duration.startDate);
          }
          if (this.utilitiesService.dateIsValid(response.data.duration.endDate)) {
            this.jr.duration.endDate = new Date(response.data.duration.endDate);
          }
          if (this.utilitiesService.dateIsValid(response.data.onboardDate)) {
            this.jr.onboardDate = new Date(response.data.onboardDate);
          }
          this.jr.userInterviews = this.jr.userInterviews.map(element => {
            return element.refUser._id;
          });
          if (this.jr.refStatus.name != 'Waiting for HR Confirm') {
            this.editExam = false;
          } else {
            this.editExam = true;
          }
          if (this.state != State.Create) {
            this.onChangeJobposition(this.jr.refJD._id);

          }
          if (this.state === State.Edit) {
            if (this.jr.refStatus.name === 'Active' || this.jr.refStatus.name === 'Inactive') {
              this.editCheck = true;
            }
          }
          if (this.state === 'duplicate') {
            if (this.jr.refStatus.name === 'Reject' || this.jr.refStatus.name === 'Inactive') {
              this.duplicateCheck = true;
            }
          }
          this.selectedCheck();
          this.loading = false;
        }
      }
    })
  }

  selectedCheck() {
    this.jr.refSource.map(element => {
      if (element.name === 'Email') {
        this.emailCheck = true;
      }
      if (element.name === 'JobsDB') {
        this.jobDB = true;
      }
    });
  }

  save() {
    if (this.validation()) {
      const request = this.setRequest();
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'C' }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          if (this.state === State.Create) {
            this.service.create(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/employer/jr/list']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          }
          else if (this.state === State.Edit) {
            this.service.edit(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/employer/jr/list']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          } else if (this.state === 'duplicate') {
            this.service.create(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/employer/jr/list']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          }
        }
      });
    }
  }

  validation(): boolean {
    let isValid = true;
    this.touched = false;
    this.touchedStart = false;
    this.touchedEnd = false;
    this.touchedOn = false;
    this.touchedCheck = false;
    this.touchedCap = false;
    this.touchedEva = false;
    this.jr.refSource = [];
    this.sErrorUser = '';
    this.sErrorEvaluation = '';
    if (this.emailCheck === true) {
      this.jr.refSource.push({
        name: 'Email',
      })
    }
    if (this.jobDB === true) {
      this.jr.refSource.push({
        name: 'jobsDB',
      })
    }
    if (this.jr.userInterviews.length === 0) {
      this.touchedCheck = true;
      this.sErrorUser = MESSAGE[155];
      this.sErrorCheck = MESSAGE[155];
      isValid = false;
    }
    if (this.jr.duration.startDate === null) {
      isValid = false;
      this.touchedStart = true;
      this.sErrorStart = MESSAGE[125];
      this.sErrorCheck = MESSAGE[125];
    }
    if (this.jr.duration.endDate === null) {
      isValid = false;
      this.touchedEnd = true;
      this.sErrorEnd = MESSAGE[126];
      this.sErrorCheck = MESSAGE[126];
    }
    if (this.jr.duration.startDate > this.jr.duration.endDate) {
      isValid = false;
      this.touchedCheck = true;
      this.sErrorCheck = MESSAGE[32];
    }
    var startD = new Date(this.jr.duration.startDate);
    var EndD = new Date(this.jr.duration.endDate);
    if (startD.getTime() == EndD.getTime()) {
      isValid = false;
      this.touchedCheck = true;
      this.sErrorCheck = MESSAGE[32];
    }
    if (this.jr.onboardDate === null) {
      isValid = false;
      this.touchedOn = true;
      this.sErrorOn = MESSAGE[142];
      this.sErrorCheck = MESSAGE[142];
    }
    if (this.jr.refJD._id === undefined || this.jr.refJD._id === null) {
      this.touched = true;
      this.sErrorPosition = MESSAGE[141];
      this.sErrorCheck = MESSAGE[141];
      isValid = false;
    }
    if (this.jr.capacity === null || this.jr.capacity === 0) {
      this.jr.capacity = 0;
      this.sErrorCap = MESSAGE[30];
      this.sErrorCheck = MESSAGE[30];
      this.touchedCap = true;
      isValid = false;
    }
    if (!this.jr.refEvaluation) {
      this.touchedEva = true;
      this.sErrorEvaluation = 'Please select evaluation template';
      isValid = false;
    }
    return isValid;
  }

  selectedEva() {
    if (this.jr.refEvaluation) {
      this.touchedEva = false;
    } else {
      this.touchedEva = true;
      this.sErrorEvaluation = 'Please select evaluation template';
    }
  }

  openPopupEvaluation(item: any) {
    setFlowId(item);
    // setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupEvaluationComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
    });
  }

  openSearch(dataList: any, nameField: string, field: any) {
    setAllListName(nameField);
    if (field === 'user') {
      let arr = [];
      arr.push({
        label: '',
        value: undefined,
        group: undefined
      })
      dataList.map((ele, index) => {
        if (ele.group === "enable") {
          arr.push({
            label: ele.label,
            value: ele.value,
            group: ele.group
          })
        }
      })
      dataList = arr;
    }
    setAllList(dataList);
    this.dialogService.open(PopupSearchDropdownComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      if (result.value) {
        switch (field) {
          case 'user':
            this.jr.userInterviews = result.value;
            break;
          case 'evaluation':
            this.jr.refEvaluation = result.value;
            break;
          default:
            break;
        }
      }
    })
  }

  callExam(dialog: TemplateRef<any>, option: any) {
    this.callDialog(dialog);
  }

  saveExam(result) {
    if (result) {
      this.tempExam = this.jr.exams;
    } else {
      this.jr.exams = this.tempExam;
    }
    this.dialogRef.close();
  }

  examLink(_id) {
    let path = '/employer/setting/exam-online/preview/' + _id
    this.router.navigate([path]);
    this.dialogRef.close();
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  }

  setRequest(): any {
    if (this.state === 'duplicate') {
      this.jr._id = undefined;
    }
    const request = _.cloneDeep(this.jr);
    return request;
  }

  back() {
    this.router.navigate(['/employer/jr/list']);
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
