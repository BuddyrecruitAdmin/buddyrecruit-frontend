import { Component, OnInit } from '@angular/core';
import { ResponseCode } from '../../shared/app.constants';
import { JdService } from '../../pages/jd/jd.service';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId, getCompanyId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { Router } from "@angular/router";
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import * as _ from 'lodash';
import { Criteria, Paging as IPaging, Devices, Count } from '../../shared/interfaces/common.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { PopupCVService } from '../popup-cv/popup-cv.service';
@Component({
  selector: 'ngx-popup-extraction',
  templateUrl: './popup-extraction.component.html',
  styleUrls: ['./popup-extraction.component.scss']
})
export class PopupExtractionComponent implements OnInit {
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
  items: any;
  message: string;
  loading: boolean;
  degreeMaster: DropDownValue[];
  devices: Devices;
  remark: any;
  allComments: any;
  constructor(
    private service: PopupCVService,
    public ref: NbDialogRef<PopupExtractionComponent>,
    public utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    private dialogService: NbDialogService,
    private jdService: JdService,
    private sanitizer: DomSanitizer
  ) {
    this.role = getRole();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.9;
    this.devices = this.utilitiesService.getDevice();
  }

  ngOnInit() {
    this.flowId = getFlowId();
    setFlowId();
    this.initialModel();
    this.loading = true;
    this.totalMonth = 0;
    this.totalYear = 0;
    if (this.flowId) {
      this.getList();
    } else {
      this.ref.close();
    }
  }

  initialModel(): any {
    this.items = {
      firstname: '',
      lastname: '',
      birth: '',
      age: '',
      phone: '',
      email: '',
      address: '',
      expectedSalary: '',
      education: [],
      hardSkill: '',
      softSkill: '',
      certificate: '',
      comments: [],

    }
    return this.items;
  }

  getList() {
    this.degreeMaster = [];
    this.remark = '';
    this.allComments = [];
    this.service.getListExtract(this.flowId._id, this.role.refCompany._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
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
    });
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

  save() {
    const request = this.setRequest();
    console.log(request)
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
    if (this.items.comments) {
      this.items.comments.map((ele, index) => {
        this.allComments.forEach((element, i) => {
          if (index === i) {
            ele.message = element.message;
          }
        });
      })
      console.log(this.items.comments)
    }
    if (this.items.hardSkill.length > 0) {
      this.items.hardSkill = this.convertArray(this.items.hardSkill);
    }
    if (this.items.softSkill.length > 0) {
      this.items.softSkill = this.convertArray(this.items.softSkill);
    }
    if (this.items.certificate.length > 0) {
      this.items.certificate = this.convertArray(this.items.certificate);
    }
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

  editComment(item: any) {
    item.editFlag = true;
    this.allComments.map(element => {
      if (element._id !== item._id) {
        element.editFlag = false;
      }
    })
  }

  escEdit(item: any) {
    item.editFlag = false;
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
