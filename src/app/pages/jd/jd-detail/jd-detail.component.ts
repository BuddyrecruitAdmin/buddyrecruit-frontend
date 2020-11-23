import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { JdService } from '../jd.service';
import { ResponseCode, State } from '../../../shared/app.constants';
import { getRole, setAllList, setAllListName } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DropDownValue, DropDownGroup, Devices } from '../../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { DropdownService } from '../../../shared/services/dropdown.service';
import * as _ from 'lodash';
import { MESSAGE } from '../../../shared/constants/message';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload/ng2-file-upload';
import { Subject } from 'rxjs/Subject';
import { API_ENDPOINT } from '../../../shared/constants';
import { environment } from '../../../../environments/environment';
import { saveAs } from "file-saver";
const URL = environment.API_URI + "/" + API_ENDPOINT.FILE.UPLOAD;
import { PopupSearchDropdownComponent } from '../../../component/popup-search-dropdown/popup-search-dropdown.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { questBlueVan, questBlueBike, questGeneral } from '../questionBlue'
@Component({
  selector: 'ngx-jd-detail',
  templateUrl: './jd-detail.component.html',
  styleUrls: ['./jd-detail.component.scss'],
})
export class JdDetailComponent implements OnInit {
  jd: any;
  role: any;
  countDivision: any;
  touched: boolean;
  touchedJobPo: boolean;
  touchedJobMail: boolean;
  touchedCV: boolean;
  touchedDep: boolean;
  touchedDi: boolean;
  touchedOut: boolean;
  isChecked: boolean;
  isAddHard: boolean;
  isAddSoft: boolean;
  isAddCert: boolean;
  isAddWork: boolean;
  checkCondition: boolean;
  checkMax: boolean;
  sTotal: any;
  hardTotal: any;
  softTotal: any;
  certificateTotal: any;
  eduTotal: any;
  iTotalSoftSkill: number;
  iTotalHardSkill: number;
  iTotalCertificate: number;
  fileToUpload: File;
  modeEditable: boolean;
  keyword: string;
  dialogRef: NbDialogRef<any>;
  positionMaster: DropDownValue[];
  jobTypeList: any;
  filteredList: any;
  departMentAdmin: DropDownValue[];
  filteredList2: any;
  divisionOptions: DropDownGroup[];
  divisionAll: DropDownGroup[];
  filteredList3: any;
  alertType: string;
  alertMessage: string;
  private _alertMessage = new Subject<string>();
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'jd' });
  bHasFile: boolean;
  state: string;
  _id: string;
  sErrorPosition: string;
  sErrorrefCheck: string;
  SErrorAll: string;
  sErrorBox: string;
  sErrorBoxW: string;
  sErrorBoxC: string;
  checkZeroC: any;
  checkDupC: any;
  sErrorBoxS: string;
  checkZeroS: any;
  checkDupS: any;
  sErrorBoxH: string;
  checkZeroH: any;
  checkDupH: any;
  sErrorKey: string;
  sErrorDe: string;
  tScore: any;
  wCheck: any;
  TempEdu: any;
  TempCer: any;
  TempHard: any;
  TempSoft: any;
  TempWork: any;
  checkPreview: boolean;
  innerWidth: any;
  innerHeight: any;
  checkDivision: boolean;
  sErrorDivision: string;
  devices: Devices;
  isExpress = false;
  isHybrid = false;
  editorConfig: AngularEditorConfig = {
    editable: false,
    showToolbar: false,
  }
  formGroup: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  questionList: any;
  questionGene: any;
  constructor(
    private service: JdService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dropdownService: DropdownService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.8;
    this.isExpress = this.role.refCompany.isExpress;
    this.isHybrid = this.role.refCompany.isHybrid || false;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.jd = this.initialModel();
    this.initialForm();
    this.checkDivision = false;
    this.bHasFile = false;
    this.modeEditable = true;
    this.fileToUpload = null;
    this.sTotal = 0;
    this.hardTotal = 0;
    this.softTotal = 0;
    this.certificateTotal = 0;
    this.eduTotal = 0;
    this.wCheck = 0;
    this.isAddHard = false;
    this.isAddSoft = false;
    this.isAddCert = false;
    this.isAddWork = false;
    this.initialDropdown().then((response) => {
      this.activatedRoute.params.subscribe(params => {
        if (params.id) {
          this._id = params.id;
          if (params.action === "edit") {
            this.state = State.Edit;
          } else if (params.action === "duplicate") {
            this.state = State.Duplicate;
          } else {
            this.state = "View";
            this.checkPreview = true;
            this.formGroup.disable();
          }
          this.getDetail();
        } else {
          this.state = State.Create;
          this.TempCer = _.cloneDeep(this.jd.weightScore.certificate.weight);
          this.TempHard = _.cloneDeep(this.jd.weightScore.hardSkill.weight);
          this.TempSoft = _.cloneDeep(this.jd.weightScore.softSkill.weight);
          this.TempWork = _.cloneDeep(this.jd.weightScore.workExperience.weight);
          this.TempEdu = _.cloneDeep(this.jd.weightScore.education.weight);
          this.jd.departmentId = this.role.departmentId || undefined;
          if (this.jd.departmentId) {
            this.onChangeDepartment(this.jd.departmentId)
          }
        }
      });
    });
  }

  initialModel(): any {
    return {
      _id: undefined,
      position: undefined,
      refPosition: undefined,
      departmentId: undefined,
      divisionId: undefined,
      publicJobName: {
        th: '',
        en: ''
      },
      // keywordSearch: [],
      weightScore: {
        workExperience: {
          weight: [],
          total: 0,
        },
        education: {
          weight: [],
          total: 0,
        },
        hardSkill: {
          weight: [],
          total: 0,
        },
        softSkill: {
          weight: [],
          total: 0,
        },
        certificate: {
          weight: [],
          total: 0,
        },

      },
      attachment: {
        originalname: undefined,
        uploadName: undefined,
      },
      group: undefined,
      refJobType: {
        _id: undefined
      }
    }
  }

  initialForm() {
    this.formGroup = this.formBuilder.group({
      nameEN: [{ value: '', disabled: false }, [Validators.required]],
      nameTH: [{ value: '', disabled: false }, [Validators.required]],
      // nameEN: [{ value: '', disabled: false }, [Validators.pattern('^[a-zA-Z0-9- ]*$')]],
      // nameTH: [{ value: '', disabled: false }, [Validators.pattern('^[ก-ํ0-9- ]*$')]],
    });
  }

  get f() { return this.formGroup.controls; }

  async initialDropdown() {
    if (this.isHybrid) {
      await this.getJobType();
    }
    // await this.getPosition();
    // await this.getDepartment();
    // await this.getEducation();
  }

  getJobType() {
    return new Promise((resolve) => {
      this.jobTypeList = [];
      this.dropdownService.getJobType().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            response.data.forEach(element => {
              this.jobTypeList.push({
                label: element.name.en,
                value: element._id,
                type: element.type
              })
            });
          }
        }
        resolve();
      });
    })
  }

  getPosition() {
    return new Promise((resolve) => {
      this.positionMaster = [];
      this.positionMaster.push({
        label: "- Select Position -",
        value: undefined
      });
      this.dropdownService.getPosition().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            response.data.forEach(element => {
              this.positionMaster.push({
                label: element.name,
                value: element._id
              });
            });
            this.positionMaster.sort(function (a, b) {
              if (a.label < b.label) {
                return -1;
              }
              if (a.label > b.label) {
                return 1;
              }
              return 0;
            });
            this.filteredList = this.positionMaster.slice();
          }
        }
        resolve();
      });
    });
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

  getEducation() {
    return new Promise((resolve) => {
      this.service.getEducationList().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            this.jd.weightScore.education.weight = response.data;
            this.TempEdu = _.cloneDeep(this.jd.weightScore.education.weight);
          }
        }
        resolve();
      });
    });
  }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.jd = response.data;
          if (this.jd.department_id) {
            this.getDepartmentName(this.jd.department_id, this.jd);
          }
          if (!this.jd.refJobType) {
            this.jd.refJobType = {
              _id: undefined
            }
          }
          //  Set Question
          if (this.isHybrid) {
            this.getQuestionList();
            // this.jd.questions.forEach(element => {
            //   if(element.question_no === 'qa3013') { 
            //     element.question.en = "Is there a recommender working in this company？";
            //   }
            // });
            if (this.jd.questions.length !== this.questionList.length) {
              // let tempQuestion = this.jd.questions;
              this.questionList.forEach(element => {
                this.jd.questions.forEach(quest => {
                  if (element.question_no === quest.question_no) {
                    element.isWeightScore = quest.isWeightScore;
                    element.options.forEach(option => {
                      quest.options.forEach(queso => {
                        if (option.val === queso.val) {
                          option.score = queso.score;
                        }
                      });
                    });
                  }
                });
              });
            } else {
              this.questionList = this.jd.questions;
            }
          }
          // this.jd.weightScore.education.weight.map((ele, i) => {
          //   ele.name = this.TempEdu[i].name;
          // })
          // this.TempEdu = _.cloneDeep(this.jd.weightScore.education.weight);
          // this.TempCer = _.cloneDeep(this.jd.weightScore.certificate.weight);
          // this.TempHard = _.cloneDeep(this.jd.weightScore.hardSkill.weight);
          // this.TempSoft = _.cloneDeep(this.jd.weightScore.softSkill.weight);
          // this.TempWork = _.cloneDeep(this.jd.weightScore.workExperience.weight);
          // if (this.jd.weightScore.workExperience.total > 0) {
          //   this.isAddWork = true;
          // }
          // if (this.jd.weightScore.softSkill.total > 0) {
          //   this.isAddSoft = true;
          // }
          // if (this.jd.weightScore.hardSkill.total > 0) {
          //   this.isAddHard = true;
          // }
          // if (this.jd.weightScore.certificate.total > 0) {
          //   this.isAddCert = true;
          // }
          // this.onChangeDepartmentAfter(this.jd.departmentId)
          // this.calculateTotal();
          // this.onChangePercentCertificate();
          // this.onChangePercentHardSkill();
          // this.onChangePercentSoftSkill();
        }
      }
    });
  }

  getQuestionList(event: any = undefined) {
    if (event) {
      this.jd.refJobType.type = event;
    }
    this.questionGene = JSON.parse(JSON.stringify(questGeneral));
    switch (this.jd.refJobType.type) {
      case 1:
        this.questionList = JSON.parse(JSON.stringify(questBlueBike));
        this.questionList = this.questionList.concat(this.questionGene);
        break;
      case 2:
        this.questionList = JSON.parse(JSON.stringify(questBlueVan));
        this.questionList = this.questionList.concat(this.questionGene);
        break;
      default:
        this.questionList = this.questionGene;
        break;
    }
  }

  getDepartmentName(arr, item) {
    item.divisionName = arr.val || '';
    // if (arr.list.length > 0) {
    //   arr.list.forEach((ele, i) => {
    //     if (i === 0) {
    //       item.departmentName = ele.val || '';
    //       if (ele.list.length > 0) {
    //         ele.list.forEach((data, j) => {
    //           if (j === 0) {
    //             item.sectionName = data.val || '';
    //           }
    //         });
    //       }
    //     }
    //   });
    // }
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

  onHandleFileInput(files: FileList) {
    const FileSize = files.item(0).size / 1024 / 1024; // in MB
    if (FileSize > 10) {
      this.setAlertMessage("E", MESSAGE[121]);
      this.bHasFile = false;
      this.jd.attachment.originalname = "";
      this.jd.attachment.uploadName = "";
      this.fileToUpload = null;
      return;
    } else {
      this.bHasFile = true;
      this.jd.attachment.originalname = files.item(0).name;
      this.jd.attachment.uploadName = "";
      this.fileToUpload = files.item(0);
      this.alertMessage = null;
    }
  }

  setAlertMessage(type: string, message: string) {
    this._alertMessage.next(message); // build message
    switch (type) {
      case "S": {
        this.alertType = "success";
        break;
      }
      case "E": {
        this.alertType = "danger";
        break;
      }
      case "W": {
        this.alertType = "warning";
        break;
      }
      case "I": {
        this.alertType = "info";
        break;
      }
    }
  }

  clearAttachFile() {
    this.bHasFile = false;
    this.jd.attachment.originalname = "";
    this.jd.attachment.uploadName = "";
  }

  onChangeScore(event, option) {
    switch (option) {
      case "WORKEXP": {
        this.jd.weightScore.workExperience.total = parseFloat(event.target.value);
        if (this.jd.weightScore.workExperience.total > 0) {
          this.isAddWork = true;
        } else {
          this.isAddWork = false;
        }
        break;
      }
      case "EDUCATION": {
        this.jd.weightScore.education.total = parseFloat(event.target.value);
        break;
      }
      case "HARDSKILL": {
        this.jd.weightScore.hardSkill.total = parseFloat(event.target.value);
        if (this.jd.weightScore.hardSkill.total > 0) {
          this.isAddHard = true;
        } else {
          this.isAddHard = false;
        }
        break;
      }
      case "SOFTSKILL": {
        this.jd.weightScore.softSkill.total = parseFloat(event.target.value);
        if (this.jd.weightScore.softSkill.total > 0) {
          this.isAddSoft = true;
        } else {
          this.isAddSoft = false;
        }
        break;
      }
      case "CERTIFICATE": {
        this.jd.weightScore.certificate.total = parseFloat(event.target.value);
        if (this.jd.weightScore.certificate.total > 0) {
          this.isAddCert = true;
        } else {
          this.isAddCert = false;
        }
        break;
      }
      default: {
      }
    }
    this.calculateTotal();
  }

  open(dialog: TemplateRef<any>) {
    this.devices = this.utilitiesService.getDevice();
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  }

  addOption(option: string) {
    switch (option) {
      case "WORKEXP": {
        if (this.jd.weightScore.workExperience.weight.length > 0) {
          let i;
          i = this.jd.weightScore.workExperience.weight.length - 1;
          this.jd.weightScore.workExperience.weight.push({
            low: this.jd.weightScore.workExperience.weight[i].high,
            high: 0,
            percent: 0,
            flagError: false
          });
        } else {
          this.jd.weightScore.workExperience.weight.push({
            low: 0,
            high: 0,
            percent: 0,
            flagError: false
          });
        }
        break;
      }
      case "HARDSKILL": {
        this.jd.weightScore.hardSkill.weight.push({
          skill: "",
          percent: 0,
          keyword: []
        });
        break;
      }
      case "SOFTSKILL": {
        this.jd.weightScore.softSkill.weight.push({
          skill: "",
          percent: 0,
          keyword: []
        });
        break;
      }
      case "CERTIFICATE": {
        this.jd.weightScore.certificate.weight.push({
          name: "",
          percent: 0,
          keyword: []
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  deleteOption(index: number, option: string) {
    switch (option) {
      case "WORKEXP": {
        this.jd.weightScore.workExperience.weight.splice(index, 1);
        break;
      }
      case "HARDSKILL": {
        const percent = this.jd.weightScore.hardSkill.weight[index].percent;
        this.iTotalHardSkill -= percent;
        if (isNaN(this.iTotalHardSkill)) {
          this.iTotalHardSkill = 0;
        }
        this.jd.weightScore.hardSkill.weight.splice(index, 1);

        break;
      }
      case "SOFTSKILL": {
        const percent = this.jd.weightScore.softSkill.weight[index].percent;
        this.iTotalSoftSkill -= percent;
        if (isNaN(this.iTotalSoftSkill)) {
          this.iTotalSoftSkill = 0;
        }
        this.jd.weightScore.softSkill.weight.splice(index, 1);
        break;
      }
      case "CERTIFICATE": {
        const percent = this.jd.weightScore.certificate.weight[index].percent;
        this.iTotalCertificate -= percent;
        if (isNaN(this.iTotalSoftSkill)) {
          this.iTotalSoftSkill = 0;
        }
        this.jd.weightScore.certificate.weight.splice(index, 1);
        break;
      }
      default: {
        break;
      }
    }
  }

  save(option) {
    this.touched = true;
    this.touchedOut = true;
    switch (option) {
      case "EDUCATION": {
        let checkMax = false;
        let checkEqual = false;
        if (this.jd.weightScore.education.total != 0) {
          const eScore = this.jd.weightScore.education.total; //check outside
          this.jd.weightScore.education.weight.map((element) => {
            if (element.percent === eScore) {
              checkEqual = true;
              this.eduTotal = element.percent;
            }
            if (element.percent > eScore) {
              checkMax = true;
            }
            if (element.percent === null) {
              element.percent = 0;
            }
          })
          if (checkMax) {
            this.sErrorBox = MESSAGE[87];
            this.sErrorBox = this.sErrorBox.replace("#1", eScore.toString())
          } else if (!checkEqual) {
            this.sErrorBox = MESSAGE[122];
          } else {
            this.TempEdu = _.cloneDeep(this.jd.weightScore.education.weight);
            this.touched = false;
            this.dialogRef.close();
          }
        } else {
          this.jd.weightScore.education.weightScore = _.cloneDeep(this.TempEdu)
          this.touched = false;
          this.dialogRef.close();
        }
        break;
      }
      case "WORKEXP": {
        this.checkCondition = true;
        this.checkMax = false;
        this.jd.weightScore.workExperience.weight.sort(function (a, b) {
          return a.low - b.low;
        });
        if (this.jd.weightScore.workExperience.total != 0) {
          let i = 0;
          for (i = 0; i < this.jd.weightScore.workExperience.weight.length; i++) {
            if (this.jd.weightScore.workExperience.weight[i].low === null) {
              this.jd.weightScore.workExperience.weight[i].low = 0;
            }
            if (this.jd.weightScore.workExperience.weight[i].high === null) {
              this.jd.weightScore.workExperience.weight[i].high = 0;
            }
            if (this.jd.weightScore.workExperience.weight[i].percent === null) {
              this.jd.weightScore.workExperience.weight[i].percent = 0;
            }
            if (this.jd.weightScore.workExperience.weight[i].percent > this.jd.weightScore.workExperience.total) {
              this.checkCondition = false;
              this.sErrorBoxW = MESSAGE[64];
            }
            if (i > 0) {
              if (this.jd.weightScore.workExperience.weight[i - 1].high != this.jd.weightScore.workExperience.weight[i].low) {
                this.checkCondition = false;
                this.sErrorBoxW = MESSAGE[65];
              }
            }
            if (this.jd.weightScore.workExperience.weight[i].low === this.jd.weightScore.workExperience.weight[i].high ||
              this.jd.weightScore.workExperience.weight[i].high < this.jd.weightScore.workExperience.weight[i].low
            ) {
              this.checkCondition = false;
              this.sErrorBoxW = MESSAGE[62];
            } else if (this.jd.weightScore.workExperience.weight[i].percent === 0) {
              this.checkCondition = false;
              this.sErrorBoxW = MESSAGE[63];
            } else if (this.jd.weightScore.workExperience.weight[i].percent === this.jd.weightScore.workExperience.total) {
              this.checkMax = true;
              this.wCheck = this.jd.weightScore.workExperience.weight[i].percent;
            }
          }
          if (this.checkCondition === true) {
            if (this.checkMax === true) {
              this.TempWork = _.cloneDeep(this.jd.weightScore.workExperience.weight);
              this.touched = false;
              this.dialogRef.close();
            } else {
              this.sErrorBoxW = MESSAGE[122];
            }
          }
        } else {
          this.touched = false;
          this.dialogRef.close();
        }

        break;
      }
      case "HARDSKILL": {
        let hTotal = 0;
        this.isChecked = true;
        this.checkZeroS = false;
        this.checkDupS = false;
        if (this.jd.weightScore.hardSkill.total != 0) {
          const hScore = this.jd.weightScore.hardSkill.total;
          this.jd.weightScore.hardSkill.weight.map((element, index) => {
            hTotal += element.percent;
            if (element.percent === null) {
              element.percent = 0;
            }
            this.jd.weightScore.hardSkill.weight.map((ele, i) => {
              if (index != i) {
                if (element.skill === ele.skill) {
                  this.isChecked = false;
                  this.checkDupH = true;
                }
              }
            })
          })
          this.hardTotal = hTotal;
          let i = 0;
          for (i = 0; i < this.jd.weightScore.hardSkill.weight.length; i++) {
            if (this.jd.weightScore.hardSkill.weight[i].skill === "" ||
              this.jd.weightScore.hardSkill.weight[i].percent === 0 ||
              this.jd.weightScore.hardSkill.weight[i].keyword.length === 0
            ) {
              this.isChecked = false;
              if (this.jd.weightScore.hardSkill.weight[i].percent === 0) {
                this.checkZeroH = true;
              } else {
                this.sErrorBoxH = MESSAGE[53];
              }
            }
          }
          //final close
          if (this.isChecked) {
            if (hTotal != hScore) {
              this.sErrorBoxH = MESSAGE[69];
              this.sErrorBoxH = this.sErrorBoxH.replace("#1", hScore.toString())
            } else {
              this.TempHard = _.cloneDeep(this.jd.weightScore.hardSkill.weight);
              this.touched = false;
              this.dialogRef.close();
            }
          } else if (this.checkZeroH) {
            this.sErrorBoxH = MESSAGE[73];
          } else if (this.checkDupH) {
            this.sErrorBoxH = MESSAGE[72];
          }
        } else {
          this.touched = false;
          this.dialogRef.close();
        }
        break;
      }
      case "SOFTSKILL": {
        let softTotal = 0;
        this.isChecked = true;
        this.checkZeroS = false;
        this.checkDupS = false;
        if (this.jd.weightScore.softSkill.total != 0) {
          const sScore = this.jd.weightScore.softSkill.total;
          this.jd.weightScore.softSkill.weight.map((element, index) => {
            softTotal += element.percent;
            if (element.percent === null) {
              element.percent = 0;
            }
            this.jd.weightScore.softSkill.weight.map((ele, i) => {
              if (index != i) {
                if (element.skill === ele.skill) {
                  this.isChecked = false;
                  this.checkDupS = true;
                }
              }
            })
          })
          this.softTotal = softTotal;
          let i = 0;
          for (i = 0; i < this.jd.weightScore.softSkill.weight.length; i++) {
            if (this.jd.weightScore.softSkill.weight[i].skill === "" ||
              this.jd.weightScore.softSkill.weight[i].percent === 0 ||
              this.jd.weightScore.softSkill.weight[i].keyword.length === 0
            ) {
              this.isChecked = false;
              if (this.jd.weightScore.softSkill.weight[i].percent === 0) {
                this.checkZeroS = true;
              } else {
                this.sErrorBoxS = MESSAGE[53];
              }
            }
          }
          //final close
          if (this.isChecked) {
            if (softTotal != sScore) {
              this.sErrorBoxS = MESSAGE[74];
              this.sErrorBoxS = this.sErrorBoxS.replace("#1", sScore.toString())
            } else {
              this.TempSoft = _.cloneDeep(this.jd.weightScore.softSkill.weight);
              this.touched = false;
              this.dialogRef.close();
            }
          } else if (this.checkZeroS) {
            this.sErrorBoxS = MESSAGE[77];
          } else if (this.checkDupS) {
            this.sErrorBoxS = MESSAGE[76];
          }
        } else {
          this.touched = false;
          this.dialogRef.close();
        }
        break;
      }
      case "CERTIFICATE": {
        let cTotal = 0;
        this.isChecked = true;
        this.checkZeroC = false;
        this.checkDupC = false;
        if (this.jd.weightScore.certificate.total != 0) {
          const cScore = this.jd.weightScore.certificate.total;
          this.jd.weightScore.certificate.weight.map((element, index) => {
            cTotal += element.percent;
            if (element.percent === null) {
              element.percent = 0;
            }
            this.jd.weightScore.certificate.weight.map((ele, i) => {
              if (index != i) {
                if (element.name === ele.name) {
                  this.isChecked = false;
                  this.checkDupC = true;
                }
              }
            })
          })
          this.certificateTotal = cTotal;
          let i = 0;
          for (i = 0; i < this.jd.weightScore.certificate.weight.length; i++) {
            if (this.jd.weightScore.certificate.weight[i].name === "" ||
              this.jd.weightScore.certificate.weight[i].percent === 0 ||
              this.jd.weightScore.certificate.weight[i].keyword.length === 0
            ) {
              this.isChecked = false;
              if (this.jd.weightScore.certificate.weight[i].percent === 0) {
                this.checkZeroC = true;
              } else {
                this.sErrorBoxC = MESSAGE[53];
              }
            }
          }
          //final close
          if (this.isChecked) {
            if (cTotal != cScore) {
              this.sErrorBoxC = MESSAGE[78];
              this.sErrorBoxC = this.sErrorBoxC.replace("#1", cScore.toString())
            } else {
              this.TempCer = _.cloneDeep(this.jd.weightScore.certificate.weight);
              this.touched = false;
              this.dialogRef.close();
            }
          } else if (this.checkZeroC) {
            this.sErrorBoxC = MESSAGE[81];
          } else if (this.checkDupC) {
            this.sErrorBoxC = MESSAGE[80];
          }
        } else {
          this.touched = false;
          this.dialogRef.close();
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  close(option) {
    switch (option) {
      case "EDUCATION": {
        //ต้องเกบ temp เข้าไปด้วย
        this.jd.weightScore.education.weight = _.cloneDeep(this.TempEdu);
        this.sErrorBox = "";
        this.dialogRef.close();
        break;
      }
      case "CERTIFICATE": {
        this.jd.weightScore.certificate.weight = _.cloneDeep(this.TempCer);
        this.sErrorBoxC = "";
        this.dialogRef.close();
        break;
      }
      case "HARDSKILL": {
        this.jd.weightScore.hardSkill.weight = _.cloneDeep(this.TempHard);
        this.sErrorBoxH = "";
        this.dialogRef.close();
        break;
      }
      case "SOFTSKILL": {
        this.jd.weightScore.softSkill.weight = _.cloneDeep(this.TempSoft);
        this.sErrorBoxS = "";
        this.dialogRef.close();
        break;
      }
      case "WORKEXP": {
        this.jd.weightScore.workExperience.weight = _.cloneDeep(this.TempWork);
        this.sErrorBoxW = "";
        this.dialogRef.close();
        break;
      }
      default: {
        break;
      }
    }
  }

  saveAll() {
    if (this.bHasFile) {
      this.uploader.uploadItem(
        this.uploader.queue[this.uploader.queue.length - 1]
      );
      this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    } else
      if (this.Validation()) {
        const request = this.setRequest();
        const confirm = this.matDialog.open(PopupMessageComponent, {
          width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
          data: { type: 'C' }
        });
        confirm.afterClosed().subscribe(result => {
          if (result) {
            if (this.state === State.Create) {
              this.service.create(request).subscribe(response => {
                if (response.code === ResponseCode.Success) {
                  this.showToast('success', 'Success Message', response.message);
                  this.router.navigate(['/employer/jd/list']);
                } else {
                  this.showToast('danger', 'Error Message', response.message);
                }
              });
            }
            // here
            if (this.state === State.Edit) {
              this.service.edit(request).subscribe(response => {
                if (response.code === ResponseCode.Success) {
                  this.showToast('success', 'Success Message', response.message);
                  this.router.navigate(['/employer/jd/list']);
                } else {
                  this.showToast('danger', 'Error Message', response.message);
                }
              });
            }
            if (this.state === State.Duplicate) {
              this.service.create(request).subscribe(response => {
                if (response.code === ResponseCode.Success) {
                  this.showToast('success', 'Success Message', response.message);
                  this.router.navigate(['/employer/jd/list']);
                } else {
                  this.showToast('danger', 'Error Message', response.message);
                }
              });
            }
          }
        });
      }
  }

  onChanheWork(i: any) {
    if (this.jd.weightScore.workExperience.weight.length > 1) {
      if (i + 1 != this.jd.weightScore.workExperience.weight.length) {
        this.jd.weightScore.workExperience.weight[i + 1].low = this.jd.weightScore.workExperience.weight[i].high;
      }
    }
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response); //success server response
    this.jd.attachment.uploadName = data.uploadname;
    this.bHasFile = false;
    this.saveAll();
  }

  downloadFilePress() {
    if (this.jd.attachment.uploadName && this.jd.attachment.originalname) {
      this.service
        .downloadFile(this.jd.attachment.uploadName)
        .subscribe(data => this.downloadFile(data), function (error) {
          this.alertType = "danger";
          this.alertMessage = error;
        });
    }
  }

  downloadFile(data: any) {
    saveAs(data, this.jd.attachment.originalname);
  }

  openSearch(dataList: any, nameField: string, field: any) {
    setAllList(dataList);
    setAllListName(nameField);
    this.dialogService.open(PopupSearchDropdownComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      if (result.value) {
        switch (field) {
          case 'job':
            this.jd.refPosition = result.value;
            break;
          case 'department':
            this.jd.departmentId = result.value;
            break;
          case 'division':
            this.jd.divisionId = result.value;
            break;
          default:
            break;
        }
      }
    })
  }

  Validation(): boolean {
    this.touched = true;
    this.touchedJobPo = false;
    this.touchedJobMail = false;
    this.touchedCV = false;
    this.touchedDep = false;
    this.touchedDi = false;
    let isValid = true;
    this.SErrorAll = "";
    this.checkValue();
    if (!this.jd.position) {
      this.touchedJobPo = true;
      isValid = false;
      this.sErrorPosition = MESSAGE[141];
      this.SErrorAll = this.SErrorAll || MESSAGE[141];
    }
    if (!this.jd.refPosition) {
      this.touchedJobMail = true;
      isValid = false;
      this.sErrorrefCheck = MESSAGE[139];
      this.SErrorAll = this.SErrorAll || MESSAGE[139];
    }
    // if (this.role.refCompany.activeJobsDB) {
    //   if (this.jd.keywordSearch.length === 0) {
    //     this.touchedCV = true;
    //     isValid = false;
    //     this.sErrorKey = MESSAGE[138];
    //     this.SErrorAll = this.SErrorAll || "Please press enter keyword to search in CV";
    //   }
    // }
    if (!this.jd.departmentId) {
      this.touchedDep = true;
      isValid = false;
      this.sErrorDe = MESSAGE[140];
      this.SErrorAll = this.SErrorAll || MESSAGE[140];
    }
    if (this.countDivision > 0) {
      if (!this.jd.divisionId) {
        this.touchedDi = true;
        isValid = false;
        this.sErrorDivision = MESSAGE[158];
        this.SErrorAll = this.SErrorAll || MESSAGE[158];
      }
    }
    if (!this.isHybrid) {
      if (this.state === State.Edit || this.state === "duplicate") {
        if (this.jd.weightScore.certificate.total != 0) {
          this.certificateTotal = 0;
          this.jd.weightScore.certificate.weight.map((element) => {
            this.certificateTotal += element.percent;
          })
        }
        if (this.jd.weightScore.hardSkill.total != 0) {
          this.hardTotal = 0;
          this.jd.weightScore.hardSkill.weight.map((element) => {
            this.hardTotal += element.percent;
          })
        }
        if (this.jd.weightScore.softSkill.total != 0) {
          this.softTotal = 0;
          this.jd.weightScore.softSkill.weight.map((element) => {
            this.softTotal += element.percent;
          })
        }
        if (this.jd.weightScore.education.total != 0) {
          this.eduTotal = 0;
          this.jd.weightScore.education.weight.map((element) => {
            if (this.jd.weightScore.education.total === element.percent) {
              this.eduTotal = element.percent;
            }
          })
        }
        if (this.jd.weightScore.workExperience.total != 0) {
          this.wCheck = 0;
          this.jd.weightScore.workExperience.weight.map((element) => {
            if (this.jd.weightScore.workExperience.total === element.percent) {
              this.wCheck = element.percent;
            }
          })
        }
      }
      if (this.hardTotal != this.jd.weightScore.hardSkill.total) {
        isValid = false;
        this.SErrorAll = this.SErrorAll || MESSAGE[69];
      }
      if (this.softTotal != this.jd.weightScore.softSkill.total) {
        isValid = false;
        this.SErrorAll = this.SErrorAll || MESSAGE[74];
      }
      if (this.certificateTotal != this.jd.weightScore.certificate.total) {
        isValid = false;
        this.SErrorAll = this.SErrorAll || MESSAGE[78];
      }
      if (this.eduTotal != this.jd.weightScore.education.total) {
        isValid = false;
        this.SErrorAll = this.SErrorAll || "% of max education is not equal to total education score";

      }
      if (this.wCheck != this.jd.weightScore.workExperience.total) {
        isValid = false;
        this.SErrorAll = this.SErrorAll || "% of max work experience is not equal to total work experience score";
      }
      if (this.sTotal != 100) {
        isValid = false;
        this.SErrorAll = this.SErrorAll || MESSAGE[56];
      }
    }
    return isValid
  }

  setRequest(): any {
    if (this.jd.weightScore.certificate.weight.length > 0) {
      this.jd.weightScore.certificate.weight.map(weight => {
        if (weight.keyword.length) {
          weight.keyword = this.convertArray(weight.keyword);
        }
      });
    }
    if (this.jd.weightScore.softSkill.weight.length > 0) {
      this.jd.weightScore.softSkill.weight.map(weight => {
        if (weight.keyword.length) {
          weight.keyword = this.convertArray(weight.keyword);
        }
      });
    }
    if (this.jd.weightScore.hardSkill.weight.length > 0) {
      this.jd.weightScore.hardSkill.weight.map(weight => {
        if (weight.keyword.length) {
          weight.keyword = this.convertArray(weight.keyword);
        }
      });
    }
    // if (this.jd.keywordSearch.length > 0) {
    //   this.jd.keywordSearch = this.convertArray(this.jd.keywordSearch);
    // }
    this.jd.questions = this.questionList;
    this.jd.questions.forEach(element => {
      if (element.isWeightScore) {
        element.options.forEach(ele => {
          if (!ele.score) {
            ele.score = 0;
          }
        });
      }
    });
    if (this.state === State.Duplicate) {
      this.jd._id = undefined;
    }
    const request = _.cloneDeep(this.jd);
    return request;
  }

  convertArray(conA) {
    conA = conA.map(gobj => {  //array.object to array
      if (gobj.value) {
        return gobj = gobj.value;
      } else if (gobj) {
        return gobj;
      }
    })
    return conA;
  }

  calculateTotal() {
    this.checkValue();
    this.sTotal = this.jd.weightScore.workExperience.total +
      this.jd.weightScore.softSkill.total +
      this.jd.weightScore.hardSkill.total +
      this.jd.weightScore.education.total +
      this.jd.weightScore.certificate.total
  }

  checkValue() {
    if (!this.jd.weightScore.workExperience.total) {
      this.jd.weightScore.workExperience.total = 0;
    }
    if (!this.jd.weightScore.softSkill.total) {
      this.jd.weightScore.softSkill.total = 0;
    }
    if (!this.jd.weightScore.hardSkill.total) {
      this.jd.weightScore.hardSkill.total = 0;
    }
    if (!this.jd.weightScore.education.total) {
      this.jd.weightScore.education.total = 0;
    }
    if (!this.jd.weightScore.certificate.total) {
      this.jd.weightScore.certificate.total = 0;
    }
  }

  onChangePercentSoftSkill() {
    this.iTotalSoftSkill = 0;
    const that = this;
    this.jd.weightScore.softSkill.weight.map(function (item) {
      that.iTotalSoftSkill += item.percent;
    });
  }

  onChangePercentHardSkill() {
    this.iTotalHardSkill = 0;
    const that = this;
    this.jd.weightScore.hardSkill.weight.map(function (item) {
      that.iTotalHardSkill += item.percent;
    });
  }

  onChangePercentCertificate() {
    this.iTotalCertificate = 0;
    const that = this;
    this.jd.weightScore.certificate.weight.map(function (item) {
      that.iTotalCertificate += item.percent;
    });
  }

  back() {
    this.router.navigate(['/employer/jd/list']);
  }

  getProgressBarStatus() {
    if (this.sTotal <= 25) {
      return 'danger';
    } else if (this.sTotal <= 75) {
      return 'warning';
    } else if (this.sTotal < 100) {
      return 'info';
    } else if (this.sTotal === 100) {
      return 'success';
    } else {
      return 'danger';
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

  selectAll() {
    if (!this.checkPreview) {
      this.questionList.forEach(element => {
        element.isWeightScore = true;
      });
    }
  }

  unSelectAll() {
    if (!this.checkPreview) {
      this.questionList.forEach(element => {
        element.isWeightScore = false;
      });
    }
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
