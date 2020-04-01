import { AfterViewInit, Component, ElementRef, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { NbPopoverDirective, NbPosition, NbTrigger } from '@nebular/theme';
import { NbDialogService, NbDialogRef, NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ExamOnlineService } from '../exam-online.service';
import { ResponseCode } from '../../../../shared/app.constants';
import { getRole } from '../../../../shared/services/auth.service';
import { MESSAGE } from '../../../../shared/constants/message';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'ngx-exan-online-detail',
  templateUrl: './exan-online-detail.component.html',
  styleUrls: ['./exan-online-detail.component.scss']
})
export class ExanOnlineDetailComponent implements OnInit {
  @ViewChild(NbPopoverDirective, { static: true }) popover: NbPopoverDirective;
  @ViewChild('tabs', { static: true, read: TemplateRef }) templateTabs: TemplateRef<any>;
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  component: any;
  fieldName: any;
  createTopic: any;
  topicOption: any;
  radioGroup: any;
  dialogRef: NbDialogRef<any>;
  topic: any;

  role: any;

  url: any;
  imgHeight: number;
  touchedName: boolean;
  examName: any;
  sErrorName: string;
  state: any;
  _id: any;
  preview: boolean;
  loading: boolean;
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private service: ExamOnlineService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.component = this.templateTabs;
    this.loading = true;
    this.createTopic = "";
    this.examName = "";
    this.topicOption = [];
    this.preview = false;
    this.initialModel();
    this.activatedRoute.params.subscribe(params => {
      if (params.action === "create") {
        this.state = "create";
        this.loading = false;
      }
      if (params.action === "edit") {
        this._id = params.id;
        this.state = "edit";
        this.getDetail();
      }
      if (params.action === "preview") {
        this._id = params.id;
        this.preview = true;
        this.getDetail();
      }
    });
  }

  initialModel(): any {
    this.radioGroup = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]
  }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.topicOption = response.data.exams;
        this.examName = response.data.name;
      }
      this.loading = false;
    })
  }

  addTopic(dialog: TemplateRef<any>, option: any) {
    this.fieldName = "";
    this.createTopic = option;
    this.callDialog(dialog);
  }

  addInput(option: any) {
    this.createTopic = option;
    this.fieldName = "";
    this.createField();
  }

  createField() {
    if (this.createTopic === 'topic') {
      this.topicOption.push({
        name: this.fieldName,
        examOptions: []
      })
    } else if (this.createTopic === 'radio') {
      this.topic.examOptions.push(
        {
          name: this.fieldName,
          type: "label",
          value: ""
        }, {
          name: "",
          type: this.createTopic,
          value: undefined,
          group: this.radioGroup
        })
    } else if (this.createTopic === 'file') {
      this.topic.examOptions.push(
        {
          name: this.fieldName,
          type: "label",
          value: ""
        }, {
          name: "",
          type: this.createTopic,
          value: undefined,
          src: undefined
        }, {
          name: this.fieldName,
          type: "area",
          value: undefined,
        }
      )
    } else if (this.createTopic === 'getFile') {
      this.topic.examOptions.push(
        {
          name: this.fieldName,
          type: "label",
          value: ""
        }, {
          name: this.fieldName,
          type: this.createTopic,
          src: undefined
        })
    } else {
      this.topic.examOptions.push(
        {
          name: this.fieldName,
          type: "label",
          value: ""
        }, {
          name: this.fieldName,
          type: this.createTopic,
          value: ""
        })
    }
    this.dialogRef.close();
  }

  addRadio(option) {
    let i = option.group.length + 1;
    option.group.push({
      value: i, label: 'Option 1'
    })
  }

  setTopic(topic) {
    this.topic = topic;
  }

  fileChangeEvent(option, files: FileList): void {
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); // read file as data url
    reader.onload = (e) => {
      var img = new Image;
      const chImg = reader.result;
      img.src = chImg.toString();
      img.onload = (ee) => {
        this.imgHeight = img.height;
      };
      const FileSize = files.item(0).size / 1024 / 1024; // in MB
      if (FileSize > 10) {
        this.showToast('danger', 'Error Message', 'file size more than 10 mb');
      } else {
        option.src = img.src;
      }
    };
  }

  deleteTopic(topicOption: any, index: any) {
    topicOption.splice(index, 1);
  }

  save() {
    if (this.validation()) {
      if (this.state === "create") {
        this.service.create(this.topicOption, this.role.departmentId, this.examName).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/employer/setting/exam-online']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        })
      } else {
        this.service.edit(this.topicOption, this.role.departmentId, this.examName, this._id).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/employer/setting/exam-online']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        })
      }
    }
  }

  validation(): boolean {
    let isValid = true;
    this.touchedName = false;
    if (this.examName === undefined || this.examName === "") {
      this.touchedName = true;
      this.sErrorName = MESSAGE[157];
      isValid = false;
    }
    return isValid
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
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
