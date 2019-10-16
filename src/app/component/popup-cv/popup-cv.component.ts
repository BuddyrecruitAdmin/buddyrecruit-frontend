import { Component, OnInit, Inject } from '@angular/core';
import { PopupCVService } from './popup-cv.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogService, NbDialogRef, NB_DIALOG_CONFIG } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { resolve } from 'dns';
import { Router, ActivatedRoute } from "@angular/router";
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { PopupFeedbackComponent } from '../../component/popup-feedback/popup-feedback.component';
@Component({
  selector: 'ngx-popup-cv',
  templateUrl: './popup-cv.component.html',
  styleUrls: ['./popup-cv.component.scss']
})
export class PopupCvComponent implements OnInit {
  _id: any;
  role: any;
  totalYear: any;
  totalMonth: any;
  innerWidth: any;
  innerHeight: any;
  flowId: any;
  items: any;
  accuracy: any;
  candidateName: string;
  jrName: string;
  message: string;
  loading: boolean;
  buttonText: string;
  degreeMaster: DropDownValue[];
  editable: boolean;
  checked = false;
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
  constructor(
    private service: PopupCVService,
    private ref: NbDialogRef<PopupCvComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.flowId = getCandidateId();
    setCandidateId();
    this.editable = false;
    this.buttonText = 'edit';
    this.loading = true;
    this.items = [];
    this.candidateName = '';
    this.jrName = '';
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
        if (this.utilitiesService.dateIsValid(response.data.birth)) {
          this.items.birth = new Date(response.data.birth);
        }
        if (this.items.workExperience.totalExpMonth != null || this.items.workExperience.totalExpMonth != undefined) {
          this.totalMonth = this.items.workExperience.totalExpMonth;
          if (this.totalMonth >= 12) {
            this.totalYear = Math.floor(this.totalMonth / 12);
            this.totalMonth = this.totalMonth % 12;
          } else {
            this.totalYear = 0;
          }
        }
        this.changeColor(this.items);
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.ref.close();
      }
    })
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
    console.log(this.items)
    this.service.edit(this.items).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
        this.ref.close();
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    })
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
      width: '50%',
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

  checkCV(id) {
    this.router.navigate(['/auth/appform/view/' + id]);
  }

  bugReport(fieldLabel, fieldName) {
    this._id = {};
    this._id = {
      id: this.flowId,
      fieldLabel: fieldLabel,
      fieldName: fieldName
    }
    const confirm = this.matDialog.open(PopupFeedbackComponent, {
      width: '45%',
      data: {
        _id: this.flowId,
        fieldLabel: fieldLabel,
        fieldName: fieldName
      }
    });
    confirm.afterClosed().subscribe(result => {
      setFlowId();
      this.getList();
    });
    // this.dialogService.open(PopupFeedbackComponent,
    //   {
    //     closeOnBackdropClick: false,
    //     hasScroll: true,
    //     context: this._id
    //   }
    // ).onClose.subscribe(result => {
    //   setFlowId();
    // });
  }

  changeColor(item) {
    item.accuracy.map(ele => {
      if (ele.feedbackType === "success") {
        switch (ele.fieldName) {
          case "firstname":
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
          case "firstname":
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
    this.service.check(this.flowId, fieldName, fieldLabel, "success").subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.getList();
      }
    })
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
