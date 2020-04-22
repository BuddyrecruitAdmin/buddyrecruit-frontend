import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '../../translate.service';
import { setLangPath, getAppFormData, getRole } from '../../shared/services';
import { IApplicationForm, IAttachment } from './application-form.interface';
import { DropDownValue } from '../../shared/interfaces';
import { ApplicationFormService } from './application-form.service';
import { JdService } from '../../pages/jd/jd.service';
import { NbToastrService, NbComponentStatus, NbGlobalPhysicalPosition } from '@nebular/theme';
import { ResponseCode, InputType, State } from '../../shared/app.constants';
import { IAppFormTemplate } from '../../pages/setting/app-form/app-form.interface';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { MatDialog } from '@angular/material';
import { UtilitiesService } from '../../shared/services/utilities.service';

@Component({
  selector: 'ngx-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {
  InputType = InputType;
  language: string;
  template: IAppFormTemplate;
  role: any;

  appForm: IApplicationForm;

  degreesEN: DropDownValue[];
  degreesTH: DropDownValue[];
  jrs: DropDownValue[];

  selectedItem = '2';

  hardSkill = {
    keyword: '',
    required: false,
    duplication: false,
  };
  softSkill = {
    keyword: '',
    required: false,
    duplication: false,
  };
  certificate = {
    keyword: '',
    required: false,
    duplication: false,
  };

  loading = true;
  submitted = false;
  isPreview = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private service: ApplicationFormService,
    private jdService: JdService,
    private toastrService: NbToastrService,
    public matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
  ) {
    this.role = getRole();
    setLangPath("RESUME");
    this.language = 'en';
    this.setLang(this.language);
  }

  ngOnInit() {
    this.getDegrees();
    this.initialModel();

    this.activatedRoute.params.subscribe(params => {
      const action = params.action;
      const templateId = params.templateId;

      if (action) {
        if (action === State.Preview) {
          if (templateId) {
            this.getTemplate(templateId);
          } else {
            this.template = getAppFormData();
            if (this.template) {
              this.appForm.refCompany = this.template.refCompany;
              this.appForm.refTemplate = this.template._id;
              this.appForm.questions = this.template.questions;
              this.getJR(this.role && this.role.refCompany ? this.role.refCompany : undefined);
            } else {
              this.onError();
            }
          }
          this.isPreview = true;
        } else if (action === State.Submit) {
          if (templateId) {
            this.getTemplate(templateId);
          } else {
            this.onError();
          }
        } else {
          this.onError();
        }
      } else {
        this.onError();
      }
    });
  }

  setLang(lang) {
    this.language = lang;
    this.translate.use(lang);
  }

  getJR(refCompany: string) {
    this.jrs = [];
    this.service.getJR(refCompany).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          response.data.forEach(element => {
            if (element._id && element.refJD && element.refJD.position) {
              this.jrs.push({
                label: element.refJD.position,
                value: element._id
              });
            }
          });
        }
      }
      this.loading = false;
    });
  }

  getDegrees() {
    this.degreesEN = [];
    this.degreesTH = [];
    this.jdService.getEducationList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          response.data.forEach(element => {
            this.degreesEN.push({
              label: element.name,
              value: element._id
            });
            this.degreesTH.push({
              label: element.nameTH || element.name,
              value: element._id
            });
          });
        }
      }
    });
  }

  initialModel() {
    this.appForm = {
      refCompany: undefined,
      refTemplate: undefined,
      refJR: undefined,
      otherJob: '',
      firstname: '',
      lastname: '',
      birth: null,
      age: null,
      phone: '',
      email: '',
      address: '',
      addressNo: '',
      road: '',
      district: '',
      province: '',
      postcode: '',
      gender: '',
      expectedSalary: '',
      workExperience: {
        totalExpMonth: 0,
        work: []
      },
      education: [],
      hardSkill: [],
      softSkill: [],
      certificate: [],
      attachment: this.initialAttahment(),
      questions: []
    };
  }

  initialAttahment(): IAttachment {
    return {
      src: '',
      name: '',
      type: '',
      size: 0,
    };
  }

  getTemplate(templateId: string) {
    this.service.getTemplate(templateId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.template = response.data;
          this.appForm.refCompany = this.template.refCompany;
          this.appForm.refTemplate = this.template._id;
          this.appForm.questions = this.template.questions;
        }
        this.getJR(this.template.refCompany);
      } else {
        this.onError();
      }
    });
  }

  onChangeBirthday(value: any) {
    const birthDay = new Date(value);
    const ageDifMs = Date.now() - birthDay.getTime();
    const ageDate = new Date(ageDifMs);
    this.appForm.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  addWorkExperience() {
    this.appForm.workExperience.work.push({
      position: '',
      company: '',
      start: null,
      end: null,
      isPresent: false,
      duty: '',
      expMonth: 0,
      deletion: false
    });
  }

  removeWorkExperience(index: number) {
    if (index >= 0) {
      this.appForm.workExperience.work.splice(index, 1);
    }
  }

  addEducation() {
    this.appForm.education.push({
      refDegree: undefined,
      gpa: '',
      university: '',
      major: '',
      deletion: false
    });
  }

  removeEducation(index: number) {
    if (index >= 0) {
      this.appForm.education.splice(index, 1);
    }
  }

  addHardSkill() {
    this.hardSkill.required = false;
    this.hardSkill.duplication = false;

    if (this.hardSkill.keyword) {
      if (this.appForm.hardSkill.indexOf(this.hardSkill.keyword) === -1) {
        this.appForm.hardSkill.push(this.hardSkill.keyword);
        this.hardSkill.keyword = '';
      } else {
        this.hardSkill.duplication = true;
      }
    } else {
      this.hardSkill.required = true;
    }
  }

  removeHardSkill(index: number) {
    this.appForm.hardSkill.splice(index, 1);
  }

  addSoftSkill() {
    this.softSkill.required = false;
    this.softSkill.duplication = false;

    if (this.softSkill.keyword) {
      if (this.appForm.softSkill.indexOf(this.softSkill.keyword) === -1) {
        this.appForm.softSkill.push(this.softSkill.keyword);
        this.softSkill.keyword = '';
      } else {
        this.softSkill.duplication = true;
      }
    } else {
      this.softSkill.required = true;
    }
  }

  removeSoftSkill(index: number) {
    this.appForm.softSkill.splice(index, 1);
  }

  addCertificate() {
    this.certificate.required = false;
    this.certificate.duplication = false;

    if (this.certificate.keyword) {
      if (this.appForm.certificate.indexOf(this.certificate.keyword) === -1) {
        this.appForm.certificate.push(this.certificate.keyword);
        this.certificate.keyword = '';
      } else {
        this.certificate.duplication = true;
      }
    } else {
      this.certificate.required = true;
    }
  }

  removeCertificate(index: number) {
    this.appForm.certificate.splice(index, 1);
  }

  onError() {
    let message = 'Something went wrong. Please try again.';
    if (this.language === 'th') {
      message = 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่ (หน้าต่างจะปิดตัวลง)';
    }
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'I', content: message }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        window.close();
      }
    });
  }

  closeWindow() {
    let message = 'Are you sure you want to close this window?';
    if (this.language === 'th') {
      message = 'คุณต้องการจะปิดหน้าต่างนี้หรือไม่ ?';
    }
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: message }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        window.close();
      }
    });
  }

  save() {
    if (this.validation()) {
      let content;
      if (this.language === 'th') {
        content = 'คุณต้องการทำต่อหรือไม่ ?';
      }
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'C', content: content }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          const request = this.setRequest();
          this.service.create(request).subscribe(response => {
            if (response.code === ResponseCode.Success) {
              this.submitted = true;
            } else {
              this.showToast('danger', response.message || 'Error!', '');
            }
            this.loading = false;
          });
        }
      });
    }
  }

  getQuestionElementError(): any {
    let isQuestionValid = true;
    let qElement: any;

    this.appForm.questions.forEach((question, index) => {

      const element = document.getElementById('question' + index);
      element.classList.remove("has-error");

      if (question.required) {
        switch (question.type) {
          case this.InputType.Input:
            if (!question.answer.input) {
              isQuestionValid = false;
              element.classList.add("has-error");
            }
            break;
          case this.InputType.TextArea:
            if (!question.answer.textArea) {
              isQuestionValid = false;
              element.classList.add("has-error");
            }
            break;
          case this.InputType.Radio:
            if (!question.answer.selected) {
              isQuestionValid = false;
              element.classList.add("has-error");
            }
            break;
          case this.InputType.ChcekBox:
            const found = question.answer.options.find(element => {
              return element.checked;
            });
            if (!found && !question.answer.otherChecked) {
              isQuestionValid = false;
              element.classList.add("has-error");
            }
            break;
          case this.InputType.Dropdown:
            if (!question.answer.selected) {
              isQuestionValid = false;
              element.classList.add("has-error");
            }
            break;
        }

        if (!isQuestionValid && !qElement) {
          qElement = element;
        }
      }
    });

    return qElement;
  }

  validation(): boolean {
    let isValid = true;

    const elements = document.getElementsByClassName('mat-input-element ng-invalid');
    if (elements.length > 0) {
      isValid = false;
      const id = elements.item(0).getAttribute('id');
      if (id) {
        document.getElementById(id).focus();
      }
    }

    const qElement = this.getQuestionElementError();
    if (isValid && qElement) {
      isValid = false;
      qElement.scrollIntoView();
    }

    return isValid;
  }

  setRequest(): IApplicationForm {
    const request = JSON.parse(JSON.stringify(this.appForm));
    request.birth = new Date(request.birth);
    if (request.workExperience.work && request.workExperience.work.length) {
      request.workExperience.work.map(element => {
        element.start = new Date(element.start);
        if (!element.isPresent) {
          element.end = new Date(element.end);
        } else {
          element.end = null;
        }
      });
    }
    return request;
  }

  uploadFile(target, files: FileList): void {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e) => {
      let imgage = new Image;
      const chImg = reader.result;
      imgage.src = chImg.toString();
      imgage.onload = (ee) => {
      };
      const FileSize = files[0].size / 1024 / 1024; // MB
      if (FileSize > 10) {
        this.showToast('danger', 'File size more than 10MB');
      } else {
        target.src = imgage.src;
        target.name = files[0].name;
        target.type = files[0].type;
        target.size = files[0].size;
      }
    };
  }

  clearFile(target): void {
    target = this.initialAttahment();
  }

  showToast(type: NbComponentStatus, title: string, body: string = '') {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 5000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
      preventDuplicates: false,
    };
    this.toastrService.show(body, title, config);
  }

}