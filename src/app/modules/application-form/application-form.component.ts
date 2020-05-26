import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '../../translate.service';
import { setLangPath, getAppFormData, getRole, setCompanyName, setFlagConsent, setCompanyId } from '../../shared/services';
import { IApplicationForm, IAttachment } from './application-form.interface';
import { DropDownValue } from '../../shared/interfaces';
import { ApplicationFormService } from './application-form.service';
import { JdService } from '../../pages/jd/jd.service';
import { NbToastrService, NbComponentStatus, NbGlobalPhysicalPosition, NbDialogService } from '@nebular/theme';
import { ResponseCode, InputType, State } from '../../shared/app.constants';
import { IAppFormTemplate } from '../../pages/setting/app-form/app-form.interface';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { MatDialog } from '@angular/material';
import { UtilitiesService } from '../../shared/services/utilities.service';

import { API_ENDPOINT } from '../../shared/constants';
import { environment } from '../../../environments/environment';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload/ng2-file-upload';
const URL = environment.API_URI + "/" + API_ENDPOINT.FILE.FILE_UPLOAD;
import { PopupConsentComponent } from '../../component/popup-consent/popup-consent.component';

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
  formGroup: FormGroup;

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
  jobPosition: any;

  loading = true;
  loadingUpload = false;
  submitted = false;
  isPreview = false;
  isDisabled = false;
  isAgree = false;

  uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'data' });

  title = {
    th: [
      'นาย',
      'นาง',
      'นางสาว',
    ],
    en: [
      'Mr.',
      'Mrs.',
      'Miss',
    ]
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private service: ApplicationFormService,
    private jdService: JdService,
    private toastrService: NbToastrService,
    public matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
  ) {
    this.role = getRole();
    setLangPath("RESUME");
    this.language = 'en';
    this.setLang(this.language);
  }

  ngOnInit() {
    this.getDegrees();
    this.initialModel();
    this.initialForm();

    this.activatedRoute.params.subscribe(params => {
      const action = params.action;
      const refCompany = params.id;
      const refTemplate = params.id;
      const refAppform = params.id;

      if (action) {
        if (action === State.Preview) {
          if (refTemplate) {
            this.getTemplate(undefined, refTemplate);
          } else {
            this.template = getAppFormData();
            if (this.template) {
              this.appForm.refCompany = this.template.refCompany;
              this.appForm.refTemplate = this.template._id;
              this.appForm.questions = this.template.questions;
              this.initialAnswer();
              this.getJR(this.role && this.role.refCompany ? this.role.refCompany : undefined);
            } else {
              this.onError();
            }
          }
          this.isPreview = true;
        } else if (action === State.Submit && refCompany) {
          this.getTemplate(refCompany, undefined);
        } else if (action === State.Detail && refAppform) {
          this.isDisabled = true;
          this.initialForm();
          this.getDetail(refAppform);
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
      title: '',
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
      questions: [],
      refPosition: '',
      jobSelected: '',
      jobChildSelected: '',
      jobMultiChild: new FormControl()
    };
  }

  initialForm() {
    this.formGroup = this.formBuilder.group({
      email: [{ value: '', disabled: this.isDisabled }, [Validators.email, Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')]],
      phone: [{ value: '', disabled: this.isDisabled }, [Validators.pattern('^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]*$')]],
      postcode: [{ value: '', disabled: this.isDisabled }, [Validators.pattern('^[0-9]{5}$')]],
      gpa: [{ value: '', disabled: this.isDisabled }, [Validators.maxLength(4)]],
    });
  }
  get f() { return this.formGroup.controls; }

  initialAttahment(): IAttachment {
    return {
      uploadName: '',
      originalName: '',
      type: '',
      size: 0,
    };
  }

  getTemplate(refCompany: string, refTemplate: string) {
    this.service.getTemplate(refCompany, refTemplate).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.template = response.data;
          this.appForm.refCompany = this.template.refCompany;
          this.appForm.refTemplate = this.template._id;
          this.appForm.questions = this.template.questions;
          this.initialAnswer();
        }
        this.getJR(this.template.refCompany);
        this.uploader = new FileUploader({
          url: URL,
          itemAlias: 'data',
          headers: [
            {
              name: 'refCompany',
              value: this.appForm.refCompany
            },
            {
              name: 'isCV',
              value: false
            },
            {
              name: 'isExpress',
              value: this.template.isExpress
            },
          ],
        });
      } else if (response.code === ResponseCode.NoContent) {
        let message = 'Sorry! At this time, there is no recruitment.';
        if (this.language === 'th') {
          message = 'ขออภัย ขณะนี้ยังไม่มีการรับสมัครพนักงาน';
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
      } else {
        this.onError();
      }
    });
  }

  getDetail(refAppform: string) {
    this.service.getDetail(refAppform).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.appForm = response.data;
          this.template = response.data.refTemplate;
          this.getJR(this.appForm.refCompany);

          this.appForm.birth = new Date(this.appForm.birth);
          if (this.appForm.workExperience.work && this.appForm.workExperience.work.length) {
            this.appForm.workExperience.work.map(element => {
              element.start = new Date(element.start);
              if (!element.isPresent) {
                element.end = new Date(element.end);
              } else {
                element.end = null;
              }
            });
          }
          const jobMultiChild = this.appForm.jobMultiChild || [];
          this.appForm.jobMultiChild = new FormControl();
          this.appForm.jobMultiChild.value = jobMultiChild;

          this.appForm.questions.forEach(question => {
            if (question.type === InputType.ParentChild) {
              const multiChilds = question.multiChilds || [];
              question.multiChilds = new FormControl();
              question.multiChilds.value = multiChilds;
            }
          });
        }
      }
    });
  }

  initialAnswer() {
    if (this.appForm.questions) {
      this.appForm.questions.map(question => {
        switch (question.type) {
          case InputType.RadioGrid:
            question.answer.gridRadio = [];
            question.grid.rows.forEach(row => {
              question.answer.gridRadio.push({
                rowName: row.label,
                value: '',
              });
            });
            break;

          case InputType.ChcekBoxGrid:
            question.answer.gridCheckbox = [];
            let columns = [];
            question.grid.columns.forEach(col => {
              columns.push({
                colName: col.label,
                maxScore: col.maxScore,
                checked: false,
              })
            });
            question.grid.rows.forEach(row => {
              question.answer.gridCheckbox.push({
                rowName: row.label,
                columns: JSON.parse(JSON.stringify(columns)),
              });
            });
            break;

          case InputType.ParentChild:
            question.multiChilds = new FormControl();

          default:
            break;
        }
      });
    }
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
            } else if (response.code === ResponseCode.Duplicate) {
              let message = 'You have applied for this job position.';
              if (this.language === 'th') {
                message = 'คุณได้สมัครตำแหน่งงานนี้ไปแล้ว';
              }
              this.showToast('danger', message);
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
            if (question.answer.selected === null) {
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
            if (question.answer.selected === null) {
              isQuestionValid = false;
              element.classList.add("has-error");
            }
            break;
          case this.InputType.Upload:
            if (!question.answer.attachment.uploadName) {
              isQuestionValid = false;
              element.classList.add("has-error");
            }
            break;
          case this.InputType.Linear:
            if (!(question.answer.linearValue >= 0)) {
              isQuestionValid = false;
              element.classList.add("has-error");
            }
            break;
          case this.InputType.RadioGrid:
            question.answer.gridRadio.forEach(gridRadio => {
              if (!gridRadio.value) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
            });
            break;
          case this.InputType.ChcekBoxGrid:
            question.answer.gridCheckbox.forEach(gridCheckbox => {
              const found = gridCheckbox.columns.find(column => {
                return column.checked;
              });
              if (!found) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
            });
            break;
          case this.InputType.Date:
            if (!question.answer.date) {
              isQuestionValid = false;
              element.classList.add("has-error");
            }
            break;
          case this.InputType.Time:
            if (!question.answer.time) {
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
    const request = this.appForm;
    request.birth = new Date(request.birth);
    if (request.workExperience.work && request.workExperience.work.length) {
      request.workExperience.work.map(element => {
        element.start = new Date(element.start);
        if (!element.isPresent) {
          element.end = new Date(element.end);
        } else {
          element.end = new Date();
        }
        request.workExperience.totalExpMonth += this.utilitiesService.getNumberOfMonth(element.start, element.end);
      });
    }
    if (request.jobMultiChild && request.jobMultiChild.value) {
      request.jobMultiChild = request.jobMultiChild.value;
    } else {
      request.jobMultiChild = [];
    }

    // Question
    if (request.questions && request.questions.length) {
      request.questions.map(question => {

        if (question.type === InputType.ParentChild) {
          if (question.multiChilds && question.multiChilds.value) {
            question.multiChilds = question.multiChilds.value;
          } else {
            question.multiChilds = [];
          }
        }

        // Calculate score
        if (question.score.isScore) {
          switch (question.type) {

            case InputType.Input:
              if (question.score.keywords && question.score.keywords.length) {
                question.score.keywords.forEach(keyword => {
                  const index = question.answer.input.indexOf(keyword);
                  if (index >= 0) {
                    question.score.submitScore = question.score.maxScore;
                  }
                });
              }
              break;

            case InputType.TextArea:
              if (question.score.keywords && question.score.keywords.length) {
                question.score.keywords.forEach(keyword => {
                  const index = question.answer.textArea.indexOf(keyword);
                  if (index >= 0) {
                    question.score.submitScore = question.score.maxScore;
                  }
                });
              }
              break;

            case InputType.Radio:
              if (question.answer.selected >= 0) {
                const option = question.answer.options[question.answer.selected];
                if (option) {
                  question.score.submitScore = option.maxScore;
                } else {
                  question.score.submitScore = question.answer.otherScore;
                }
              }
              break;

            case InputType.ChcekBox:
              question.answer.options.forEach(option => {
                if (option.checked) {
                  question.score.submitScore += option.maxScore;
                }
              });
              if (question.answer.otherChecked) {
                question.score.submitScore += question.answer.otherScore;
              }
              break;

            case InputType.Dropdown:
              if (question.answer.selected >= 0) {
                const option = question.answer.options[question.answer.selected];
                if (option) {
                  question.score.submitScore = option.maxScore;
                } else {
                  question.score.submitScore = question.answer.otherScore;
                }
              }
              break;

            case InputType.ParentChild:
              if (question.parentSelected >= 0) {
                const parent = question.parentChild[question.parentSelected];
                if (parent) {
                  question.score.submitScore = parent.maxScore;
                }
              }
              break;

            case InputType.Upload:
              if (question.answer.attachment && question.answer.attachment.uploadName) {
                question.score.submitScore = question.score.maxScore;
              }
              break;

            case InputType.Linear:
              const option = question.answer.linearOptions.find(option => {
                return option.label === question.answer.linearValue;
              });
              if (option) {
                question.score.submitScore = option.maxScore;
              }
              break;

            case InputType.RadioGrid:
              if (question.answer.gridRadio && question.answer.gridRadio.length) {
                question.answer.gridRadio.forEach(gridRadio => {
                  const column = question.grid.columns.find(column => {
                    return column.label === gridRadio.value;
                  });
                  if (column) {
                    question.score.submitScore += column.maxScore;
                  }
                });
              }
              break;

            case InputType.ChcekBoxGrid:
              if (question.answer.gridCheckbox && question.answer.gridCheckbox.length) {
                question.answer.gridCheckbox.forEach(gridCheckbox => {
                  gridCheckbox.columns.forEach(column => {
                    if (column.checked) {
                      question.score.submitScore += column.maxScore;
                    }
                  });
                });
              }
              break;
          }
        }
      });
    }
    return request;
  }

  uploadFile(target, files: FileList, isCV = false): void {
    const FileSize = files[0].size / 1024 / 1024; // MB
    if (FileSize > 10) {
      this.showToast('danger', 'File size more than 10MB');
      target.uploadName = '';
      target.originalName = '';
      target.type = '';
      target.size = 0;
    } else {
      const queue = this.uploader.queue.find(element => {
        return element.file.name === files[0].name
          && element.file.type === files[0].type
          && element.file.size === files[0].size;
      });
      if (queue) {
        this.uploader.options.headers.map(element => {
          if (element.name === 'isCV') {
            element.value = isCV.toString();
          }
        });
        this.loadingUpload = true;
        this.uploader.uploadItem(queue);
        this.uploader.onSuccessItem = (item, response, status, headers) => {
          const responseData = JSON.parse(response);
          target.uploadName = responseData.uploadName;
          target.originalName = files[0].name;
          target.type = files[0].type;
          target.size = files[0].size;
          this.loadingUpload = false;
        };
      }
    }
  }

  clearFile(target): void {
    const queue = this.uploader.queue.find(element => {
      return element.file.name === target.originalName
        && element.file.type === target.type
        && element.file.size === target.size;
    });
    if (queue) {
      this.uploader.cancelItem(queue);
      this.uploader.removeFromQueue(queue);
    }
    target.uploadName = '';
    target.originalName = '';
    target.type = '';
    target.size = 0;
  }

  onChangeJobPosition(value: string) {
    this.appForm.jobChildSelected = '';
    this.appForm.jobMultiChild = new FormControl();
    this.jobPosition = this.template.jobPositions.find(element => {
      return element.refPosition === value;
    });
  }

  getChild(question): any {
    let child;
    if (question.parentChild.length && question.parentSelected >= 0) {
      child = question.parentChild[question.parentSelected];
    }
    return child;
  }

  openPopupConsent() {
    setCompanyName(this.template.companyName || '');
    setCompanyId(this.template.refCompany);
    setFlagConsent(this.isAgree)
    this.dialogService.open(PopupConsentComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      this.isAgree = result;
    });
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
