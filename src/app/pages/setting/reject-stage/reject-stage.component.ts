import { Component, OnInit, TemplateRef } from '@angular/core';
import { RejectStageService } from './reject-stage.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { getRole } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { elementAt } from 'rxjs/operators';
import { request } from 'https';
@Component({
  selector: 'ngx-reject-stage',
  templateUrl: './reject-stage.component.html',
  styleUrls: ['./reject-stage.component.scss']
})
export class RejectStageComponent implements OnInit {
  role: any;
  items: any;
  itemsList: any;
  itemDialog: any;
  talentAll: any;
  examAll: any;
  appAll: any;
  inAll: any;
  onAll: any;
  signAll: any;
  constructor(
    private service: RejectStageService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService) {
    this.role = getRole();
  }

  ngOnInit() {
    this.detailList();
  }

  detailList() {
    this.talentAll = [];
    this.examAll = [];
    this.appAll = [];
    this.inAll = [];
    this.signAll = [];
    this.onAll = [];
    this.service.getListAll().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.itemsList = response.data;
        console.log(this.itemsList);
        this.service.getList().subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.items = response.data;
            console.log(this.items)
            let n, i, m;
            //talentPool
            if (this.items.talentPool.length > 0) {
              for (n = 0; n < this.itemsList.length; n++) {
                if (this.items.talentPool[0]._id === this.itemsList[n]._id) {
                  this.talentAll.push({
                    label: this.itemsList[n].name,
                    value: true,
                    _id: this.itemsList[n]._id,
                  })
                } else {
                  this.talentAll.push({
                    label: this.itemsList[n].name,
                    value: false,
                    _id: this.itemsList[n]._id,
                  })
                }
              }
              if (this.items.talentPool.length > 1) {
                for (i = 0; i < this.items.talentPool.length; i++) {
                  for (m = 0; m < this.talentAll.length; m++) {
                    if (this.items.talentPool[i]._id === this.talentAll[m]._id) {
                      this.talentAll[m].value = true;
                    }
                  }
                }
              }
            } else {
              for (n = 0; n < this.itemsList.length; n++) {
                this.talentAll.push({
                  label: this.itemsList[n].name,
                  value: false,
                  _id: this.itemsList[n]._id,
                })
              }
            }
            //pendingExam
            if (this.items.pendingExam.length > 0) {
              for (n = 0; n < this.itemsList.length; n++) {
                if (this.items.pendingExam[0]._id === this.itemsList[n]._id) {
                  this.examAll.push({
                    label: this.itemsList[n].name,
                    value: true,
                    _id: this.itemsList[n]._id,
                  })
                } else {
                  this.examAll.push({
                    label: this.itemsList[n].name,
                    value: false,
                    _id: this.itemsList[n]._id,
                  })
                }
              }
              if (this.items.pendingExam.length > 1) {
                for (i = 0; i < this.items.pendingExam.length; i++) {
                  for (m = 0; m < this.examAll.length; m++) {
                    if (this.items.pendingExam[i]._id === this.examAll[m]._id) {
                      this.examAll[m].value = true;
                    }
                  }
                }
              }
            } else {
              for (n = 0; n < this.itemsList.length; n++) {
                this.examAll.push({
                  label: this.itemsList[n].name,
                  value: false,
                  _id: this.itemsList[n]._id,
                })
              }
            }
            //pendingAppointment
            if (this.items.pendingAppointment.length > 0) {
              for (n = 0; n < this.itemsList.length; n++) {
                if (this.items.pendingAppointment[0]._id === this.itemsList[n]._id) {
                  this.appAll.push({
                    label: this.itemsList[n].name,
                    value: true,
                    _id: this.itemsList[n]._id,
                  })
                } else {
                  this.appAll.push({
                    label: this.itemsList[n].name,
                    value: false,
                    _id: this.itemsList[n]._id,
                  })
                }
              }
              if (this.items.pendingAppointment.length > 1) {
                for (i = 0; i < this.items.pendingAppointment.length; i++) {
                  for (m = 0; m < this.appAll.length; m++) {
                    if (this.items.pendingAppointment[i]._id === this.appAll[m]._id) {
                      this.appAll[m].value = true;
                    }
                  }
                }
              }
            } else {
              for (n = 0; n < this.itemsList.length; n++) {
                this.appAll.push({
                  label: this.itemsList[n].name,
                  value: false,
                  _id: this.itemsList[n]._id,
                })
              }
            }
            //pendingInterview
            if (this.items.pendingInterview.length > 0) {
              for (n = 0; n < this.itemsList.length; n++) {
                if (this.items.pendingInterview[0]._id === this.itemsList[n]._id) {
                  this.inAll.push({
                    label: this.itemsList[n].name,
                    value: true,
                    _id: this.itemsList[n]._id,
                  })
                } else {
                  this.inAll.push({
                    label: this.itemsList[n].name,
                    value: false,
                    _id: this.itemsList[n]._id,
                  })
                }
              }
              if (this.items.pendingInterview.length > 1) {
                for (i = 0; i < this.items.pendingInterview.length; i++) {
                  for (m = 0; m < this.inAll.length; m++) {
                    if (this.items.pendingInterview[i]._id === this.inAll[m]._id) {
                      this.inAll[m].value = true;
                    }
                  }
                }
              }
            } else {
              for (n = 0; n < this.itemsList.length; n++) {
                this.inAll.push({
                  label: this.itemsList[n].name,
                  value: false,
                  _id: this.itemsList[n]._id,
                })
              }
            }
            //pendingSignContract
            if (this.items.pendingSignContract.length > 0) {
              for (n = 0; n < this.itemsList.length; n++) {
                if (this.items.pendingSignContract[0]._id === this.itemsList[n]._id) {
                  this.signAll.push({
                    label: this.itemsList[n].name,
                    value: true,
                    _id: this.itemsList[n]._id,
                  })
                } else {
                  this.signAll.push({
                    label: this.itemsList[n].name,
                    value: false,
                    _id: this.itemsList[n]._id,
                  })
                }
              }
              if (this.items.pendingSignContract.length > 1) {
                for (i = 0; i < this.items.pendingSignContract.length; i++) {
                  for (m = 0; m < this.signAll.length; m++) {
                    if (this.items.pendingSignContract[i]._id === this.signAll[m]._id) {
                      this.signAll[m].value = true;
                    }
                  }
                }
              }
            } else {
              for (n = 0; n < this.itemsList.length; n++) {
                this.signAll.push({
                  label: this.itemsList[n].name,
                  value: false,
                  _id: this.itemsList[n]._id,
                })
              }
            }
            //onboard
            if (this.items.onboard.length > 0) {
              for (n = 0; n < this.itemsList.length; n++) {
                if (this.items.onboard[0]._id === this.itemsList[n]._id) {
                  this.onAll.push({
                    label: this.itemsList[n].name,
                    value: true,
                    _id: this.itemsList[n]._id,
                  })
                } else {
                  this.onAll.push({
                    label: this.itemsList[n].name,
                    value: false,
                    _id: this.itemsList[n]._id,
                  })
                }
              }
              if (this.items.onboard.length > 1) {
                for (i = 0; i < this.items.onboard.length; i++) {
                  for (m = 0; m < this.onAll.length; m++) {
                    if (this.items.onboard[i]._id === this.onAll[m]._id) {
                      this.onAll[m].value = true;
                    }
                  }
                }
              }
            } else {
              for (n = 0; n < this.itemsList.length; n++) {
                this.onAll.push({
                  label: this.itemsList[n].name,
                  value: false,
                  _id: this.itemsList[n]._id,
                })
              }
            }
            console.log(this.itemsList);
            console.log(this.items);
            console.log(this.talentAll);
          }
        })
      }

    })
  }

  saveAs() {
    this.changeValue();
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
          }
        })
      }
    })
  }

  changeValue() {
    this.items.talentPool = [];
    this.items.pendingExam = [];
    this.items.pendingAppointment = [];
    this.items.pendingInterview = [];
    this.items.pendingSignContract = [];
    this.items.onboard = [];
    this.talentAll.forEach(element => {
      if (element.value === true) {
        this.items.talentPool.push({
          name: element.label,
          _id: element._id
        })
      }
    });
    this.examAll.forEach(element => {
      if (element.value === true) {
        this.items.pendingExam.push({
          name: element.label,
          _id: element._id
        })
      }
    });
    this.inAll.forEach(element => {
      if (element.value === true) {
        this.items.pendingInterview.push({
          name: element.label,
          _id: element._id
        })
      }
    });
    this.signAll.forEach(element => {
      if (element.value === true) {
        this.items.pendingSignContract.push({
          name: element.label,
          _id: element._id
        })
      }
    });
    this.onAll.forEach(element => {
      if (element.value === true) {
        this.items.onboard.push({
          name: element.label,
          _id: element._id
        })
      }
    });
    this.appAll.forEach(element => {
      if (element.value === true) {
        this.items.pendingAppointment.push({
          name: element.label,
          _id: element._id
        })
      }
    });
    console.log(this.items.talentPool);
    console.log(this.items);

  }

  setRequest(): any {
    const request = _.cloneDeep(this.items);
    console.log(request);

    return request;
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
