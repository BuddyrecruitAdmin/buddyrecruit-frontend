import { Component, OnInit, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { JrService } from '../jr.service';
import { ResponseCode, Paging, State } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging } from '../../../shared/interfaces/common.interface';
import { getRole } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DropDownValue } from '../../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../../shared/services/utilities.service';
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
  modeSelect: boolean;
  role: any;
  action: any;
  JobPosition: DropDownValue[];
  sErrorPosition: string;
  sErrorStart: string;
  sErrorEnd: string;
  sErrorOn: string;
  sErrorCheck: string;
  sErrorCap: string;
  checkPreview: boolean;
  constructor(
    private service: JrService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.initialModel();
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this._id = params.id;
        this.modeSelect = false;
        this.duplicateCheck = false;
        this.editCheck = false;
        if (params.action === State.Edit) {
          this.state = State.Edit;
          this.emailCheck = false;
          this.jobDB = false;
          this.getDetailList();
        }
        if (params.action === "duplicate") {
          this.state = "duplicate";
          this.emailCheck = false;
          this.jobDB = false;
          this.getDetailList();
        }
        if (params.action === "preview") {
          this.checkPreview = true;
          this.emailCheck = false;
          this.jobDB = false;
          this.getDetailList();//preview
        }
      } else {
        this.state = State.Create;
        this.modeSelect = true;
        this.jr.requiredExam = false;
        this.emailCheck = false;
        this.jobDB = false;
        this.jr.capacity = 0;
        this.initialDropDown();
        // console.log(this.state);
        // this.jr.remark = "";
      }
    });

  }

  initialModel(): any {
    this.jr = {
      _id: undefined,
      refJD: undefined,
      capacity: undefined,
      duration: {
        startDate: null,
        endDate: null,
      },
      onboardDate: null,
      requiredExam: undefined,
      refSource: undefined,
      remark: "",
      refStatus: undefined
    }
  }

  initialDropDown() {
    this.JobPosition = [];
    this.JobPosition.push({
      label: "- Select Job Position -",
      value: undefined
    });
    this.service.getJopPositionList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          console.log(response.data);
          response.data.forEach(element => {
            this.JobPosition.push({
              label: element.position,
              value: element._id
            })
          });
        }
      }
    });
  }

  getDetailList() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          console.log(response.data);
          this.jr = response.data;
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
    console.log(this.jr.refSource);
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
      console.log(this.state)
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: '40%',
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
            console.log(request)
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
    if (this.jr.duration.startDate === null) {
      isValid = false;
      this.touchedStart = true;
      this.sErrorStart = MESSAGE[125];
    }
    if (this.jr.duration.endDate === null) {
      isValid = false;
      this.touchedEnd = true;
      this.sErrorEnd = MESSAGE[126];
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
    }
    if (this.jr.refJD === undefined || this.jr.refJD === null) {
      this.touched = true;
      this.sErrorPosition = MESSAGE[141];
      isValid = false;
    }
    if (this.jr.capacity === null || this.jr.capacity === 0) {
      this.jr.capacity = 0;
      this.sErrorCap = MESSAGE[30];
      this.touchedCap = true;
      isValid = false;
    }

    return isValid;
  }

  setRequest(): any {
    if (this.state === "duplicate") {
      this.jr._id = undefined;
    }
    const request = _.cloneDeep(this.jr);
    console.log(request);

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
