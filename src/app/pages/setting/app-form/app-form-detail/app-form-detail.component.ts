import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

import { IAppFormTemplate, IOption, IAction, ITreeNode } from '../app-form.interface';
import { InputType, State, ResponseCode } from '../../../../shared/app.constants';
import { setAppFormData, getRole } from '../../../../shared/services';
import { AppFormService } from '../app-form.service';

@Component({
  selector: 'ngx-app-form-detail',
  templateUrl: './app-form-detail.component.html',
  styleUrls: ['./app-form-detail.component.scss']
})
export class AppFormDetailComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  role: any;
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
  loadingJob = false;

  lenearFrom = [0, 1];
  lenearTo = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  totalScore = 0;
  questionError: string;
  isExpress = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: AppFormService,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.isExpress = this.role.refCompany.isExpress;
  }

  ngOnInit() {
    this.initialModel();
    this.setDefault();
    this.activatedRoute.params.subscribe(params => {
      if (params.action === State.Create) {
        this.getJobPosition();
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
      formName: 'Application Form #1',
      formRemark: '',
      title: 'Application Form',
      subTitle: this.role.refCompany.name ? this.role.refCompany.name : '',
      bgColor: '#35c4b2',
      titleColor: '#ffffff',
      subTitleColor: '#ffffff',
      isExpress: false,

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
      },
      jobPositions: [],
    };
  }

  setDefault() {
    this.appForm.personalDetail.firstname.required = true;
    this.appForm.personalDetail.firstname.disabled = true;
    this.appForm.personalDetail.lastname.required = true;
    this.appForm.personalDetail.lastname.disabled = true;
    this.appForm.personalDetail.birth.required = true;
    this.appForm.personalDetail.phone.required = true;
    this.appForm.personalDetail.phone.disabled = true;
    this.appForm.personalDetail.email.required = true;
    this.appForm.personalDetail.email.disabled = true;

    this.appForm.workExperience.position.required = true;
    this.appForm.workExperience.position.disabled = true;
    this.appForm.workExperience.company.required = true;

    this.appForm.education.refDegree.required = true;
    this.appForm.education.refDegree.disabled = true;
  }

  initialOption(): IOption {
    return {
      label: 'Option 1',
      imgaeURL: '',
      checked: false,
      maxScore: 0
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

  initialTreeNode(): ITreeNode {
    return {
      refPosition: '',
      name: '',
      children: [],
      required: false,
      isMultiAnswer: false,
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
      case this.InputType.Upload:
        icon = 'cloud_upload';
        break;
      case this.InputType.Linear:
        icon = 'linear_scale';
        break;
      case this.InputType.RadioGrid:
        icon = 'drag_indicator';
        break;
      case this.InputType.ChcekBoxGrid:
        icon = 'apps';
        break;
      case this.InputType.Date:
        icon = 'event';
        break;
      case this.InputType.Time:
        icon = 'access_time';
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
      case this.InputType.RadioGrid:
        icon = 'radio_button_unchecked';
        break;
      case this.InputType.ChcekBoxGrid:
        icon = 'check_box_outline_blank';
        break;
    }
    return icon;
  }

  addQuestion() {
    this.appForm.questions.push({
      type: this.InputType.Radio,
      title: 'Untitled Question',
      subTitle: '',
      showSubTitle: false,
      required: false,
      imgaeURL: '',
      answer: {
        input: '',
        textArea: '',
        options: [this.initialOption()],
        selected: null,
        hasOther: false,
        otherLabel: 'Other',
        otherChecked: false,
        otherInput: '',
        otherScore: 0,
        attachment: {
          uploadName: '',
          originalName: '',
          type: '',
          size: 0,
        },
        linearValue: null,
        linearOptions: [],
        gridRadio: [],
        gridCheckbox: [],
        date: null,
        time: {
          hour: null,
          minute: null,
        }
      },
      linear: {
        fromLabel: '',
        fromValue: 1,
        toLabel: '',
        toValue: 5,
      },
      grid: {
        rows: [
          {
            label: 'Row 1',
            maxScore: 0
          }
        ],
        columns: [
          {
            label: 'Column 1',
            maxScore: 0
          }
        ],
      },
      score: {
        isScore: false,
        maxScore: 0,
        keywords: [],
        girdRowScore: 0,
        submitScore: 0,
      }
    });
  }

  duplicateQuestion(index: number) {
    const question = _.cloneDeep(this.appForm.questions[index]);
    this.appForm.questions.push(question);
    this.calGrandScore();
  }

  deleteQuestion(index: number) {
    this.appForm.questions.splice(index, 1);
    this.calGrandScore();
  }

  addOption(options: any): void {
    if (options && options.length) {
      options.push({
        label: `Option ${options.length + 1}`,
        imgaeURL: '',
        maxScore: 0
      });
    }
  }

  deleteOption(iQuestion: number, iOption: number) {
    this.appForm.questions[iQuestion].answer.options.splice(iOption, 1);
  }

  addNode() {
    this.appForm.jobPositions.push({
      refPosition: '',
      name: `Job Position ${this.appForm.jobPositions.length + 1}`,
      required: false,
      isMultiAnswer: false,
      children: [],
    });
  }

  deleteNode(iNode: number) {
    this.appForm.jobPositions.splice(iNode, 1);
  }

  addNodeItem(iNode: number) {
    this.appForm.jobPositions[iNode].children.push({
      name: `Child ${this.appForm.jobPositions[iNode].children.length + 1}`,
      required: false,
      isMultiAnswer: false,
      children: [],
    });
  }

  deleteNodeItem(iNode: number, iNodeItem: number) {
    this.appForm.jobPositions[iNode].children.splice(iNodeItem, 1);
  }

  addGridRow(rows: any): void {
    if (rows) {
      rows.push({
        label: `Row ${rows.length + 1}`,
        maxScore: 0
      });
    }
  }

  deleteGridRow(iQuestion: number, iGridRow: number) {
    this.appForm.questions[iQuestion].grid.rows.splice(iGridRow, 1);
  }

  addGridColumn(columns: any): void {
    if (columns) {
      columns.push({
        label: `Column ${columns.length + 1}`,
        maxScore: 0
      });
    }
  }

  deleteGridColumn(iQuestion: number, iGridCol: number) {
    this.appForm.questions[iQuestion].grid.columns.splice(iGridCol, 1);
  }

  calGrandScore() {
    this.totalScore = 0;
    this.appForm.questions.forEach(question => {
      this.totalScore += question.score.maxScore;
    });
  }

  oncChangeGridRowScore(question): void {
    question.score.maxScore = question.score.girdRowScore * question.grid.rows.length;
    this.calGrandScore();
  }

  getMaxScore(score): number {
    return 100 - this.totalScore + score;
  }

  getTotalScore(question): number {
    let score = 0;
    if (question.type === InputType.ChcekBox) {
      question.answer.options.forEach(option => {
        score += option.maxScore;
      });
      if (question.answer.hasOther) {
        score += question.answer.otherScore;
      }
    } else if (question.type === InputType.ChcekBoxGrid) {
      question.grid.columns.forEach(col => {
        score += col.maxScore;
      });
    }
    return score;
  }

  autoCalScoreCheckbox(question): void {
    let leng: number;
    let maxScore: number;
    if (question.type === InputType.ChcekBox) {
      maxScore = question.score.maxScore;
      leng = question.answer.options.length;
      if (question.answer.hasOther) {
        leng++;
      }
    } else if (question.type === InputType.ChcekBoxGrid) {
      maxScore = question.score.girdRowScore;
      leng = question.grid.columns.length;
    }

    const scoreAvg = Math.floor(maxScore / leng);
    const scoreOver = maxScore - (scoreAvg * leng);

    if (question.type === InputType.ChcekBox) {
      question.answer.options.map(option => {
        option.maxScore = scoreAvg;
      });
      if (question.answer.hasOther) {
        question.answer.otherScore = scoreAvg;
      }
      if (scoreOver > 0) {
        question.answer.options[0].maxScore += scoreOver;
      }
    } else if (question.type === InputType.ChcekBoxGrid) {
      question.grid.columns.map(col => {
        col.maxScore = scoreAvg;
      });
      if (scoreOver > 0) {
        question.grid.columns[0].maxScore += scoreOver;
      }
    }
  }

  addKeyword(keywords, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    if (value) {
      if (keywords.indexOf(value) === -1) {
        keywords.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }

  removeKeyword(keywords, index): void {
    keywords.splice(index, 1);
  }

  setLinearOptions(question): void {
    if (question.type === InputType.Linear) {
      let fromValue = question.linear.fromValue;
      const toValue = question.linear.toValue;
      let score = 0;
      const maxScore = question.score.maxScore;
      const stepScore = Math.round(maxScore / (toValue - fromValue));

      question.answer.linearOptions = [];
      while (fromValue <= toValue) {
        question.answer.linearOptions.push({
          label: fromValue,
          maxScore: fromValue !== toValue ? score : maxScore,
        })
        score += stepScore;
        fromValue++;
      }
    }
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
    this.questionError = '';

    const elements = document.getElementsByClassName('mat-input-element ng-invalid');
    if (elements.length > 0) {
      isValid = false;
      const id = elements.item(0).getAttribute('id');
      if (id) {
        document.getElementById(id).focus();
      }
    } else if (this.appForm.questions && this.appForm.questions.length) {
      const found = this.appForm.questions.find(question => {
        return question.score.isScore;
      });
      if (found) {
        if (this.totalScore !== 100) {
          document.getElementById('question').focus();
          this.questionError = '* Total score not equal 100.';
          isValid = false;
        }
      }
    }

    return isValid;
  }

  setRequest(): IAppFormTemplate {
    const request = this.appForm;
    request.isExpress = this.isExpress;
    if (this.state === State.Create) {
      delete request._id;
    }
    return request;
  }

  getJobPosition() {
    this.loadingJob = true;
    this.service.getJobPosition().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          response.data.forEach(data => {
            const found = this.appForm.jobPositions.find(jobPosition => {
              return jobPosition.refPosition === data._id;
            });
            if (!found) {
              this.appForm.jobPositions.push({
                refPosition: data._id,
                name: data.name,
                required: false,
                isMultiAnswer: false,
                children: [],
              });
            }
          });
        }
      }
      this.loadingJob = false;
    });
  }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.appForm = response.data;
          this.calGrandScore();
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
