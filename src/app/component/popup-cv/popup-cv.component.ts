import { Component, OnInit } from '@angular/core';
import { PopupCVService } from './popup-cv.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId,getCandidateId,setCandidateId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { resolve } from 'dns';
import { Router, ActivatedRoute } from "@angular/router";
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
@Component({
  selector: 'ngx-popup-cv',
  templateUrl: './popup-cv.component.html',
  styleUrls: ['./popup-cv.component.scss']
})
export class PopupCvComponent implements OnInit {
  role: any;
  totalYear: any;
  totalMonth: any;
  innerWidth: any;
  innerHeight: any;
  flowId: any;
  items: any;
  candidateName: string;
  jrName: string;
  message: string;
  loading: boolean;
  buttonText: string;
  degreeMaster: DropDownValue[];
  editable: boolean;
  constructor(
    private service: PopupCVService,
    private ref: NbDialogRef<PopupCvComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
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
    this.degreeMaster = [];
    this.service.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        console.log(response.data);
        if (this.items.workExperience.totalExpMonth != null || this.items.workExperience.totalExpMonth != undefined) {
          this.totalMonth = this.items.workExperience.totalExpMonth;
          if (this.totalMonth >= 12) {
            this.totalYear = Math.floor(this.totalMonth / 12);
            this.totalMonth = this.totalMonth % 12;
          } else {
            this.totalYear = 0;
          }
        }
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
      width: '40%',
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
