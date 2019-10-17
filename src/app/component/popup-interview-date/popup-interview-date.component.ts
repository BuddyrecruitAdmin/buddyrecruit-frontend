import { Component, OnInit } from '@angular/core';
import { NbComponentStatus, NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import 'style-loader!angular2-toaster/toaster.css';
import { PopupPreviewEmailComponent } from '../../component/popup-preview-email/popup-preview-email.component';
import { CalendarService } from '../../pages/calendar/calendar.service';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { LocationService } from '../../pages/setting/location/location.service';
import { ResponseCode } from '../../shared/app.constants';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { getCandidateId, getFlowId, getRole, getJrId, setButtonId, setCandidateId, setFlowId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

@Component({
  selector: 'ngx-popup-interview-date',
  templateUrl: './popup-interview-date.component.html',
  styleUrls: ['./popup-interview-date.component.scss']
})
export class PopupInterviewDateComponent implements OnInit {
  role: any;
  jrId: any;
  flowId: any;
  candidateId: any;
  stageId: any;
  buttonId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  jrName: string;
  date: string;
  time: string;
  location: any;
  locations: DropDownValue[];
  loading: boolean;
  canApprove: boolean;
  dropdownDate: DropDownValue[];
  dropdownTime: DropDownValue[];
  userInterviews: any;
  users: any[];

  constructor(
    private candidateService: CandidateService,
    private calendarService: CalendarService,
    private ref: NbDialogRef<PopupInterviewDateComponent>,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private locationService: LocationService,
  ) {
    this.role = getRole();
    this.jrId = getJrId();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    setFlowId();
    setCandidateId();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.8;
  }

  ngOnInit() {
    this.loading = true;
    this.canApprove = false;
    this.candidateName = '';
    this.jrName = '';
    this.date = null;
    this.time = null;
    this.location = null;
    this.buttonId = null;
    this.users = [];
    if (this.flowId) {
      this.initialDropdown().then((response) => {
        this.getDetail();
      });
    } else {
      this.ref.close();
    }
  }

  async initialDropdown() {
    this.getAvailableDate();
    this.getLocation();
  }

  getAvailableDate() {
    return new Promise((resolve) => {
      this.userInterviews = [];
      this.calendarService.getListByJR(this.jrId).subscribe(response => {
        if (response.data && response.data.userInterviews.length) {
          this.userInterviews = response.data.userInterviews;
          this.setDropdownDate();
          this.setDropdownTime();
        }
        resolve();
      });
    });
  }

  getLocation() {
    return new Promise((resolve) => {
      this.locations = [];
      this.locations.push({
        label: '- Select Location -',
        value: null,
      });
      this.locationService.getList().subscribe(response => {
        const locations = response.data.filter(element => {
          return element.active && !element.isDeleted;
        });
        if (locations.length) {
          locations.forEach(element => {
            this.locations.push({
              label: element.name,
              value: element._id,
            })
          });
          const location = locations.find(element => {
            return element.isDefault;
          });
          if (location) {
            this.location = location._id;
          }
        }
        resolve();
      });
    });
  }

  getDetail() {
    this.candidateService.getDetail(this.candidateId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.candidateName = this.utilitiesService.setFullname(response.data);
        this.jrName = response.data.candidateFlow.refJR.refJD.position;
        this.stageId = response.data.candidateFlow.refStage._id;
        this.buttonId = this.utilitiesService.findButtonIdByStage(this.stageId);

        this.location = (response.data.candidateFlow.pendingInterviewInfo.refLocation && response.data.candidateFlow.pendingInterviewInfo.refLocation._id) || this.location;
        if (this.utilitiesService.dateIsValid(response.data.candidateFlow.pendingInterviewInfo.startDate)) {
          this.date = response.data.candidateFlow.pendingInterviewInfo.startDate;
          this.setDropdownTime(this.date);
          this.time = response.data.candidateFlow.pendingInterviewInfo.startDate;
        }
        if (response.data.candidateFlow.refJR.userInterviews.length) {
          response.data.candidateFlow.refJR.userInterviews.forEach(element => {
            this.users.push({
              refUser: element.refUser._id,
              name: this.utilitiesService.setFullname(element.refUser),
              active: false
            });
          });
          this.setUsers(this.date, this.time);
        }
        if (response.data.candidateFlow.refStage.refMain.name === 'Pending Appointment') {
          this.canApprove = true;
        }
      }
      this.loading = false;
    });
  }

  setDropdownDate() {
    this.dropdownDate = [];
    this.dropdownDate.push({
      label: '- Select Interview Date -',
      value: undefined
    });
    if (this.userInterviews) {
      this.userInterviews.forEach(user => {
        user.calendar.availableDates.forEach(element => {
          this.dropdownDate.push({
            label: this.utilitiesService.convertDate(element.startDate),
            value: element.startDate
          });
        });
      });
    }
    this.dropdownDate = this.removeDuplicates(this.dropdownDate, "label");
    this.dropdownDate.sort(function (a, b) {
      const aa = a.label.split('/').reverse().join(),
        bb = b.label.split('/').reverse().join();
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
    });
  }

  onSelectDate(date: any) {
    this.setDropdownTime(date);
    this.setUsers(date, null);
  }

  setDropdownTime(iDate?: any) {
    iDate = new Date(iDate);
    this.time = null;
    this.dropdownTime = [];
    this.dropdownTime.push({
      label: '- Select Interview Time -',
      value: undefined
    });
    if (this.userInterviews) {
      this.userInterviews.forEach(user => {
        user.calendar.availableDates.forEach(element => {
          const startDate = new Date(element.startDate);
          const endDate = new Date(element.endDate);
          if (!iDate || (iDate && isSameDay(iDate, startDate))) {
            for (let hour = startDate.getHours(); hour < endDate.getHours(); hour++) {
              const startHour = addHours(startOfDay(startDate), hour);
              const endHour = addHours(startOfDay(startDate), hour + 1);
              this.dropdownTime.push({
                label: `${this.utilitiesService.convertTime(startHour)} - ${this.utilitiesService.convertTime(endHour)}`,
                value: JSON.parse(JSON.stringify(startHour))
              });
            }
          }
        });
      });
    }
    this.dropdownTime = this.removeDuplicates(this.dropdownTime, "label");
    this.dropdownTime.sort(function (a, b) {
      const aa = a.label.split('/').reverse().join(),
        bb = b.label.split('/').reverse().join();
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
    });
  }

  onSelectTime(time: any) {
    this.setUsers(this.date, time);
  }

  setUsers(date: any, time: any) {
    let usersActive = [];
    if (date || time) {
      if (this.userInterviews.length) {
        this.userInterviews.forEach(user => {
          user.calendar.availableDates.forEach(element => {
            const startDate = new Date(element.startDate);
            const endDate = new Date(element.endDate);
            if (time) {
              if (new Date(startDate) <= new Date(time)) {
                if (new Date(time) <= new Date(endDate)) {
                  usersActive.push(user.refUser._id);
                  return;
                }
              }
            } else if (date) {
              if (isSameDay(new Date(date), startDate)) {
                usersActive.push(user.refUser._id);
                return;
              }
            }
          });
        });
      }
    }
    if (this.users.length) {
      this.users.map(user => {
        user.active = false;
        const found = usersActive.find(element => {
          return element === user.refUser;
        });
        if (found) {
          user.active = true;
        }
      });
    }
  }

  save() {
    this.loading = true;
    const request = this.setRequest();
    this.candidateService.candidateFlowEdit(this.flowId, request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
      this.loading = false;
      this.ref.close(true);
    });
  }

  passToInterview() {
    this.loading = true;
    const request = this.setRequest();
    this.candidateService.candidateFlowEdit(this.flowId, request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.previewEmail();
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.ref.close();
      }
    });
  }

  previewEmail() {
    setFlowId(this.flowId);
    setCandidateId(this.candidateId);
    setButtonId(this.buttonId);
    this.dialogService.open(PopupPreviewEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      setButtonId();
      if (result) {
        this.ref.close(true);
      }
      this.loading = false;
    });
  }

  setRequest(): any {
    const time = new Date(this.time);
    let startDate = addHours(startOfDay(time), time.getHours());
    let endDate = addHours(startOfDay(time), time.getHours() + 1);
    const data = {
      pendingInterviewInfo: {
        startDate: startDate,
        endDate: endDate,
        refLocation: this.location,
        flag: true,
      }
    };
    return data;
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

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

}
