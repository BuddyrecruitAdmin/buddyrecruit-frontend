import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

import { IAppFormTemplate, IOption, IAction } from '../app-form.interface';
import { InputType, State, ResponseCode } from '../../../../shared/app.constants';
import { setAppFormData } from '../../../../shared/services';
import { AppFormService } from '../app-form.service';

@Component({
  selector: 'ngx-app-form-detail',
  templateUrl: './app-form-detail.component.html',
  styleUrls: ['./app-form-detail.component.scss']
})
export class AppFormDetailComponent implements OnInit {
  InputType = InputType;
  State = State;
  bgColors = [
    '#35c4b2',
    '#1b74b6',
    '#ed5154',
    '#ffc816',
    '#6bcaf2',
    '#9675cc',
    '#707070',
  ];
  url = window.location.origin + '/application-form/submit';

  _id: string;
  state: string;
  appForm: IAppFormTemplate;
  loading = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: AppFormService,
    private toastrService: NbToastrService,
  ) {

  }

  ngOnInit() {
    this.initialModel();
    this.setDefault();
    this.activatedRoute.params.subscribe(params => {
      if (params.action === State.Create) {
        this.state = State.Create;
        this.loading = false;
      } else if (params.action === State.Edit) {
        this._id = params.id;
        this.url = window.location.origin + '/application-form/submit/' + this._id;
        this.state = State.Edit;
        this.getDetail();
      }
    });
  }

  initialModel() {
    this.appForm = {
      _id: '',
      refCompany: '',
      formName: 'Application Form Name',
      formRemark: '',
      title: 'Application Form',
      subTitle: '(Buddy Recruit)',
      bgColor: '#35c4b2',
      titleColor: '#ffffff',
      subTitleColor: '#ffffff',

      questions: [],
      personalDetail: {
        active: true,
        firstname: this.initialAction(),
        lastname: this.initialAction(),
        birth: this.initialAction(),
        age: this.initialAction(),
        phone: this.initialAction(),
        email: this.initialAction(),
        address: this.initialAction(),
        addressNo: this.initialAction(),
        road: this.initialAction(),
        district: this.initialAction(),
        province: this.initialAction(),
        postcode: this.initialAction(),
        gender: this.initialAction(),
        expectedSalary: this.initialAction(),
      },
      workExperience: {
        active: true,
        position: this.initialAction(),
        company: this.initialAction(),
        start: this.initialAction(),
        end: this.initialAction(),
        isPresent: this.initialAction(),
        duty: this.initialAction(),
      },
      education: {
        active: true,
        refDegree: this.initialAction(),
        gpa: this.initialAction(),
        university: this.initialAction(),
        major: this.initialAction(),
      },
      hardSkill: {
        active: true,
      },
      softSkill: {
        active: true,
      },
      certificate: {
        active: true,
      },
      uploadCV: {
        active: true,
      }
    };
  }

  setDefault() {
    this.appForm.personalDetail.firstname.required = true;
    this.appForm.personalDetail.firstname.disabled = true;
    this.appForm.personalDetail.lastname.required = true;
    this.appForm.personalDetail.lastname.disabled = true;
    this.appForm.personalDetail.birth.required = true;
    this.appForm.personalDetail.phone.required = true;
    this.appForm.personalDetail.email.required = true;

    this.appForm.workExperience.position.required = true;
    this.appForm.workExperience.company.required = true;

    this.appForm.education.refDegree.required = true;
  }

  initialOption(): IOption {
    return {
      label: 'Option 1',
      imgaeURL: '',
      checked: false,
    };
  }

  initialAction(): IAction {
    return {
      visible: true,
      editable: true,
      disabled: false,
      required: false,
    };
  }

  getSelectedType(InputType: string): string {
    let icon = '';
    switch (InputType) {
      case this.InputType.Label:
        icon = 'text_fields';
        break;
      case this.InputType.Input:
        icon = 'short_text';
        break;
      case this.InputType.TextArea:
        icon = 'subject';
        break;
      case this.InputType.Radio:
        icon = 'radio_button_checked';
        break;
      case this.InputType.ChcekBox:
        icon = 'check_box';
        break;
      case this.InputType.Dropdown:
        icon = 'arrow_drop_down_circle';
        break;
    }
    return icon;
  }

  getSelectedOption(InputType: string): string {
    let icon = '';
    switch (InputType) {
      case this.InputType.Radio:
        icon = 'radio_button_unchecked';
        break;
      case this.InputType.ChcekBox:
        icon = 'check_box_outline_blank';
        break;
      case this.InputType.Dropdown:
        icon = 'fiber_manual_record';
        break;
    }
    return icon;
  }

  addQuestion() {
    this.appForm.questions.push({
      type: this.InputType.Radio,
      title: 'Question',
      subTitle: '',
      showSubTitle: false,
      required: false,
      imgaeURL: '',
      answer: {
        input: '',
        textArea: '',
        options: [this.initialOption()],
        selected: '',
        hasOther: false,
        otherLabel: 'Other',
        otherChecked: false,
        otherInput: ''
      },
    });
  }

  duplicateQuestion(index: number) {
    const question = _.cloneDeep(this.appForm.questions[index]);
    this.appForm.questions.push(question);
  }

  deleteQuestion(index: number) {
    this.appForm.questions.splice(index, 1);
  }

  addOption(index: number) {
    this.appForm.questions[index].answer.options.push({
      label: `Option ${this.appForm.questions[index].answer.options.length + 1}`,
      imgaeURL: '',
    });
  }

  deleteOption(iQuestion: number, iOption: number) {
    this.appForm.questions[iQuestion].answer.options.splice(iOption, 1);
  }

  back() {
    this.router.navigate(['/employer/setting/app-form']);
  }

  preview() {
    setAppFormData(this.appForm);
    this.router.navigate([]).then(result => { window.open('/application-form/preview', '_blank'); });
  }

  copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = this.url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.showToast('success', 'Copied!', '');
  };

  save() {
    if (this.validation()) {
      const request = this.setRequest();
      this.loading = true;
      if (this.state === State.Create) {
        this.service.create(request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', response.message || 'Saved Successful');
          } else {
            this.showToast('danger', response.message || 'Error!');
          }
          this.back();
          this.loading = false;
        });
      } else {
        this.service.edit(request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', response.message || 'Saved Successful');
          } else {
            this.showToast('danger', response.message || 'Error!');
          }
          this.back();
          this.loading = false;
        });
      }
    }
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

    return isValid;
  }

  setRequest(): IAppFormTemplate {
    const request = this.appForm;
    if (this.state === State.Create) {
      delete request._id;
    }
    return request;
  }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.appForm = response.data;
        }
      } else {
        this.showToast('danger', response.message || 'Error!');
        this.back();
      }
      this.loading = false;
    });
  }

  changePersonalCheckbox() {
    if (!this.appForm.personalDetail.firstname.visible) {
      this.appForm.personalDetail.firstname.required = false;
    }
    if (!this.appForm.personalDetail.lastname.visible) {
      this.appForm.personalDetail.lastname.required = false;
    }
    if (!this.appForm.personalDetail.birth.visible) {
      this.appForm.personalDetail.birth.required = false;
    }
    if (!this.appForm.personalDetail.age.visible) {
      this.appForm.personalDetail.age.required = false;
    }
    if (!this.appForm.personalDetail.phone.visible) {
      this.appForm.personalDetail.phone.required = false;
    }
    if (!this.appForm.personalDetail.email.visible) {
      this.appForm.personalDetail.email.required = false;
    }
    if (!this.appForm.personalDetail.address.visible) {
      this.appForm.personalDetail.address.required = false;
    }
  }

  changeWorkExperienceCheckbox() {
    if (!this.appForm.workExperience.position.visible) {
      this.appForm.workExperience.position.required = false;
    }
    if (!this.appForm.workExperience.company.visible) {
      this.appForm.workExperience.company.required = false;
    }
    if (!this.appForm.workExperience.start.visible) {
      this.appForm.workExperience.start.required = false;
    }
    if (!this.appForm.workExperience.end.visible) {
      this.appForm.workExperience.end.required = false;
    }
    if (!this.appForm.workExperience.duty.visible) {
      this.appForm.workExperience.duty.required = false;
    }
  }

  changeEducationCheckbox() {
    if (!this.appForm.education.refDegree.visible) {
      this.appForm.education.refDegree.required = false;
    }
    if (!this.appForm.education.gpa.visible) {
      this.appForm.education.gpa.required = false;
    }
    if (!this.appForm.education.university.visible) {
      this.appForm.education.university.required = false;
    }
    if (!this.appForm.education.major.visible) {
      this.appForm.education.major.required = false;
    }
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
      const FileSize = files.item(0).size / 1024 / 1024; // MB
      if (FileSize > 2) {
        this.showToast('danger', 'File size more than 2MB');
      } else {
        target.imgaeURL = imgage.src;
      }
    };
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.appForm.questions, event.previousIndex, event.currentIndex);
  }

  showToast(type: NbComponentStatus, title: string, body: string = '') {
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
