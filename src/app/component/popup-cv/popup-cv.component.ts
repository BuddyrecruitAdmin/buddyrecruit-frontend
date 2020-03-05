import { Component, OnInit } from '@angular/core';
import { ResponseCode } from '../../shared/app.constants';
import { JdService } from '../../pages/jd/jd.service';
import { PopupCVService } from './popup-cv.service';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setBugCandidateId, setCandidateId, setBugId, setFieldLabel, setFieldName, setUserCandidate } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { Router } from "@angular/router";
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { PopupFeedbackComponent } from '../../component/popup-feedback/popup-feedback.component';
import { PopupInterviewResultComponent } from '../../component/popup-interview-result/popup-interview-result.component';
import * as _ from 'lodash';
import { PrintCandidateComponent } from '../../component/print-candidate/print-candidate.component';
import { Criteria, Paging as IPaging, Devices, Count } from '../../shared/interfaces/common.interface';

@Component({
  selector: 'ngx-popup-cv',
  templateUrl: './popup-cv.component.html',
  styleUrls: ['./popup-cv.component.scss']
})
export class PopupCvComponent implements OnInit {
  _id: any;
  role: any;
  totalYear: any;
  totalPass: any;
  totalCompare: any;
  totalReject: any;
  totalMonth: any;
  innerWidth: any;
  innerHeight: any;
  flowId: any;
  candidateId: any;
  items: any;
  message: string;
  loading: boolean;
  buttonText: string;
  degreeMaster: DropDownValue[];
  editable: boolean;
  checked = false;
  history: any;
  multiJr: any;
  devices: Devices;
  colorStatus: {
    nameSuccess: boolean,
    nameBug: boolean;
    lastSuccess: boolean,
    lastBug: boolean;
    dobSuccess: boolean,
    dobBug: boolean;
    ageSuccess: boolean,
    ageBug: boolean;
    phoneSuccess: boolean,
    phoneBug: boolean;
    emailSuccess: boolean,
    emailBug: boolean;
    addressSuccess: boolean,
    addressBug: boolean;
    cvSuccess: boolean,
    cvBug: boolean;
    workSuccess: boolean,
    workBug: boolean;
    eduSuccess: boolean,
    eduBug: boolean;
    hardSuccess: boolean,
    hardBug: boolean;
    softSuccess: boolean,
    softBug: boolean;
    cerSuccess: boolean,
    cerBug: boolean;
  }
  remark: any;
  allComments: any;
  constructor(
    private service: PopupCVService,
    public ref: NbDialogRef<PopupCvComponent>,
    public utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private dialogService: NbDialogService,
    private jdService: JdService,
  ) {
    this.role = getRole();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.9;
    this.devices = this.utilitiesService.getDevice();
    console.log(this.devices)
  }

  ngOnInit() {
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    setFlowId();
    setCandidateId();
    this.editable = false;
    this.buttonText = 'edit';
    this.loading = true;
    this.items = [];
    this.totalMonth = 0;
    this.totalYear = 0;
    if (this.flowId) {
      this.getList();
    } else {
      this.ref.close();
    }
  }

  changeMode() {
    if (this.editable) {
      this.buttonText = "edit";
    } else {
      this.buttonText = "display";
    }
    this.editable = !this.editable;
  }

