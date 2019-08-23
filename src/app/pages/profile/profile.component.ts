import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProfileService } from './profile.service';
import { ResponseCode, Paging } from '../../shared/app.constants';
import { Criteria, Paging as IPaging } from '../../shared/interfaces/common.interface';
import { getRole } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { MESSAGE } from "../../shared/constants/message";
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  role: any;
  loginForm: FormGroup;
  sErrorPassword: string;
  sErrorPasswordCur: string;
  sErrorPasswordCon: string;
  sErrorFirstName: string;
  sErrorLastName: string;
  sErrorPasswordNew: string;
  sErrorEmail: string;
  isChangePassword = false;
  touched: boolean;
  firstName: AbstractControl;
  lastName: AbstractControl;
  password: AbstractControl;
  passwordCur: AbstractControl;
  passwordNew: AbstractControl;
  passwordCon: AbstractControl;
  email: AbstractControl;
  dialogRef: NbDialogRef<any>;
  profileDetail: any;
  constructor(
    private service: ProfileService,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    console.log(this.role)
    this.profileDetail = {
      _id: undefined,
      firstname: undefined,
      lastname: undefined,
      notifyEmail: undefined,
      passwordCur: undefined,
      passwordNew: undefined,
      passwordCon: undefined,
      onBoard: undefined,
      pendApp: undefined,
      pendExam: undefined,
      pendIn: undefined,
      pendSign: undefined,
      talentPool: undefined,
    };
    this.service.getProfile(this.role.refHero._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.profileDetail = response.data;
        console.log(this.profileDetail)
      }
    });
    this.loginForm = this.formBuilder.group({
      firstname: [null, [Validators.required]],
      lastname: [null, Validators.required],
      passwordcur: [null, [Validators.required, Validators.minLength(6)]],
      passwordnew: [null, [Validators.required, Validators.minLength(6)]],
      passwordcon: [null, [Validators.required, Validators.minLength(6)]],
      email: [null, [Validators.required, Validators.email]],
    });
    this.firstName = this.loginForm.controls["firstname"];
    this.lastName = this.loginForm.controls["lastname"];
    this.passwordCur = this.loginForm.controls["passwordcur"];
    this.passwordNew = this.loginForm.controls["passwordnew"];
    this.passwordCon = this.loginForm.controls["passwordcon"];
    this.email = this.loginForm.controls["email"];
    this.sErrorPassword = MESSAGE[50];
    this.sErrorFirstName = MESSAGE[97];
    this.sErrorLastName = MESSAGE[98];
  }
  validation(): boolean {
    this.touched = true;
    let isValid = true;
    if (this.email.value === null || this.email.value === "") {
      this.sErrorEmail = MESSAGE[8];
      isValid = false;
    }
    if (!this.email.valid) {
      this.sErrorEmail = MESSAGE[9];
      isValid = false;
    }
    if (this.isChangePassword) {
      if (!this.passwordCur.valid) {
        this.sErrorPasswordCur = MESSAGE[59];
        isValid = false;
      }
      if (!this.passwordNew.valid) {
        this.sErrorPasswordNew = MESSAGE[59];
        isValid = false;
      }
      if (!this.passwordCon.valid) {
        this.sErrorPasswordCon = MESSAGE[59];
        isValid = false;
      } else if (this.passwordCon.value == this.passwordNew.value) {
        isValid = true;
      } else {
        this.sErrorPasswordCon = MESSAGE[94];
        isValid = false;
      }

    }
    return isValid;

  }
  save() {
    console.log(this.profileDetail.setting.notification.talentPool.mail)
    if (this.validation()) {
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: '40%',
        data: { type: 'C' }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          const request = this.setRequest();
          console.log(request)
          this.service.edit(request).subscribe(response => {
            if (response.code === ResponseCode.Success) {
              this.showToast('success', 'Success Message', response.message);
            } else {
              this.showToast('danger', 'Error Message', response.message);
            }
          });
        }
      });
    }
  }
  setRequest(): any {
    const request = _.cloneDeep(this.profileDetail);
    return request;
  }
  togglePassword() {
    this.isChangePassword = !this.isChangePassword;
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
