import { Component, OnInit, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { JrService } from '../jr.service';
import { ResponseCode, Paging, State } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, DropDownGroup } from '../../../shared/interfaces/common.interface';
import { getRole } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
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
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { request } from 'https';
import { elementAt } from 'rxjs/operators';

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
  touched: boolean;
  duplicateCheck: boolean;
  editCheck: boolean;
  touchedStart: boolean;
  touchedEnd: boolean;
  touchedCheck: boolean;
  touchedCap: boolean;
  touchedOn: boolean;
  emailCheck: boolean;
  role: any;
  action: any;
  JobPosition: DropDownValue[];
  Evaluation: DropDownValue[];
  Users: DropDownGroup[];
  sErrorPosition: string;
  sErrorStart: string;
  sErrorEnd: string;
  sErrorOn: string;
  sErrorCheck: string;
  sErrorCap: string;
  sErrorUser: string;
  sErrorEvaluation: string;
  checkPreview: boolean;
  jobId: any;
  jobStatus: any;
  tempJob: any;
  loading: any;
  editExam: boolean;

  constructor(
    private service: JrService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    private dropdownService: DropdownService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.loading = true;
    this.initialModel();
    this.initialEvaluation();
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this._id = params.id;
        this.duplicateCheck = false;
        this.editCheck = false;
        this.emailCheck = true;
        this.jobDB = false;
        this.jobStatus = undefined;
        if (params.action === State.Edit) {
          this.state = State.Edit;
          this.initialStartDropDown().then((response) => {
            this.getDetailList();
          });
        }
        if (params.action === "duplicate") {
          this.state = "duplicate";
          this.initialStartDropDown().then((response) => {
            this.getDetailList();
          });
        }
        if (params.action === "preview") {
          this.state = "preview";
          this.checkPreview = true;
          this.initialStartDropDown().then((response) => {
            this.getDetailList();
          });
        }
      } else {
        this.state = State.Create;
        this.jr.requiredExam = false;
        this.emailCheck = true;
        this.jobDB = false;
        this.jr.capacity = 0;
        this.jobStatus = "notUsed";
        this.loading = false;
        this.editExam = true;
        this.checkPreview = false;
        this.initialStartDropDown();
      }
    });

  }

  initialEvaluation() {
    this.Evaluation = [];
    this.Evaluation.push({
      label: "- Select Evaluation -",
      value: undefined
    });
    this.service.getEvaluationList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          response.data.forEach(element => {
            this.Evaluation.push({
              label: element.name,
              value: element._id
            })
          });
        }
      }
    })
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
      refSource: undefined,
      remark: "",
      refStatus: undefined,
      refEvaluation: undefined,
      userInterviews: [],
    }
  }

  async initialStartDropDown() {
    await this.initialDropDown();
    await this.initialUser();
  }

  initialDropDown() {
    return new Promise((resolve) => {
      this.JobPosition = [];
      this.JobPosition.push({
        label: "- Select Job Position -",
        value: undefined
      });
      this.service.getJobPositionList(this.jobStatus).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            this.jobId = response.data;
            response.data.forEach(element => {
              this.JobPosition.push({
                label: element.position,
                value: element._id
              })
            });
          }
        }
        resolve();
      });
    });
  }

  initialUser() {
    return new Promise((resolve) => {
      this.Users = [];
      this.Users.push({
        label: "- Select Users Interview -",
        value: undefined,
        group: "disabled"
      });
      this.dropdownService.getUser().subscribe(res => {
        if (res.code === ResponseCode.Success) {
          res.data.forEach(item => {
            this.Users.push({
              label: this.utilitiesService.setFullname(item.refUser),
              value: item._id,
              group: "disabled"
            })
          })
        }
      })
      console.log(this.Users)
      resolve();
    });
  }

  onChangeJobposition(value) {
    const jobId = this.jobId.find(elem => {
      return elem._id === value;
    });
    this.Users.forEach(opt => {
      opt.group = "disabled";
    })
    this.dropdownService.getUser(jobId.departmentId, jobId.divisionId).subscribe(res => {
      if (res.code === ResponseCode.Success) {
        res.data.forEach(item => {
          this.Users.forEach(option => {
            if (option.value === item._id) {
              option.group = "enable";
            }
          })
        })
        console.log(this.Users)
      }
    });
  }

  getDetailList() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.jr = response.data;
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
            this.loading = false;
            this.onChangeJobposition(this.jr.refJD._id);
          }
          if (this.state === State.Edit) {
            if (this.jr.refStatus.name === "Active" || this.jr.refStatus.name === "Inactive") {
              this.editCheck = true;
            }
          }
          if (this.state === "duplicate") {
            if (this.jr.refStatus.name === "Reject" || this.jr.refStatus.name === "Inactive") {
              this.duplicateCheck = true;
            }
          }
          this.selectedCheck();
        }
      }
    })
  }

  selectedCheck() {
    this.jr.refSource.map(element => {
      if (element.name === "Email") {
        this.emailCheck = true;
      }
      if (element.name === "JobsDB") {
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
                this.router.navigate(['/jr/list']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          }
          else if (this.state === State.Edit) {
            this.service.edit(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/jr/list']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          } else if (this.state === "duplicate") {
            this.service.create(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/jr/list']);
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
    this.jr.refSource = [];
    this.sErrorUser = '';
    this.sErrorEvaluation = '';
    if (this.emailCheck === true) {
      this.jr.refSource.push({
        name: "Email",
      })
    }
    if (this.jobDB === true) {
      this.jr.refSource.push({
        name: "jobsDB",
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
      this.sErrorEvaluation = 'Please select evaluation template';
      isValid = false;
    }
    return isValid;
  }

  setRequest(): any {
    if (this.state === "duplicate") {
      this.jr._id = undefined;
    }
    const request = _.cloneDeep(this.jr);
    return request;
  }

  back() {
    this.router.navigate(['/jr/list']);
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
