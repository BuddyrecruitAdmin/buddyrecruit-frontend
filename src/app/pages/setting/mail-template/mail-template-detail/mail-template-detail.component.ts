import { Component, OnInit } from '@angular/core';
import { MailTemplateService } from '../mail-template.service';
import { ResponseCode, State } from '../../../../shared/app.constants';
import { Router, ActivatedRoute } from "@angular/router";
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MESSAGE } from '../../../../shared/constants/message';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AbstractControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'ngx-mail-template-detail',
  templateUrl: './mail-template-detail.component.html',
  styleUrls: ['./mail-template-detail.component.scss']
})
export class MailTemplateDetailComponent implements OnInit {
  name: AbstractControl;
  _id: string;
  state: string;
  getId: boolean;
  bcc: AbstractControl;
  cc: AbstractControl;
  itemDialog: any;
  sErrorHeader: string;
  sErrorSubject: string;
  sErrorEmailType: string;
  sErrorBcc: string;
  sErrorcc: string;
  touched: boolean;
  checkEdit: boolean;
  str: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    sanitize: false,
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  }
  constructor(
    private service: MailTemplateService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.itemDialog = {
      _id: undefined,
      name: undefined,
      subject: undefined,
      remark: undefined,
      cc: [],
      bcc: [],
      html: undefined,
      type: undefined,
      refAction: {
        _id: undefined
      },
    }
    this.itemDialog.type = "true";
    this.checkEdit = false;
    this.getId = true;
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.state = State.Edit;
        this._id = params.id;
        this.getId = false;
        this.getDetail();
      }
    });
  }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.itemDialog = response.data
          if (this.itemDialog.type === "I") {
            this.itemDialog.type = "true"
          } else {
            this.itemDialog.type = "false"
          }
          this.checkEdit = true;
        }
      }
    });
  }

  back() {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: MESSAGE[31] }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/employer/setting/mail-template']);
      }
    });
  }

  getType() {
    this._id = this.itemDialog.refAction._id;
    this.service.getDetailEmail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.itemDialog.html = response.data.html
        }
      }
    });
    if (!this._id) {
      this.itemDialog.html = "";
    }
  }

  validation(): boolean {
    this.touched = true;
    let isValid = true;
    this.sErrorcc = "";
    this.sErrorBcc = "";
    if (this.itemDialog.cc.length > 0) {
      this.itemDialog.cc.map(cc => {
        if (cc.value) {
          if (!this.utilitiesService.isValidEmail(cc.value)) {
            this.sErrorcc = MESSAGE[9];
            isValid = false
          } else {
            this.sErrorcc = "";
          }
        }
      })
    }
    if (this.itemDialog.bcc.length > 0) {
      this.itemDialog.bcc.map(bcc => {
        if (bcc.value) {
          if (!this.utilitiesService.isValidEmail(bcc.value)) {
            this.sErrorBcc = MESSAGE[9];
            isValid = false
          } else {
            this.sErrorBcc = "";
          }
        }
      })
    }
    if (this.itemDialog.name === undefined || this.itemDialog.name === "") {
      this.sErrorHeader = MESSAGE[4];
      isValid = false;
    } else {
      this.sErrorHeader = "";
    }
    if (this.itemDialog.subject === undefined || this.itemDialog.subject === "") {
      this.sErrorSubject = MESSAGE[4];
      isValid = false;
    } else {
      this.sErrorSubject = "";
    }
    if (!this.itemDialog.refAction._id) {
      this.sErrorEmailType = MESSAGE[136];
      isValid = false;
    } else {
      this.sErrorEmailType = "";
    }
    return isValid;

  }

  save() {
    if (this.validation()) {
      const request = this.setRequest();
      if (this.state === State.Create) {
        const confirm = this.matDialog.open(PopupMessageComponent, {
          width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
          data: { type: 'C' }
        });
        confirm.afterClosed().subscribe(result => {
          if (result) {
            this.service.create(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/employer/setting/mail-template']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          }
        });

      } else if (this.state === State.Edit) {
        const confirm = this.matDialog.open(PopupMessageComponent, {
          width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
          data: { type: 'C' }
        });
        confirm.afterClosed().subscribe(result => {
          if (result) {
            this.service.edit(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/employer/setting/mail-template']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          }
        });
      }
    }
  }
  setRequest(): any {
    if (this.itemDialog.cc) {
      this.itemDialog.cc = this.itemDialog.cc.map(gobj => {  //array.object to array
        if (gobj.value) {
          gobj = gobj.value;
          return gobj;
        }
        return gobj;
      })
    }
    if (this.itemDialog.bcc) {
      this.itemDialog.bcc = this.itemDialog.bcc.map(gobj => {  //array.object to array
        if (gobj.value) {
          gobj = gobj.value;
          return gobj;
        }
        return gobj;
      })
    }
    const request = _.cloneDeep(this.itemDialog);

    return request;
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
