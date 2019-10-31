import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { ProfileService } from './profile.service';
import { ResponseCode } from '../../shared/app.constants';
import { getRole } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { MESSAGE } from "../../shared/constants/message";
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FileSelectDirective, FileDropDirective, FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload/ng2-file-upload';
import { API_ENDPOINT } from '../../shared/constants';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Location } from '@angular/common';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
const URL = environment.API_URI + "/" + API_ENDPOINT.CONFIGURATION.USER_PROFILE_UPLOAD;

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  // @ViewChild(ImageCropperComponent, { static: true }) imageCropper: ImageCropperComponent;
  role: any;
  loading: boolean;
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
  imageChangedEvent: any = '';
  croppedImage: any = '';
  innerHeight: any;
  previewPicture: boolean;
  constructor(
    private service: ProfileService,
    private formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private location: Location,
    private utilitiesService: UtilitiesService,
  ) {
    this.role = getRole();
    this.innerHeight = window.innerHeight;
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
      imageData: undefined,
      attachment: {
        originalname: undefined,
        uploadName: undefined,
      },
    };
    this.service.getProfile(this.role.refHero._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.profileDetail = response.data;
        if (response.data.imageData) {
          this.url = response.data.imageData;
        }
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
    if (this.firstName.status === "INVALID") {
      isValid = false;
    }
    if (this.lastName.status === "INVALID") {
      isValid = false;
    }
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

  cancel() {
    this.location.back();
  }

  save() {
    if (this.croppedImage) {
      this.profileDetail.imageData = this.croppedImage;
    }
    if (this.validation()) {
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'C' }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          const request = this.setRequest();
          this.service.edit(request).subscribe(response => {
            if (response.code === ResponseCode.Success) {
              this.showToast('success', 'Success Message', response.message);
              location.reload();
            } else {
              this.showToast('danger', 'Error Message', response.message);
            }
          });
        }
      });
    }
  }

  setRequest(): any {
    if (this.url) {
      this.profileDetail.imageData = this.url;
    }
    const request = _.cloneDeep(this.profileDetail);
    return request;
  }

  togglePassword() {
    this.isChangePassword = !this.isChangePassword;
  }

  fileChangeEvent(event: any, dialog: TemplateRef<any>, files: FileList): void {
    this.previewPicture = false;
    const FileSize = files.item(0).size / 1024 / 1024; // in MB
    this.imageChangedEvent = event;
    if (FileSize > 10) {
      this.showToast('danger', 'Error Message', 'file size more than 10 mb');
    } else {
      this.loading = true;
      this.callDialog(dialog);
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    this.loading = false;
    this.previewPicture = true;
    // cropper ready
  }
  loadImageFailed() {
    this.showToast('danger', 'Error Message', "can't load image");
    // show message
  }

  saveNewImage() {
    this.url = this.croppedImage;
    this.dialogRef.close();
  }

  // rotateLeft() {
  //   this.imageCropper.rotateLeft();
  // }
  // rotateRight() {
  //   this.imageCropper.rotateRight();
  // }

  close() {
    this.croppedImage = "";
    this.fileInput.nativeElement.value = "";
    this.dialogRef.close()
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
    this.dialogRef.onClose.subscribe(reuslt =>
      this.fileInput.nativeElement.value = ""
    )
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
