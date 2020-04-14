import { AfterViewInit, Component, ElementRef, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { NbPopoverDirective, NbPosition, NbTrigger } from '@nebular/theme';
import { NbDialogService, NbDialogRef, NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ExamOnlineService } from '../exam-online.service';
import { ResponseCode } from '../../../../shared/app.constants';
import { getRole } from '../../../../shared/services/auth.service';
import { MESSAGE } from '../../../../shared/constants/message';
import { Router, ActivatedRoute } from "@angular/router";
import { UtilitiesService } from '../../../../shared/services/utilities.service';
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
  dialogRef: NbDialogRef<any>;
  topic: any;
  countRadio: number;
  role: any;
  isUser: boolean;
  url: any;
  imgHeight: number;
  touchedName: boolean;
  examName: any;
  duration: any;
  sErrorName: string;
  state: any;
  _id: any;
  preview: boolean;
  loading: boolean;
  fileText: any;
  getOptionImg: any;
  innerHeight: any;
  addIdex: any;
  topicColor: any;
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private service: ExamOnlineService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilitiesService: UtilitiesService,
  ) {
    this.role = getRole();
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.component = this.templateTabs;
    this.loading = true;
    this.countRadio = 0;
    this.createTopic = "";
    this.examName = "";
    this.topicOption = [];
    this.isUser = true;
    this.preview = false;
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

  getDetail() {
    this.service.getDetail(this._id, this.isUser).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.topicOption = response.data.exams;
        this.examName = response.data.name;
        this.duration = response.data.duration;
      }
      this.loading = false;
    })
  }

  addTopic(dialog: TemplateRef<any>, option: any) {
    this.fieldName = "";
    this.createTopic = option;
    this.addIdex = "";
    this.callDialog(dialog);
  }

  insertTopic(dialog: TemplateRef<any>, option: any, index) {
    this.fieldName = "";
    this.createTopic = option;
    this.addIdex = index + 1;
    this.callDialog(dialog);
  }

  addInput(option: any) {
    this.createTopic = option;
    this.fieldName = "";
    this.createField();
  }

  createField() {
    if (this.createTopic === 'topic') {
      if (this.addIdex) {
        this.topicOption.splice(this.addIdex, 0, {
          name: this.fieldName,
          examOptions: [],
          color: "black"
        })
      } else {
        this.topicOption.push({
          name: this.fieldName,
          examOptions: [],
          color: "black"
        })
      }
    } else if (this.addIdex) {
      if (this.createTopic === 'radio') {
        this.topic.examOptions.splice(this.addIdex, 0,
          {
            name: this.fieldName,
            type: "label",
            value: "",
            color: "black",
            score: ""
          }, {
          name: "",
          type: this.createTopic,
          value: undefined,
          group: [{ value: 1, label: 'Option 1', color: "black" }]
        })
        console.log(this.topic.examOptions)
      } else if (this.createTopic === 'file') {
        this.topic.examOptions.splice(this.addIdex, 0,
          {
            name: this.fieldName,
            type: "label",
            value: "",
            color: "black",
            score: ""
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
        this.topic.examOptions.splice(this.addIdex, 0,
          {
            name: this.fieldName,
            type: "label",
            value: "",
            score: ""
          }, {
          name: this.fieldName,
          type: this.createTopic,
          src: undefined
        })
      } else {
        this.topic.examOptions.splice(this.addIdex, 0,
          {
            name: this.fieldName,
            type: "label",
            value: "",
            color: "black",
            align: "center",
            score: ""
          }, {
          name: this.fieldName,
          type: this.createTopic,
          value: "",
          color: "black",
          score: ""
        })
      }
    } else { //add in last arr
      if (this.createTopic === 'radio') {
        this.topic.examOptions.push(
          {
            name: this.fieldName,
            type: "label",
            value: "",
            color: "black",
            score: ""
          }, {
          name: "",
          type: this.createTopic,
          value: undefined,
          group: [{ value: 1, label: 'Option 1', color: "" }]
        })
      } else if (this.createTopic === 'file') {
        this.topic.examOptions.push(
          {
            name: this.fieldName,
            type: "label",
            value: "",
            color: "black",
            score: ""
          }, {
          name: "",
          type: this.createTopic,
          value: undefined,
          src: undefined
        }, {
          name: this.fieldName,
          type: "area",
          value: undefined,
          color: "black"
        }
        )
      } else if (this.createTopic === 'getFile') {
        this.topic.examOptions.push(
          {
            name: this.fieldName,
            type: "label",
            value: "",
            color: "black",
            score: ""
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
            value: "",
            color: "black",
            score: ""
          }, {
          name: this.fieldName,
          type: this.createTopic,
          value: "",
          color: "black"
        })
      }
    }
    this.dialogRef.close();
    // this.popover.hide()
  }

  addRadio(option, index) {
    let i = option.group.length + 1;
    option.group.push({
      value: option.group.length + 1, label: 'Option ' + i, src: ''
    })
  }

  setTopic(topic) {
    this.topic = topic;
    this.addIdex = "";
  }

  setTopicIndex(topic, index) {
    this.topic = topic;
    this.addIdex = index + 1;
  }

  setOption(topic) {
    this.topicColor = topic;
  }

  setColor(rgb) {
    this.topicColor.color = rgb;
  }

  // changeAlign(align) {
  //   console.log(this.topicColor)
  //   this.topicColor.align = align;
  // }

  fileChangeEvent(option, files: FileList): void {
    this.fileText = "";
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
        this.fileText = "upload success!"
      }
    };
  }

  deleteTopic(topicOption: any, index: any) {
    topicOption.splice(index, 1);
  }

  save() {
    if (this.validation()) {
      if (this.state === "create") {
        this.service.create(this.topicOption, this.role.departmentId, this.examName, this.duration).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/employer/setting/exam-online']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        })
      } else {
        this.service.edit(this.topicOption, this.role.departmentId, this.examName, this._id, this.duration).subscribe(response => {
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

  showImg(dialog: TemplateRef<any>, option) {
    this.getOptionImg = option;
    this.callDialog(dialog);
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
