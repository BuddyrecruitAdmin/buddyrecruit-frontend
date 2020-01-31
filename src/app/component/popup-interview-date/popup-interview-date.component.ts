import { Component, OnInit } from '@angular/core';
import { NbComponentStatus, NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import 'style-loader!angular2-toaster/toaster.css';
import { PopupPreviewEmailComponent } from '../../component/popup-preview-email/popup-preview-email.component';
import { CalendarService } from '../../pages/calendar/calendar.service';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { LocationService } from '../../pages/setting/location/location.service';
import { ResponseCode } from '../../shared/app.constants';
import { DropDownValue, DropDownGroup } from '../../shared/interfaces/common.interface';
import { getCandidateId, getFlowId, getRole, getJrId, setButtonId, setCandidateId, setFlowId, getOutlookToken, getGoogleToken, setUserEmail } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { isSameDay } from 'date-fns';
import { PopupResendEmailComponent } from '../../component/popup-resend-email/popup-resend-email.component';

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
  dropdownDate: DropDownGroup[];
  dropdownTime: DropDownGroup[];
  userInterviews: any;
  users: any[];
  sum: any;
  selectDateFrom: string;
  inviteFrom: string;
  outlookUsername: string;
  googleUsername: string;
  date2: Date;
  startTime: any;
  endTime: any;
  minutesRange = 30;
  emailUser: any;
  errMsg = {
    location: '',
    available: {
      date: '',
      time: ''
    },
    customize: {
      date: '',
      time: ''
    }
  };
  pendingInterviewInfo: any;  
  result: any;
  constructor(
    private candidateService: CandidateService,
    private calendarService: CalendarService,
    public ref: NbDialogRef<PopupInterviewDateComponent>,
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
    this.date2 = null;
    this.startTime = null;
    this.endTime = null;
    this.selectDateFrom = 'AVAILABLE';
    this.inviteFrom = '';
    this.outlookUsername = '';
    this.googleUsername = '';
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
    this.checkUsingCalendar();
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

  checkUsingCalendar() {
    return new Promise((resolve) => {
      this.calendarService.checkUsing().subscribe(response => {
        if (response.data) {
          if (response.data.outlook && getOutlookToken()) {
            this.outlookUsername = response.data.outlook.username;
            this.inviteFrom = 'OUTLOOK';
          }
          if (response.data.google && getGoogleToken()) {
            this.googleUsername = response.data.google.username;
            this.inviteFrom = this.inviteFrom ? this.inviteFrom : 'GOOGLE';
          }
        }
        resolve();
      });
    });
  }

  getDetail() {
    this.candidateService.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.candidateName = this.utilitiesService.setFullname(response.data);
        this.jrName = response.data.candidateFlow.refJR.refJD.position;
        this.stageId = response.data.candidateFlow.refStage._id;
        this.buttonId = this.utilitiesService.findButtonIdByStage(this.stageId, response.data.candidateFlow.refJR.requiredExam);
        if (response.data.email) {
          this.emailUser = response.data.email;
        }
        this.pendingInterviewInfo = response.data.candidateFlow.pendingInterviewInfo;
        this.location = (response.data.candidateFlow.pendingInterviewInfo.refLocation && response.data.candidateFlow.pendingInterviewInfo.refLocation._id) || this.location;
        this.selectDateFrom = response.data.candidateFlow.pendingInterviewInfo.selectDateFrom || 'AVAILABLE';
        this.inviteFrom = response.data.candidateFlow.pendingInterviewInfo.inviteFrom || this.inviteFrom;
        if (this.utilitiesService.dateIsValid(response.data.candidateFlow.pendingInterviewInfo.startDate)) {
          if (this.selectDateFrom === 'CUSTOMIZE') {
            this.date2 = new Date(response.data.candidateFlow.pendingInterviewInfo.startDate);
            this.startTime = this.utilitiesService.convertDateToTimePicker(response.data.candidateFlow.pendingInterviewInfo.startDate);
            this.endTime = this.utilitiesService.convertDateToTimePicker(response.data.candidateFlow.pendingInterviewInfo.endDate);
          } else {
            this.selectDateFrom = 'AVAILABLE';
            this.date = response.data.candidateFlow.pendingInterviewInfo.startDate;
            this.date = this.convertDateTime(this.date);
            this.setDropdownTime(this.date);
            this.time = response.data.candidateFlow.pendingInterviewInfo.startDate;
          }
        } else {
          this.selectDateFrom = 'AVAILABLE';
        }
        if (response.data.candidateFlow.refJR.userInterviews.length) {
          response.data.candidateFlow.refJR.userInterviews.forEach(element => {
            this.users.push({
              refUser: element.refUser._id,
              name: this.utilitiesService.setFullname(element.refUser),
              active: false
            });
          });
        }
        if (this.selectDateFrom === 'AVAILABLE') {
          this.setDropdownDate();
          this.setDropdownTime(this.date);
          this.time = response.data.candidateFlow.pendingInterviewInfo.startDate;
          this.setUsers(this.date, this.time);
        } else {
          this.customizeUser();
        }
        if (response.data.candidateFlow.refStage.refMain.name === 'Pending Appointment') {
          this.canApprove = true;
        }
      }
      this.loading = false;
    });
  }

  replaceAt(text: string, index: number, replacement: string) {
    return text.substr(0, index) + replacement + text.substr(index + replacement.length);
  }

  convertDateTime(text: string) {
    text = this.replaceAt(text, 11, '0');
    text = this.replaceAt(text, 12, '0');
    text = this.replaceAt(text, 14, '0');
    text = this.replaceAt(text, 15, '0');
    return text
  }

  setDropdownDate() {
    this.dropdownDate = [];
    this.dropdownDate.push({
      label: '- Select Interview Date -',
      value: undefined,
      group: undefined
    });
    if (this.userInterviews) {
      this.userInterviews.forEach(user => {
        user.calendar.availableDates.forEach(element => {
          this.dropdownDate.push({
            label: this.utilitiesService.convertDate(element.startDate),
            value: this.convertDateTime(element.startDate),
            group: this.setUsers(this.convertDateTime(element.startDate), null)
          });
        });
      });
    }
    this.dropdownDate = this.removeDuplicates(this.dropdownDate, 'label');
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
      value: undefined,
      group: undefined
    });
    if (this.userInterviews) {
      this.userInterviews.forEach(user => {
        user.calendar.availableDates.forEach(element => {
          let startDate = new Date(element.startDate);
          const endDate = new Date(element.endDate);
          if (!iDate || (iDate && isSameDay(iDate, startDate))) {

            while (!isSameDay(startDate, endDate) || startDate.getTime() < endDate.getTime()) {
              const startHour = new Date(startDate);
              let endHour = new Date(startDate);
              endHour.setMinutes(endHour.getMinutes() + this.minutesRange);
              if (endHour.getTime() <= endDate.getTime()) {
                this.dropdownTime.push({
                  label: `${this.utilitiesService.convertTime(startHour)} - ${this.utilitiesService.convertTime(endHour)}`,
                  value: JSON.parse(JSON.stringify(startHour)),
                  group: this.setUsers(iDate, JSON.parse(JSON.stringify(startHour)))
                });
              }
              startDate = new Date(endHour);
            }

            // for (let hour = startDate.getHours(); hour < endDate.getHours(); hour++) {
            //   const startHour = addHours(startOfDay(startDate), hour);
            //   const endHour = addHours(startOfDay(startDate), hour + 1);
            //   this.dropdownTime.push({
            //     label: `${this.utilitiesService.convertTime(startHour)} - ${this.utilitiesService.convertTime(endHour)}`,
            //     value: JSON.parse(JSON.stringify(startHour)),
            //     group: this.setUsers(iDate, JSON.parse(JSON.stringify(startHour)))
            //   });
            // }

          }
        });
      });
    }
    this.dropdownTime = this.removeDuplicates(this.dropdownTime, 'label');
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
    this.sum = 0;
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
            } else
              if (date) {
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
          this.sum += 1;
        }
      });
      return this.sum;
    }
    return this.sum;
  }

  customizeUser() {
    if (this.users && this.users.length) {
      if (this.pendingInterviewInfo.userInterviews) {
        this.users.map(user => {
          const found = this.pendingInterviewInfo.userInterviews.find(element => {
            return element.refUser === user.refUser;
          });
          if (found) {
            user.active = true;
          }
        });
      } else {
        this.users.map(user => {
          user.active = true;
        });
      }
    }
  }

  save() {
    if (this.validation()) {
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
  }

  validation() {
    this.errMsg = this.initialErrMsg();
    let isValid = true;
    if (!this.location) {
      isValid = false;
      this.errMsg.location = 'Please select Location';
    }
    switch (this.selectDateFrom) {
      case 'AVAILABLE':
        if (!this.date) {
          isValid = false;
          this.errMsg.available.date = 'Please select Date';
        }
        if (!this.time) {
          isValid = false;
          this.errMsg.available.time = 'Please select Time';
        }
        break;
      case 'CUSTOMIZE':
        if (!this.utilitiesService.dateIsValid(this.date2)) {
          isValid = false;
          this.errMsg.customize.date = 'Please select Date';
        }
        if (!this.startTime || !this.endTime) {
          isValid = false;
          this.errMsg.customize.time = 'Please input Time';
        } else if (this.startTime.hour === this.endTime.hour) {
          if (this.startTime.minute >= this.endTime.minute) {
            isValid = false;
            this.errMsg.customize.time = 'Start time must be earlier than end time';
          }
        } else if (this.startTime.hour > this.endTime.hour) {
          isValid = false;
          this.errMsg.customize.time = 'Start time must be earlier than end time';
        } else if ((this.startTime.minute !== 0 && this.startTime.minute !== 30)
          || (this.endTime.minute !== 0 && this.endTime.minute !== 30)) {
          isValid = false;
          this.errMsg.customize.time = 'Minute must be equal 0 or 30';
        }
        break;
    }
    return isValid;
  }

  passToInterview() {
    if (this.validation()) {
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
  }

  previewEmail() {
    setFlowId(this.flowId);
    setCandidateId(this.candidateId);
    setButtonId(this.buttonId);
    setUserEmail(this.emailUser);
    this.dialogService.open(PopupPreviewEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      setButtonId();
      setUserEmail();
      if (result) {
        this.ref.close(true);
      }
      this.loading = false;
    });
  }

  sendEmail() {
    if (this.validation()) {
      setFlowId(this.flowId);
      setCandidateId(this.candidateId);
      this.save();
      this.dialogService.open(PopupResendEmailComponent,
        {
          closeOnBackdropClick: false,
          hasScroll: true,
        }
      ).onClose.subscribe(result => {
        setFlowId();
        setCandidateId();
        this.ref.close(true);
      });
    }
  }

  setRequest(): any {
    let startDate: any;
    let endDate: any;
    let users = [];
    if (this.selectDateFrom === 'AVAILABLE') {
      startDate = new Date(this.time);
      endDate = new Date(this.time);
      endDate = endDate.setMinutes(endDate.getMinutes() + this.minutesRange);
    } else {
      startDate = this.utilitiesService.convertTimePickerToDate(this.startTime, this.date2);
      endDate = this.utilitiesService.convertTimePickerToDate(this.endTime, this.date2);
    }
    this.users.forEach(element => {
      if (element.active) {
        users.push({
          refUser: element.refUser
        });
      }
    });
    let pendingInterviewInfo = this.pendingInterviewInfo;
    pendingInterviewInfo.startDate = startDate;
    pendingInterviewInfo.endDate = endDate;
    pendingInterviewInfo.refLocation = this.location;
    pendingInterviewInfo.selectDateFrom = this.selectDateFrom;
    pendingInterviewInfo.inviteFrom = this.inviteFrom;
    pendingInterviewInfo.userInterviews = users;
    pendingInterviewInfo.flag = true
    const data = {
      pendingInterviewInfo: pendingInterviewInfo,
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

  onChangeSelectDateFrom(value) {
    this.errMsg = this.initialErrMsg();
    if (value === 'AVAILABLE') {
      this.setUsers(this.date, this.time);
      //ใช้ให้โหลด date ทัน
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 100);
    } else {
      this.customizeUser();
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }
  }

  initialErrMsg(): any {
    return {
      location: '',
      available: {
        date: '',
        time: ''
      },
      customize: {
        date: '',
        time: ''
      }
    };
  }

}
