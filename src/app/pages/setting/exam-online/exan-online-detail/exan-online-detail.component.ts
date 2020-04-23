import { AfterViewInit, Component, ElementRef, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { NbPopoverDirective, NbPosition, NbTrigger } from '@nebular/theme';
import { NbDialogService, NbDialogRef, NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ExamOnlineService } from '../exam-online.service';
import { ResponseCode } from '../../../../shared/app.constants';
import { getRole } from '../../../../shared/services/auth.service';
import { MESSAGE } from '../../../../shared/constants/message';
import { Router, ActivatedRoute } from "@angular/router";
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { DropDownValue, DropDownGroup } from '../../../../shared/interfaces/common.interface';
import { DropdownService } from '../../../../shared/services/dropdown.service';
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
  touchedDep: boolean;
  examName: any;
  duration: any;
  sErrorName: string;
  sErrorDe: string;
  state: any;
  _id: any;
  preview: boolean;
  loading: boolean;
  fileText: any;
  getOptionImg: any;
  innerHeight: any;
  addIdex: any;
  topicColor: any;
  departMentAdmin: DropDownValue[];
  filteredList2: any;
  divisionOptions: DropDownGroup[];
  divisionAll: DropDownGroup[];
  filteredList3: any;
  checkDivision: boolean;
  countDivision: any;
  departmentId: any;
  divisionId: any;
  allowAll: boolean;
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private service: ExamOnlineService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private dropdownService: DropdownService,
  ) {
    this.role = getRole();
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.component = this.templateTabs;
    this.loading = true;
    this.checkDivision = false;
    this.countRadio = 0;
    this.createTopic = "";
    this.examName = "";
    this.topicOption = [];
    this.isUser = true;
    this.preview = false;
    this.allowAll = false;
    this.initialDropdown().then((response) => {
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
    })
  }

  async initialDropdown() {
    await this.getDepartment();
  }

  getDepartment() {
    return new Promise((resolve) => {
      this.divisionOptions = [];
      this.departMentAdmin = [];
      this.departMentAdmin.push({
        label: "- Select Department -",
        value: undefined
      });
      this.divisionAll = [];
      this.divisionOptions = [];
      this.divisionOptions.push({
        label: '- Select Division -',
        value: undefined,
        group: undefined
      });
      this.dropdownService.getDepartment().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            response.data.forEach(element => {
              this.departMentAdmin.push({
                label: element.name,
                value: element._id
              });
              if (element.hasDivision && element.divisions.length) {
                element.divisions.forEach(division => {
                  this.divisionAll.push({
                    group: element._id,
                    label: division.name,
                    value: division._id
                  });
                });
              }
            });
            this.filteredList2 = this.departMentAdmin.slice();
          }
        }
        resolve();
      });
    });
  }

  onChangeDepartment(value) {
    this.divisionOptions = [];
    this.divisionOptions.push({
      label: '- Select Division -',
      value: undefined,
      group: undefined
    });
    const division = this.divisionAll.filter(element => {
      return element.group === value;
    });
    if (division.length) {
      this.checkDivision = true;
      this.countDivision = division.length;
      division.forEach(element => {
        this.divisionOptions.push(element);
      });
      this.filteredList3 = this.divisionOptions.slice();
    } else {
      this.checkDivision = false;
      this.countDivision = 0;
    }
  }

  onChangeDepartmentAfter(value) {
    this.divisionOptions = [];
    this.divisionOptions.push({
      label: '- Select Division -',
      value: undefined,
      group: undefined
    });
    if (this.divisionAll) {
      const division = this.divisionAll.filter(element => {
        return element.group === value;
      });
      if (division.length) {
        this.checkDivision = true;
        this.countDivision = division.length;
        division.forEach(element => {
          this.divisionOptions.push(element);
        });
        this.filteredList3 = this.divisionOptions.slice();
      } else {
        this.checkDivision = false;
        this.countDivision = 0;
      }
    }
  }


  getDetail() {
    this.service.getDetail(this._id, this.isUser).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.topicOption = response.data.exams;
        this.examName = response.data.name;
        this.duration = response.data.duration;
        this.departmentId = response.data.departmentId;
        this.divisionId = response.data.divisionId;
        this.allowAll = response.data.allowAll;
        this.onChangeDepartmentAfter(this.departmentId)
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
        this.service.create(this.topicOption, this.departmentId, this.divisionId, this.examName, this.duration, this.allowAll).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/employer/setting/exam-online']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        })
      } else {
        this.service.edit(this.topicOption, this.departmentId, this.divisionId, this.examName, this._id, this.duration, this.allowAll).subscribe(response => {
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
    if (!this.departmentId) {
      this.touchedDep = true;
      isValid = false;
      this.sErrorDe = MESSAGE[140];
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
