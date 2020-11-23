import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JrService } from '../jr.service';
import { ResponseCode, State } from '../../../shared/app.constants';
import { Paging as DropDownGroup } from '../../../shared/interfaces/common.interface';
import { getRole, setBranchItem } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DropDownValue } from '../../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { DropdownService } from '../../../shared/services/dropdown.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  innerWidth: any;
  innerHeight: any;
  isExpress = false;
  isHybrid = false;
  formGroup: FormGroup;
  priorityId:any;
  constructor(
    private service: JrService,
    private utilitiesService: UtilitiesService,
    private dropdownService: DropdownService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.role = getRole();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.6;
    this.isHybrid = this.role.refCompany.isHybrid || false;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.loading = true;
    this.initialModel();
    this.initialForm();
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
          this.formGroup.disable();
        }
        this.getDetail();
        // this.initialDropDown().then((response) => {
        // });
      } else {
        this.state = State.Create;
        this.jr.requiredExam = false;
        this.jr.requiredAttitude = false;
        this.jr.capacity = 0;
        this.jobStatus = 'notUsed';
        this.loading = false;
        this.editExam = true;
        // this.initialDropDown();
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
      publicJobName: {
        th: '',
        en: ''
      }
    }
  }

  initialForm() {
    this.formGroup = this.formBuilder.group({
      nameEN: [{ value: '', disabled: false }, [Validators.required]],
      nameTH: [{ value: '', disabled: false }, [Validators.required]],
      // nameEN: [{ value: '', disabled: false }, [Validators.pattern('^[a-zA-Z0-9- ]*$')]],
      // nameTH: [{ value: '', disabled: false }, [Validators.pattern('^[ก-ํ0-9- ]*$')]],
    });
  }

  get f() { return this.formGroup.controls; }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.jr = response.data;
          if (!this.jr.refJD.publicJobName) {
            this.jr.refJD.publicJobName = {
              th: '',
              en: ''
            }
          }
          this.jr.numberOpen = this.jr.surplusnumber + ' / ' + this.jr.demandNumber;
          if (this.utilitiesService.dateIsValid(response.data.duration.startDate)) {
            this.jr.duration.startDate = new Date(response.data.duration.startDate);
          } else {
            this.jr.duration.startDate = null;
          }
          if (this.utilitiesService.dateIsValid(response.data.duration.endDate)) {
            this.jr.duration.endDate = new Date(response.data.duration.endDate);
          } else {
            this.jr.duration.endDate = null;
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
          this.priorityId = "P" + this.jr.priority_id;
          this.loading = false;
        }
      }
    })
  }

  gotoBranch(location) {
    setBranchItem(location);
    this.router.navigate(['/employer/setting/location']);
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
    if (this.formGroup.status === "INVALID") {
      isValid = false;
    }
    return isValid
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
