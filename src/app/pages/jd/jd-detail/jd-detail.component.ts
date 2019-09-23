import { Component, OnInit, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { JdService } from '../jd.service';
import { ResponseCode, Paging, State } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging } from '../../../shared/interfaces/common.interface';
import { getRole } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DropDownValue, DropDownGroup } from '../../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MESSAGE } from '../../../shared/constants/message';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Subject } from 'rxjs/Subject';
import { API_ENDPOINT } from '../../../shared/constants';
import { environment } from '../../../../environments/environment';
import { saveAs } from "file-saver";
const URL = environment.API_URI + "/" + API_ENDPOINT.FILE.UPLOAD;
@Component({
  selector: 'ngx-jd-detail',
  templateUrl: './jd-detail.component.html',
  styleUrls: ['./jd-detail.component.scss'],
})
export class JdDetailComponent implements OnInit {
  jd: any;
  getEduList: any;
  role: any;
  countDivision: any;
  checkG: boolean;
  touched: boolean;
  isChecked: boolean;
  isAddHard: boolean;
  isAddSoft: boolean;
  isAddCert: boolean;
  isAddWork: boolean;
  checkCondition: boolean;
  checkMax: boolean;
  detailForm: FormGroup;
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
  departMentAdmin: DropDownValue[];
  divisionAdmin: DropDownValue[];
  divisionOptions: DropDownGroup[];
  divisionAll: DropDownGroup[];
  alertType: string;
  alertMessage: string;
  private _alertMessage = new Subject<string>();
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'jd' });
  bHasFile: boolean;
  staticAlertClosed = false;
  state: string;
  _id: string;
  positionCheck: AbstractControl;
  sErrorPosition: string;
  sErrorrefCheck: string;
  SErrorAll: string;
  sErrorBox: string;
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
  constructor(
    private service: JdService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.initialDropdown();
    this.initialModel();
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this._id = params.id;
        if (params.action === "edit") {
          this.state = State.Edit;
          this._id = params.id;
          this.getDetail();
        } else if (params.action === "duplicate") {
          this.state = "duplicate";
          this._id = params.id;
          this.getDetail();
        } else {
          this.state = "View";
          this.checkPreview = true;
          this.getDetail();
        }
      } else {
        this.state = State.Create;
        console.log(this.state)
        this.TempCer = _.cloneDeep(this.jd.weightScore.certificate.weight);
        this.TempHard = _.cloneDeep(this.jd.weightScore.hardSkill.weight);
        this.TempSoft = _.cloneDeep(this.jd.weightScore.softSkill.weight);
        this.TempWork = _.cloneDeep(this.jd.weightScore.workExperience.weight);
      }
    });
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
    // this.checkG = true;
    // this.initialCheck();
  }

  initialModel(): any {
    this.jd = {
      _id: undefined,
      position: undefined,
      refPosition: undefined,
      departmentId: undefined,
      divisionId: undefined,
      keywordSearch: [],
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
      }
    }
    return this.jd;
  }

  initialDropdown() {
    this.positionMaster = [];
    this.positionMaster.push({
      label: "- Select email Type -",
      value: undefined
    });
    this.service.getPositionList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          console.log(response.data)
          response.data.forEach(element => {
            this.positionMaster.push({
              label: element.name,
              value: element._id
            });
          });
        }
      }
    });
    if (this.role.refHero.isAdmin === true) {
      this.departMentAdmin = [];
      this.departMentAdmin.push({
        label: "- Select department Type -",
        value: undefined
      });
      this.divisionAll = [];
      this.divisionOptions = [];
      this.divisionOptions.push({
        label: '- Select Division -',
        value: undefined,
        group: undefined
      });
      this.service.getDepartmentList().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            console.log(response.data)
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
          }
        }
      });
    }
    this.service.getEducationList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.jd.weightScore.education.weight = response.data;
          this.TempEdu = _.cloneDeep(this.jd.weightScore.education.weight);
        }
      }
    })
  }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.jd = response.data;
          console.log(this.jd);
          this.TempEdu = _.cloneDeep(this.jd.weightScore.education.weight);
          this.TempCer = _.cloneDeep(this.jd.weightScore.certificate.weight);
          this.TempHard = _.cloneDeep(this.jd.weightScore.hardSkill.weight);
          this.TempSoft = _.cloneDeep(this.jd.weightScore.softSkill.weight);
          this.TempWork = _.cloneDeep(this.jd.weightScore.workExperience.weight);
          if (this.jd.weightScore.workExperience.total > 0) {
            this.isAddWork = true;
          }
          if (this.jd.weightScore.softSkill.total > 0) {
            this.isAddSoft = true;
          }
          if (this.jd.weightScore.hardSkill.total > 0) {
            this.isAddHard = true;
          }
          if (this.jd.weightScore.certificate.total > 0) {
            this.isAddCert = true;
          }
          this.onChangeDepartmentAfter(this.jd.departmentId)
          this.calculateTotal();
        }
      }
    });
  }

  onChangeDepartment(value) {
    this.divisionOptions = [];
    this.jd.divisionId = "";
    this.divisionOptions.push({
      label: '- Select Division -',
      value: undefined,
      group: undefined
    });
    const division = this.divisionAll.filter(element => {
      return element.group === value;
    });
    if (division.length) {
      this.countDivision = division.length;
      console.log(this.countDivision)
      division.forEach(element => {
        this.divisionOptions.push(element);
      });
    } else {
      this.countDivision = 0;
    }
  }

  onChangeDepartmentAfter(value) {
    this.divisionOptions = [];
    console.log(this.jd.departmentId)
    // this.jd.divisionId = "";
    this.divisionOptions.push({
      label: '- Select Division -',
      value: undefined,
      group: undefined
    });
    const division = this.divisionAll.filter(element => {
      return element.group === value;
    });
    console.log(this.jd.divisionId)
    if (division.length) {
      this.countDivision = division.length;
      console.log(this.countDivision)
      division.forEach(element => {
        this.divisionOptions.push(element);
      });
    } else {
      this.countDivision = 0;
    }
  }

  onHandleFileInput(files: FileList) {
    console.log(files)
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
    // if (event.target.value === "") {
    //   event.target.value = 0;
    // }
    switch (option) {
      case "WORKEXP": {
        this.jd.weightScore.workExperience.total = parseFloat(event.target.value);
        if (this.jd.weightScore.workExperience.total > 0) {
          this.isAddWork = true;
        } else {
          this.isAddWork = true;
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
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  }

  addOption(option: string) {
    switch (option) {
      case "WORKEXP": {
        this.jd.weightScore.workExperience.weight.push({
          low: 0,
          high: 0,
          percent: 0,
          flagError: false
        });
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
    switch (option) {
      case "EDUCATION": {
        let eTotal = 0;
        if (this.jd.weightScore.education.total != 0) {
          const eScore = this.jd.weightScore.education.total;
          this.jd.weightScore.education.weight.map((element) => {
            eTotal += element.percent;
            if (element.percent === null) {
              element.percent = 0;
            }
          })
          this.eduTotal = eTotal;
          if (eScore != eTotal) {
            this.sErrorBox = MESSAGE[53];
            this.eduTotal = 0;
          } else {
            this.TempEdu = _.cloneDeep(this.jd.weightScore.education.weight);
            this.touched = false;
            this.dialogRef.close();
          }
        } else {
          this.touched = false;
          this.dialogRef.close();
        }
        break;
      }
      case "WORKEXP": {
        this.checkCondition = true;
        this.checkMax = false;
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
            if (this.jd.weightScore.workExperience.weight[i].low === this.jd.weightScore.workExperience.weight[i].high ||
              this.jd.weightScore.workExperience.weight[i].percent === 0 ||
              this.jd.weightScore.workExperience.weight[i].high < this.jd.weightScore.workExperience.weight[i].low
            ) {
              this.checkCondition = false;
              this.sErrorBox = MESSAGE[53];
            } else if (this.jd.weightScore.workExperience.weight[i].percent != this.jd.weightScore.workExperience.total) {
              this.sErrorBox = MESSAGE[53];
            } else {
              this.checkMax = true;
              this.wCheck = this.jd.weightScore.workExperience.weight[i].percent;
            }
          }
          if (this.checkCondition === true) {
            if (this.checkMax === true) {
              this.TempWork = _.cloneDeep(this.jd.weightScore.workExperience.weight);
              this.touched = false;
              this.dialogRef.close();
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
        if (this.jd.weightScore.hardSkill.total != 0) {
          const hScore = this.jd.weightScore.hardSkill.total;
          this.jd.weightScore.hardSkill.weight.map((element) => {
            hTotal += element.percent;
            if (element.percent === null) {
              element.percent = 0;
            }
          })
          this.hardTotal = hTotal;
          let i = 0;
          for (i = 0; i < this.jd.weightScore.hardSkill.weight.length; i++) {
            if (this.jd.weightScore.hardSkill.weight[i].skill === "" ||
              this.jd.weightScore.hardSkill.weight[i].percent === 0 ||
              this.jd.weightScore.hardSkill.weight[i].keyword.length === 0
            ) {
              this.isChecked = false;
            }
          }
          //final close
          if (this.isChecked) {
            if (hTotal != hScore) {
              this.sErrorBox = MESSAGE[53];
            } else {
              this.TempHard = _.cloneDeep(this.jd.weightScore.hardSkill.weight);
              this.touched = false;
              this.dialogRef.close();
            }
          } else {
            this.sErrorBox = MESSAGE[53];
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
        if (this.jd.weightScore.softSkill.total != 0) {
          const sScore = this.jd.weightScore.softSkill.total;
          this.jd.weightScore.softSkill.weight.map((element) => {
            softTotal += element.percent;
            if (element.percent === null) {
              element.percent = 0;
            }
          })
          this.softTotal = softTotal;
          let i = 0;
          for (i = 0; i < this.jd.weightScore.softSkill.weight.length; i++) {
            if (this.jd.weightScore.softSkill.weight[i].skill === "" ||
              this.jd.weightScore.softSkill.weight[i].percent === 0 ||
              this.jd.weightScore.softSkill.weight[i].keyword.length === 0
            ) {
              this.isChecked = false;
            }
          }
          //final close
          if (this.isChecked) {
            if (softTotal != sScore) {
              this.sErrorBox = MESSAGE[53];
            } else {
              this.TempSoft = _.cloneDeep(this.jd.weightScore.softSkill.weight);
              this.touched = false;
              this.dialogRef.close();
            }
          } else {
            this.sErrorBox = MESSAGE[53];
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
        if (this.jd.weightScore.certificate.total != 0) {
          const cScore = this.jd.weightScore.certificate.total;
          this.jd.weightScore.certificate.weight.map((element) => {
            cTotal += element.percent;
            if (element.percent === null) {
              element.percent = 0;
            }
          })
          this.certificateTotal = cTotal;
          let i = 0;
          for (i = 0; i < this.jd.weightScore.certificate.weight.length; i++) {
            if (this.jd.weightScore.certificate.weight[i].name === "" ||
              this.jd.weightScore.certificate.weight[i].percent === 0 ||
              this.jd.weightScore.certificate.weight[i].keyword.length === 0
            ) {
              this.isChecked = false;
            }
          }
          //final close
          if (this.isChecked) {
            if (cTotal != cScore) {
              this.sErrorBox = MESSAGE[53];
            } else {
              this.TempCer = _.cloneDeep(this.jd.weightScore.certificate.weight);
              this.touched = false;
              this.dialogRef.close();
            }
          } else {
            this.sErrorBox = MESSAGE[53];
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
        this.dialogRef.close();
        break;
      }
      case "CERTIFICATE": {
        this.jd.weightScore.certificate.weight = _.cloneDeep(this.TempCer);
        this.dialogRef.close();
        break;
      }
      case "HARDSKILL": {
        this.jd.weightScore.hardSkill.weight = _.cloneDeep(this.TempHard);
        this.dialogRef.close();
        break;
      }
      case "SOFTSKILL": {
        this.jd.weightScore.softSkill.weight = _.cloneDeep(this.TempSoft);
        this.dialogRef.close();
        break;
      }
      case "WORKEXP": {
        this.jd.weightScore.workExperience.weight = _.cloneDeep(this.TempWork);
        this.dialogRef.close();
        break;
      }
      default: {
        break;
      }
    }
  }

  saveAll() {
    if (this.Validation()) {
      const request = this.setRequest();
      console.log(request);
      if (this.bHasFile) {
        this.uploader.uploadItem(
          this.uploader.queue[this.uploader.queue.length - 1]
        );
      }
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: '40%',
        data: { type: 'C' }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          if (this.state === State.Create) {
            this.service.create(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/jd/list']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          }
          if (this.state === State.Edit) {
            this.service.edit(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/jd/list']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          }
          if (this.state === "duplicate") {
            this.service.create(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/jd/list']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          }
        }
      });
    }
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

  Validation(): boolean {
    console.log(this.bHasFile);
    console.log(this.jd.divisionId)
    console.log(this.countDivision)
    this.touched = true;
    let isValid = true;
    this.SErrorAll = "";
    this.checkValue();
    if (this.jd.refPosition === null || this.jd.refPosition === undefined) {
      isValid = false;
      this.sErrorrefCheck = MESSAGE[139];
    } else {
      this.sErrorrefCheck = "";

    }
    if (this.jd.departmentId === null || this.jd.departmentId === undefined) {
      isValid = false;
      this.sErrorDe = MESSAGE[140];
    }
    if (this.countDivision > 0) {
      if (this.jd.divisionId === undefined || this.jd.divisionId === "" || this.jd.divisionId === null) {
        isValid = false;
      }
    }
    if (this.jd.keywordSearch.length === 0) {
      isValid = false;
      this.sErrorKey = MESSAGE[138];
    } else {
      this.sErrorKey = "";
    }
    if (this.sTotal != 100) {
      isValid = false;
      this.SErrorAll = MESSAGE[53];
    }
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
          this.eduTotal += element.percent;
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
      this.SErrorAll = MESSAGE[69];
    }
    if (this.softTotal != this.jd.weightScore.softSkill.total) {
      isValid = false;
      this.SErrorAll = MESSAGE[74];
    }
    if (this.certificateTotal != this.jd.weightScore.certificate.total) {
      isValid = false;
      this.SErrorAll = MESSAGE[78];
    }
    if (this.eduTotal != this.jd.weightScore.education.total) {
      isValid = false;
      this.SErrorAll = MESSAGE[66];

    }
    if (this.wCheck != this.jd.weightScore.workExperience.total) {
      isValid = false;
      this.SErrorAll = MESSAGE[64];
    }
    return isValid
  }

  setRequest(): any {
    if (this.jd.weightScore.certificate.weight.length > 0) {
      this.convertArray(this.jd.weightScore.certificate.weight);
    }
    if (this.jd.weightScore.softSkill.weight.length > 0) {
      this.convertArray(this.jd.weightScore.softSkill.weight);
    }
    if (this.jd.weightScore.hardSkill.weight.length > 0) {
      this.convertArray(this.jd.weightScore.hardSkill.weight);
    }
    if (this.jd.keywordSearch.length > 0) {
      this.jd.keywordSearch = this.jd.keywordSearch.map(gobj => {  //array.object to array
        if (gobj.value) {
          gobj = gobj.value;
          return gobj;
        }
        return gobj;
      })
    }
    if (this.state === "duplicate") {
      this.jd._id = undefined;
    }
    const request = _.cloneDeep(this.jd);
    return request;
  }

  convertArray(conA) {
    conA.map(gobj => {  //array.object to array
      gobj = gobj.keyword.map(mobj => {
        if (mobj.value) {
          mobj = mobj.value;
          return mobj;
        }
        return mobj;
      })
    })
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
    if (isNaN(this.jd.weightScore.workExperience.total) || this.jd.weightScore.workExperience.total === null) {
      this.jd.weightScore.workExperience.total = 0;
    }
    if (isNaN(this.jd.weightScore.softSkill.total) || this.jd.weightScore.softSkill.total === null) {
      this.jd.weightScore.softSkill.total = 0;
    }
    if (isNaN(this.jd.weightScore.hardSkill.total) || this.jd.weightScore.hardSkill.total === null) {
      this.jd.weightScore.hardSkill.total = 0;
    }
    if (isNaN(this.jd.weightScore.education.total) || this.jd.weightScore.education.total === null) {
      this.jd.weightScore.education.total = 0;
    }
    if (isNaN(this.jd.weightScore.certificate.total) || this.jd.weightScore.certificate.total === null) {
      this.jd.weightScore.certificate.total = 0;
    }
  }

  onChangePercentSoftSkill() {
    this.iTotalSoftSkill = 0;
    const that = this;
    this.jd.weightScore.softSkill.weight.map(function (item) {
      that.iTotalSoftSkill += item.percent;
    });
    // this.jd.weightScore.softSkill.weight.map(function (item, index) {
    //   that.iTotalSoftSkill += item.percent;
    // });
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
    this.router.navigate(['/jd/list']);
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