  getList() {
    this.colorStatus = {
      nameSuccess: false,
      nameBug: false,
      lastSuccess: false,
      lastBug: false,
      dobSuccess: false,
      dobBug: false,
      ageSuccess: false,
      ageBug: false,
      phoneSuccess: false,
      phoneBug: false,
      emailSuccess: false,
      emailBug: false,
      addressSuccess: false,
      addressBug: false,
      cvSuccess: false,
      cvBug: false,
      workSuccess: false,
      workBug: false,
      eduSuccess: false,
      eduBug: false,
      hardSuccess: false,
      hardBug: false,
      softSuccess: false,
      softBug: false,
      cerSuccess: false,
      cerBug: false,
    }
    this.degreeMaster = [];
    this.service.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.history = this.items.reject;
        this.multiJr = response.data.otherJR;
        this.allComments = [];
        this.items.comments.map(ele => {
          this.allComments.push({
            accent: (ele.lastChangedInfo.refUser._id === this.role._id) ? 'success' : 'default',
            lastChangedInfo: {
              refUser: ele.lastChangedInfo.refUser,
              date: this.utilitiesService.convertDateTimeFromSystem(ele.lastChangedInfo.date)
            },
            message: ele.message
          })
        })
        if (this.utilitiesService.dateIsValid(response.data.birth)) {
          this.items.birth = new Date(response.data.birth);
          var timeDiff = Math.abs(Date.now() - this.items.birth.getTime());
          this.items.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        } else {
          this.items.birth = "";
        }
        if (this.items.age === -1) {
          this.items.age = "";
        }
        if (this.items.workExperience.totalExpMonth != null || this.items.workExperience.totalExpMonth != undefined) {
          this.totalMonth = this.items.workExperience.totalExpMonth;
          if (this.totalMonth >= 12) {
            this.totalYear = Math.floor(this.totalMonth / 12);
            this.totalMonth = this.totalMonth % 12;
          } else {
            if (this.totalMonth === -1) {
              this.totalMonth = 0;
            }
            this.totalYear = 0;
          }
        }
        if (this.items.education.length > 0) {
          this.items.education.map(ele => {
            if (!ele.refDegree) {
              ele.refDegree = { _id: undefined };
            }
          })
        }
        if (this.items.candidateFlow.pendingInterviewScoreInfo.evaluation.length) {
          this.totalPass = 0;
          this.totalCompare = 0;
          this.totalReject = 0;
          this.items.candidateFlow.pendingInterviewScoreInfo.evaluation.map((element) => {
            if (element.rank.selected === 1) {
              this.totalPass += 1;
            }
            else if (element.rank.selected === 2) {
              this.totalCompare += 1;
            } else {
              this.totalReject += 1;
            }
          });
          let fullResult = '';
          fullResult = 'ผ่าน' + ' : ' + this.totalPass + ' , ' + 'รอพิจารณา' + ' : '
            + this.totalCompare + ' , ' + 'ไม่ผ่าน' + ' : ' + this.totalReject;
          fullResult = fullResult.trim();
          this.items.result = fullResult;
        }
        this.changeColor(this.items);
        this.service.getEducationList().subscribe(response => {
          if (response.code === ResponseCode.Success) {
            if (response.data) {
              response.data.forEach(element => {
                this.degreeMaster.push({
                  label: element.name,
                  value: element._id
                })
              });
              this.loading = false;
            }
          } else {
            this.showToast('danger', 'Error Message', response.message);
            this.ref.close();
          }
        });
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.ref.close();
      }
    })
  }

  removeEducation(index: any) {
    this.items.education.splice(index, 1);
  }

  addEducation() {
    this.items.education.push({
      refDegree: {
        name: "",
        nameTH: "",
      },
      university: "",
      major: "",
      gpa: ""
    });
  }

  edit() {
    const request = this.setRequest();
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.edit(request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.ref.close(true);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        })
      }
    });
  }

  setRequest(): any {
    if (this.items.hardSkill.length > 0) {
      this.items.hardSkill = this.convertArray(this.items.hardSkill);
    }
    if (this.items.softSkill.length > 0) {
      this.items.softSkill = this.convertArray(this.items.softSkill);
    }
    if (this.items.certificate.length > 0) {
      this.items.certificate = this.convertArray(this.items.certificate);
    }
    this.items.candidateFlow.comments = [];
    const request = _.cloneDeep(this.items);
    return request
  }

  convertArray(arr): any {
    arr = arr.map(gobj => {  //array.object to array
      if (gobj.value) {
        gobj = gobj.value;
        return gobj;
      }
      return gobj;
    });
    return arr;
  }

  comment() {
    if (this.totalYear != 0) {
      this.items.workExperience.totalExpMonth = (this.totalYear * 12) + this.totalMonth;
    } else {
      this.items.workExperience.totalExpMonth = this.totalYear;
    }
    this.service.create(this.flowId, this.message).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.getList();
        this.message = '';
      }
    });
  }

  delete(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'D' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteItem(this.flowId, item._id).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.getList();
          }
        });
      }
    });
  }

  delRemark(index: any) {
    this.allComments.splice(index, 1);
    this.items.comments.splice(index, 1);
  }

  addComment() {
    let commen;
    let dateAdd;
    dateAdd = new Date();
    commen = {
      lastChangedInfo: {
        date: dateAdd,
        refUser: {
          firstname: this.role.firstname,
          lastname: this.role.lastname,
          _id: this.role._id,
          imageData: this.role.imagePath
        }
      },
      message: this.remark,
      accent: 'success',
      _id: undefined
    }
    this.items.comments.push(commen)
    let showCom;
    showCom = {
      lastChangedInfo: {
        date: this.utilitiesService.convertDateTime(dateAdd),
        refUser: {
          firstname: this.role.firstname,
          lastname: this.role.lastname,
          _id: this.role._id,
          imageData: this.role.imagePath
        }
      },
      message: this.remark,
      accent: 'success',
      _id: undefined
    }
    this.allComments.push(showCom)
    this.remark = '';
  }

  checkCV(id) {
    this.jdService.originalCV(id, this.role._id)
      .subscribe(data =>
        this.downloadFile(data), error =>
        this.showToast('danger', 'Error Message', "can't find original CV")
      );
  }

  downloadFile(data: any) {
    const blob = new Blob([data], { type: "text/pdf" });
    const url = window.URL.createObjectURL(data);
    // var windowReference = window.open();
    // windowReference.location.href = url;
    window.open(url, "_blank");
  }

  openApplication(id: any) {
    const path = '/employer/appform/view/' + id;
    this.router.navigate([path])
  }

  bugReport(fieldLabel: any, fieldName: any) {
    setBugId(this.items.candidateFlow._id);
    setFieldLabel(fieldLabel);
    setFieldName(fieldName);
    setBugCandidateId(this.candidateId)
    this.dialogService.open(PopupFeedbackComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
        context: this._id
      }
    ).onClose.subscribe(result => {
      setBugId();
      setFieldLabel();
      setFieldName();
      setBugCandidateId();
      this.getList();
    });
  }

  infoResult(item: any) {
    setUserCandidate(item);
    this.dialogService.open(PopupInterviewResultComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setUserCandidate();
    })
  }

  changeColor(item) {
    item.accuracy.map(ele => {
      if (ele.feedbackType === "Correct") {
        switch (ele.fieldName) {
          case "First Name":
            this.colorStatus.nameSuccess = true;
            if (this.colorStatus.nameBug === true) {
              this.colorStatus.nameBug = false;
            };
            break;
          case "lastname":
            this.colorStatus.lastSuccess = true;
            if (this.colorStatus.lastBug === true) {
              this.colorStatus.lastBug = false;
            };
            break;
          case "birthDay":
            this.colorStatus.dobSuccess = true;
            if (this.colorStatus.dobBug === true) {
              this.colorStatus.dobBug = false;
            };
            break;
          case "age":
            this.colorStatus.ageSuccess = true;
            if (this.colorStatus.ageBug === true) {
              this.colorStatus.ageBug = false;
            };
            break;
          case "phone":
            this.colorStatus.phoneSuccess = true;
            if (this.colorStatus.phoneBug === true) {
              this.colorStatus.phoneBug = false;
            };
            break;
          case "email":
            this.colorStatus.emailSuccess = true;
            if (this.colorStatus.emailBug === true) {
              this.colorStatus.emailBug = false;
            };
            break;
          case "address":
            this.colorStatus.addressSuccess = true;
            if (this.colorStatus.addressBug === true) {
              this.colorStatus.addressBug = false;
            };
            break;
          case "CV Score":
            this.colorStatus.cvSuccess = true;
            if (this.colorStatus.cvBug === true) {
              this.colorStatus.cvBug = false;
            };
            break;
          case "Work Experience":
            this.colorStatus.workSuccess = true;
            if (this.colorStatus.workBug === true) {
              this.colorStatus.workBug = false;
            };
            break;
          case "Education":
            this.colorStatus.eduSuccess = true;
            if (this.colorStatus.eduBug === true) {
              this.colorStatus.eduBug = false;
            };
            break;
          case "Hard Skill":
            this.colorStatus.hardSuccess = true;
            if (this.colorStatus.hardBug === true) {
              this.colorStatus.hardBug = false;
            };
            break;
          case "Soft Skill":
            this.colorStatus.softSuccess = true;
            if (this.colorStatus.softBug === true) {
              this.colorStatus.softBug = false;
            };
            break;
          case "Certificate":
            this.colorStatus.cerSuccess = true;
            if (this.colorStatus.cerBug === true) {
              this.colorStatus.cerBug = false;
            };
            break;
          default:
            break;
        }
      } else {
        switch (ele.fieldName) {
          case "First Name":
            this.colorStatus.nameBug = true;
            if (this.colorStatus.nameSuccess === true) {
              this.colorStatus.nameSuccess = false;
            }
            break;
          case "lastname":
            this.colorStatus.lastBug = true;
            if (this.colorStatus.lastSuccess === true) {
              this.colorStatus.lastSuccess = false;
            }
            break;
          case "birthDay":
            this.colorStatus.dobBug = true;
            if (this.colorStatus.dobSuccess === true) {
              this.colorStatus.dobSuccess = false;
            }
            break;
          case "age":
            this.colorStatus.ageBug = true;
            if (this.colorStatus.ageSuccess === true) {
              this.colorStatus.ageSuccess = false;
            }
            break;
          case "phone":
            this.colorStatus.phoneBug = true;
            if (this.colorStatus.phoneSuccess === true) {
              this.colorStatus.phoneSuccess = false;
            }
            break;
          case "email":
            this.colorStatus.emailBug = true;
            if (this.colorStatus.emailSuccess === true) {
              this.colorStatus.emailSuccess = false;
            }
            break;
          case "address":
            this.colorStatus.addressBug = true;
            if (this.colorStatus.addressSuccess === true) {
              this.colorStatus.addressSuccess = false;
            }
            break;
          case "CV Score":
            this.colorStatus.cvBug = true;
            if (this.colorStatus.cvSuccess === true) {
              this.colorStatus.cvSuccess = false;
            }
            break;
          case "Work Experience":
            this.colorStatus.workBug = true;
            if (this.colorStatus.workSuccess === true) {
              this.colorStatus.workSuccess = false;
            }
            break;
          case "Education":
            this.colorStatus.eduBug = true;
            if (this.colorStatus.eduSuccess === true) {
              this.colorStatus.eduSuccess = false;
            }
            break;
          case "Hard Skill":
            this.colorStatus.hardBug = true;
            if (this.colorStatus.hardSuccess === true) {
              this.colorStatus.hardSuccess = false;
            }
            break;
          case "Soft Skill":
            this.colorStatus.softBug = true;
            if (this.colorStatus.softSuccess === true) {
              this.colorStatus.softSuccess = false;
            }
            break;
          case "Certificate":
            this.colorStatus.cerBug = true;
            if (this.colorStatus.cerSuccess === true) {
              this.colorStatus.cerSuccess = false;
            }
            break;
          default:
            break;
        }

      }
    })
  }

  toggleCheck(fieldLabel, fieldName) {
    this.checked = !this.checked;
    this.service.check(this.items.candidateFlow._id, this.candidateId, fieldName, fieldLabel, "Correct").subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.getList();
      }
    })
  }

  openPrintCandidate(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(this.candidateId);
    this.dialogService.open(PrintCandidateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
    });
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
