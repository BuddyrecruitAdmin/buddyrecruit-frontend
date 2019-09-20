import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MESSAGE } from "../../shared/constants/message";
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LoginService } from './login.service';
import { ResponseCode } from '../../shared/app.constants';
import { getToken, setAuthentication, getUrl, setUrl } from '../../shared/services/auth.service';
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
} from '@nebular/theme';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  userName: AbstractControl;
  password: AbstractControl;
  sErrorUserName: string;
  sErrorPassword: string;
  sForgotPassword: string;
  touched: boolean;

  config: ToasterConfig;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = 'primary';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private toastrService: NbToastrService
  ) {
    if (getToken()) {
      this.router.navigate(["/home"]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
    this.userName = this.loginForm.controls["username"];
    this.password = this.loginForm.controls["password"];
    this.sErrorUserName = MESSAGE[51];
    this.sErrorPassword = MESSAGE[50];
    this.sForgotPassword = MESSAGE[52];
  }

  login(value) {
    this.touched = true;
    console.log(this.loginForm)
    this.loginService.login(value.username, value.password).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        setAuthentication({ token: response.data.token, role: response.data } as any);
        this.showToast('success', '', response.data.message || 'Login Success');
        const url = getUrl();
        if (url) {
          setUrl('');
          this.router.navigate([url]);
        } else {
          switch (true) {
            case response.data.refHero.isSuperAdmin:
              this.router.navigate(['/setting/company']);
              break;
            case response.data.refHero.isAdmin:
              this.router.navigate(['/setting/company']);
              break;
            case response.data.refHero.isHR:
              this.router.navigate(['/home']);
              break;
            case response.data.refHero.isManager:
              this.router.navigate(['/home']);
              break;
            case response.data.refHero.isPayroll:
              this.router.navigate(['/home']);
              break;
            default:
              this.router.navigate(['/home']);
              break;
          }
        }
      } else {
        this.showToast('danger', '', response.data.message || 'Login Fail');
      }
    });
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    this.toastrService.show(body, title, config);
  }

}
