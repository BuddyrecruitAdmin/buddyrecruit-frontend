import { Component, OnInit } from '@angular/core';
import { ChangePasswordService } from './change-password.service';
import { ResponseCode } from '../../../shared/app.constants';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import * as _ from 'lodash';
import 'style-loader!angular2-toaster/toaster.css';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MESSAGE } from "../../../shared/constants/message";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  _id: string;
  paawordForm: FormGroup;
  newPassword: AbstractControl;
  confirmPassword: AbstractControl;
  sErrorPassword: string;
  touched: boolean;
  changeText: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private service: ChangePasswordService,
    private toastrService: NbToastrService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this._id = params.id;
      }
    })
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
    if (value.newpassword === value.confirmpassword) {
      this.service.submitPassword(this._id, value.newpassword).subscribe(response => {
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
