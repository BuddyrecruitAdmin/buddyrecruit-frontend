import { Component, OnInit } from '@angular/core';
import { PopupCVService } from './popup-cv.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../shared/interfaces/common.interface';
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
  ) {
    this.role = getRole();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.flowId = getFlowId();
    console.log(this.flowId)
    setFlowId();
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
    this.loading = true;
    this.items = [];
    this.flowId = "5d6795dcbb9aa2080c13a703";
    console.log(this.flowId);
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
      }
    })
    this.service.getEducationList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.degreeMaster = response.data;
        }
      }
      this.loading = false;
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
}
