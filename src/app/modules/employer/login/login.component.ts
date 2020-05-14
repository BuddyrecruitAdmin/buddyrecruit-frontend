import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MESSAGE } from '../../../shared/constants/message';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LoginService } from './login.service';
import { ResponseCode } from '../../../shared/app.constants';
import { getToken, setAuthentication, getUrl, setUrl, setCompanyName, setFlagConsent } from '../../../shared/services/auth.service';
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
  NbDialogService,
  NbDialogRef
} from '@nebular/theme';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { PopupConsentComponent } from '../../../component/popup-consent/popup-consent.component';
import { UtilitiesService } from '../../../shared/services/utilities.service';
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  innerHeight: any;
  token: any;
  loginForm: FormGroup;

  userName: AbstractControl;
  password: AbstractControl;
  sErrorUserName: string;
  sErrorPassword: string;
  sForgotPassword: string;
  touched: boolean;
  loginError: string;
  user: any;
  config: ToasterConfig;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = 'primary';
  loading: boolean;
  dialogRef: NbDialogRef<any>;
  innerWidth: any;
  checked: boolean;
  userTemp: any = {
    username: undefined,
    password: undefined
  };
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
  ) {
    this.innerHeight = window.innerHeight;
    this.token = getToken();
    if (this.token) {
      this.router.navigate(['/employer/home']);
    }
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
  }

  ngOnInit() {
    this.user = [];
    this.checked = false;
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
    this.userName = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
    this.sErrorUserName = MESSAGE[51];
    this.sErrorPassword = MESSAGE[50];
    this.sForgotPassword = MESSAGE[52];
    this.loginError = '';
    this.loading = false;
  }

  login(value) {
    this.loading = true;
    this.touched = true;
    this.loginError = '';
    this.loginService.login(value.username, value.password).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data.status === "PENDING") {
          this.user = response.data
          this.userTemp.username = value.username;
          this.userTemp.password = value.password;
          this.openConsent(this.user);
        } else {
          setAuthentication({ token: response.data.token, role: response.data } as any);
          this.showToast('success', response.data.message || 'Login Success', '');
          const url = getUrl();
          if (url && url !== '/employer/login') {
            setUrl('');
            this.router.navigate([url]);
          } else {
            switch (true) {
              case response.data.refHero.isSuperAdmin:
                this.router.navigate(['/employer/setting/company']);
                break;
              case response.data.refHero.isAdmin:
                this.router.navigate(['/employer/setting/company']);
                break;
              case response.data.refHero.isHR:
                this.router.navigate(['/employer/home']);
                break;
              case response.data.refHero.isManager:
                this.router.navigate(['/employer/home']);
                break;
              case response.data.refHero.isPayroll:
                this.router.navigate(['/employer/home']);
                break;
              default:
                this.router.navigate(['/employer/home']);
                break;
            }
          }
        }
      }
      else {
        this.loginError = response.message;
        this.showToast('danger', '', response.message || 'Login Fail');
        this.loading = false;
      }
    });
  }

  // sendStatus(status) {
  //   this.dialogRef.close();
  //   this.loginService.consent(this.user._id, status).subscribe(response => {
  //     if (response.code === ResponseCode.Success) {
  //       this.login(this.userTemp, undefined);
  //     }
  //   })
  // }

  // open(dialog: TemplateRef<any>) {
  //   this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  // }

  openConsent(user: any) {
    setCompanyName(user.refCompany);
    setFlagConsent(this.checked)
    this.dialogService.open(PopupConsentComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      this.loginService.consent(this.user._id, result).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.login(this.userTemp);
        }
      })
    });
  }

  toggle(checked: boolean) {
    this.checked = checked;
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
