import { Component, OnInit } from '@angular/core';
import { ForgotService } from './forgot.service';
import { ResponseCode } from '../../../shared/app.constants';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../../shared/interfaces/common.interface';
import { resolve } from 'dns';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { utimes } from 'fs';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import 'style-loader!angular2-toaster/toaster.css';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MESSAGE } from '../../../shared/constants/message';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ngx-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  emailForm: FormGroup;
  email: AbstractControl;
  sErrorEmail: string;
  touched: boolean;
  changeText: boolean;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private forgotService: ForgotService,
    private toastrService: NbToastrService
  ) { }

  ngOnInit() {
    this.changeText = false;
    this.emailForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
    this.email = this.emailForm.controls['email'];
    this.sErrorEmail = MESSAGE[9];
  }

  forgot(value) {
    this.touched = true;
    // console.log(this.emailForm.valid);
    if (this.emailForm.valid) {
      this.forgotService.submitEmail(value.email).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.changeText = true;
        }
      })
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
