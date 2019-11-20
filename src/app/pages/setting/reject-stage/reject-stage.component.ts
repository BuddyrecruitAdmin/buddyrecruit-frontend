import { Component, OnInit } from '@angular/core';
import { RejectStageService } from './reject-stage.service';
import { ResponseCode } from '../../../shared/app.constants';
import { getRole } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-reject-stage',
  templateUrl: './reject-stage.component.html',
  styleUrls: ['./reject-stage.component.scss']
})
export class RejectStageComponent implements OnInit {
  role: any;

  rejectionList: any;
  rejectStageList: any;

  talentPoolList: any;
  examList: any;
  appointmentList: any;
  interviewList: any;
  signList: any;
  onboardList: any;
  loading: boolean;

  constructor(
    private service: RejectStageService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.loading = true;
    this.rejectionList = [];
    this.rejectStageList = [];
    this.talentPoolList = [];
    this.examList = [];
    this.appointmentList = [];
    this.interviewList = [];
    this.signList = [];
    this.onboardList = [];
    this.getDetail();
  }

  getDetail() {
    this.service.getListAll().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.rejectionList = response.data;
        this.service.getList().subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.rejectStageList = response.data;

            this.rejectionList.forEach(element => {
              let found;
              let value;

              // Talent Pool
              found = this.rejectStageList.talentPool.find(item => {
                return item._id === element._id;
              });
              if (found) {
                value = true;
              } else {
                value = false;
              }
              this.talentPoolList.push({
                _id: element._id,
                label: element.name,
                value: value,
                active: element.active,
              });

              // Pending Exam
              found = this.rejectStageList.pendingExam.find(item => {
                return item._id === element._id;
              });
              if (found) {
                value = true;
              } else {
                value = false;
              }
              this.examList.push({
                _id: element._id,
                label: element.name,
                value: value,
                active: element.active,
              });

              // Pending Appointment
              found = this.rejectStageList.pendingAppointment.find(item => {
                return item._id === element._id;
              });
              if (found) {
                value = true;
              } else {
                value = false;
              }
              this.appointmentList.push({
                _id: element._id,
                label: element.name,
                value: value,
                active: element.active,
              });

              // Pending Interview
              found = this.rejectStageList.pendingInterview.find(item => {
                return item._id === element._id;
              });
              if (found) {
                value = true;
              } else {
                value = false;
              }
              this.interviewList.push({
                _id: element._id,
                label: element.name,
                value: value,
                active: element.active,
              });

              // Pending Sign Contract
              found = this.rejectStageList.pendingSignContract.find(item => {
                return item._id === element._id;
              });
              if (found) {
                value = true;
              } else {
                value = false;
              }
              this.signList.push({
                _id: element._id,
                label: element.name,
                value: value,
                active: element.active,
              });

              // Onboard
              found = this.rejectStageList.onboard.find(item => {
                return item._id === element._id;
              });
              if (found) {
                value = true;
              } else {
                value = false;
              }
              this.onboardList.push({
                _id: element._id,
                label: element.name,
                value: value,
                active: element.active,
              });

            });
          }
          this.loading = false;
        });
      }
    });
  }

  save() {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        const request = this.setRequest();
        this.service.edit(request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
          }
        })
      }
    })
  }

  setRequest(): any {
    const talentPool = this.talentPoolList.filter(element => {
      return element.value;
    });
    const pendingExam = this.examList.filter(element => {
      return element.value;
    });
    const pendingAppointment = this.appointmentList.filter(element => {
      return element.value;
    });
    const pendingInterview = this.interviewList.filter(element => {
      return element.value;
    });
    const pendingSignContract = this.signList.filter(element => {
      return element.value;
    });
    const onboard = this.onboardList.filter(element => {
      return element.value;
    });
    const request = {
      talentPool: talentPool,
      pendingExam: pendingExam,
      pendingAppointment: pendingAppointment,
      pendingInterview: pendingInterview,
      pendingSignContract: pendingSignContract,
      onboard: onboard,
    }
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
