import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

import { IAppForm, IOption, IAction } from '../app-form.interface';
import { InputType, State, ResponseCode } from '../../../../shared/app.constants';
import { setAppFormData, getAppFormData } from '../../../../shared/services';
import { AppFormService } from '../app-form.service';

@Component({
  selector: 'ngx-app-form-detail',
  templateUrl: './app-form-detail.component.html',
  styleUrls: ['./app-form-detail.component.scss']
})
export class AppFormDetailComponent implements OnInit {

  InputType = InputType;

  _id: string;
  state: string;
  appForm: IAppForm;
  loading: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: AppFormService,
    private toastrService: NbToastrService,
  ) {

  }

  ngOnInit() {
    this.initialModel();
    this.activatedRoute.params.subscribe(params => {
      if (params.action === State.Create) {
        this.state = State.Create;
        this.loading = false;
      } else if (params.action === State.Edit) {
        this._id = params.id;
        this.state = State.Edit;
        this.getDetail();
      }
      if (params.action === State.Preview) {
        this._id = params.id;
        this.state = State.Preview;
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
      questions: [],
      fieldControl: {
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

        personalDetail: this.initialAction(),
        workExperience: this.initialAction(),
        education: this.initialAction(),
        hardSkill: this.initialAction(),
        softSkill: this.initialAction(),
        certificate: this.initialAction(),
      }
    }
    this.appForm.fieldControl.firstname.required = true;
    this.appForm.fieldControl.lastname.required = true;
    this.appForm.fieldControl.birth.required = true;
    this.appForm.fieldControl.phone.required = true;
    this.appForm.fieldControl.email.required = true;
  }

  initialOption(): IOption {
    return {
      label: 'Option 1',
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
      label: `Option ${this.appForm.questions[index].answer.options.length + 1}`
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

  save() {
    const request = this.setRequest();
    this.service.create(request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', response.message || 'Saved Successful', '');
      } else {
        this.showToast('danger', response.message || 'Error!', '');
      }
      this.loading = false;
    });
  }

  setRequest(): IAppForm {
    const request = this.appForm;
    delete request._id;
    return request;
  }

  getDetail() {

  }

  changePersonalCheckbox() {
    if (!this.appForm.fieldControl.firstname.visible) {
      this.appForm.fieldControl.firstname.required = false;
    }
    if (!this.appForm.fieldControl.lastname.visible) {
      this.appForm.fieldControl.lastname.required = false;
    }
    if (!this.appForm.fieldControl.birth.visible) {
      this.appForm.fieldControl.birth.required = false;
    }
    if (!this.appForm.fieldControl.age.visible) {
      this.appForm.fieldControl.age.required = false;
    }
    if (!this.appForm.fieldControl.phone.visible) {
      this.appForm.fieldControl.phone.required = false;
    }
    if (!this.appForm.fieldControl.email.visible) {
      this.appForm.fieldControl.email.required = false;
    }
    if (!this.appForm.fieldControl.address.visible) {
      this.appForm.fieldControl.address.required = false;
    }
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
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
