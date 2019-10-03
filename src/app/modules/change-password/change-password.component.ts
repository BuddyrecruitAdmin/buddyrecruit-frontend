import { Component, OnInit } from '@angular/core';
import { ChangePasswordService } from './change-password.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { resolve } from 'dns';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { utimes } from 'fs';
import { MatDialog } from '@angular/material';
import { TranslateService } from '../../translate.service';
import * as _ from 'lodash';
import 'style-loader!angular2-toaster/toaster.css';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MESSAGE } from "../../shared/constants/message";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  paawordForm: FormGroup;
  newPassword: AbstractControl;
  confirmPassword: AbstractControl;
  sErrorPassword: string;
  touched: boolean;
  changeText: boolean;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private service: ChangePasswordService,
    private toastrService: NbToastrService
  ) { }

  ngOnInit() {
    this.changeText = false;
    this.paawordForm = this.formBuilder.group({
      newpassword: [null, [Validators.required, Validators.minLength(6)]],
      confirmpassword: [null, [Validators.required, Validators.minLength(6)]],
    });
    this.newPassword = this.paawordForm.controls["newpassword"];
    this.confirmPassword = this.paawordForm.controls["confirmpassword"];
    this.sErrorPassword = MESSAGE[50];
  }

  changePass(value) {
    this.touched = true;
    console.log(value.newpassword, value.confirmpassword)
    if (value.newpassword === value.confirmpassword) {
      this.service.submitPassword(value.newpassword).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.changeText = true;
        }
      })
    } else {
      this.sErrorPassword = "Password doesn't match";
    }

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
