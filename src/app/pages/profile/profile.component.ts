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
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { API_ENDPOINT } from '../../shared/constants';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
const URL = environment.API_URI + "/" + API_ENDPOINT.CONFIGURATION.USER_PROFILE_UPLOAD;
@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  role: any;
  url: any;
  file: any;
  res: string;
  bHasFile: boolean;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'profile' });
  loginForm: FormGroup;
  sErrorPassword: string;
  sErrorPasswordCur: string;
  sErrorPasswordCon: string;
  sErrorFirstName: string;
  sErrorLastName: string;
  sErrorPasswordNew: string;
  sErrorEmail: string;
  fileToUpload: File = null;
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
  alertType: string;
  alertMessage: string;
  private _alertMessage = new Subject<string>();
  constructor(
    private service: ProfileService,
    private formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
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
      attachment: {
        originalname: undefined,
        uploadName: undefined,
      },
    };
    this.service.getProfile(this.role.refHero._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.profileDetail = response.data;
        this.url = response.data.imagePath;
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
      image: [null, Validators.required],
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
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.bHasFile = false;
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
    if (this.bHasFile) {
      console.log(this.profileDetail)
      this.uploader.uploadItem(
        this.uploader.queue[this.uploader.queue.length - 1]
      );
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        console.log("ImageUpload:uploaded:", item, status);
        
    };
    }
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

  onFileInput(files: FileList) {
    if (files && files[0]) {
      var reader = new FileReader();
      if (files[0] != undefined || files[0] != null) {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.url = reader.result;
        } 
      }
      reader.readAsDataURL(files[0]); // read file as data url
    }
    const FileSize = files.item(0).size / 1024 / 1024; // in MB
    if (FileSize > 10) {
      this.setAlertMessage("E", MESSAGE[121]);
      this.bHasFile = false;
      this.profileDetail.attachment.originalname = "";
      this.profileDetail.attachment.uploadName = "";
      this.fileToUpload = null;
      return;
    } else {
      this.bHasFile = true;
      this.profileDetail.attachment.originalname = files.item(0).name;
      this.profileDetail.attachment.uploadName = "";
      this.fileToUpload = files.item(0);
      this.alertMessage = null;
    }
  }

  setAlertMessage(type: string, message: string) {
    this._alertMessage.next(message); // build message
    switch (type) {
      case "S": {
        this.alertType = "success";
        break;
      }
      case "E": {
        this.alertType = "danger";
        break;
      }
      case "W": {
        this.alertType = "warning";
        break;
      }
      case "I": {
        this.alertType = "info";
        break;
      }
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
