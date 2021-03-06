import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../pages/calendar/calendar.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getDate, setDate } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { isSameDay, isPast, isDate, isToday, areRangesOverlapping } from 'date-fns';
import { Devices } from '../../shared/interfaces/common.interface';

@Component({
  selector: 'ngx-popup-available-date',
  templateUrl: './popup-available-date.component.html',
  styleUrls: ['./popup-available-date.component.scss']
})
export class PopupAvailableDateComponent implements OnInit {
  innerHeight: any;
  innerWidth: any;
  role: any;
  loading: boolean;
  calendarData: any;
  date: Date;
  periods: any;
  disabled: boolean;
  result: boolean;
  errMsg: string;
  minuteStep = 30;
  candidateName: any;
  devices: Devices;
  constructor(
    private calendarService: CalendarService,
    public ref: NbDialogRef<PopupAvailableDateComponent>,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.date = getDate();
    this.innerHeight = window.innerHeight * 0.8;
    setDate();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard()
    this.devices = this.utilitiesService.getDevice();
  }

  ngOnInit() {
    this.loading = true;
    this.disabled = false;
    this.result = false;
    this.periods = [];
    this.errMsg = '';
    this.getAvailabelDate();
  }

  getAvailabelDate() {
    this.loading = true;
    this.calendarService.getList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.calendarData = response.data;
        this.changeDate(this.date);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
      this.loading = false;
    });
  }

  changeDate(date: Date) {
    this.disabled = false;
    this.errMsg = '';
    this.periods = [];
    if (isDate(date)) {
      if (this.calendarData.availableDates && this.calendarData.availableDates.length) {
        const availableDates = this.calendarData.availableDates.filter(element => {
          if (isSameDay(element.startDate, date)) {
            return element;
          }
        });
        if (availableDates.length) {
          availableDates.forEach(element => {
            this.periods.push({
              startTime: this.utilitiesService.convertDateToTimePicker(element.startDate),
              endTime: this.utilitiesService.convertDateToTimePicker(element.endDate),
            });
          });
        }
      }
      if (isPast(date) && !isToday(date)) {
        this.disabled = true;
        this.errMsg = '';
      } else if (this.calendarData.interviewDates.length) {
        const found = this.calendarData.interviewDates.find(element => {
          if (element.refCandidateFlow) {
            if (isSameDay(element.refCandidateFlow.pendingInterviewInfo.startDate, date)) {
              return element;
            }
          }
        });
        if (found) {
          this.disabled = true;
          this.errMsg = 'This day have a Interview meeting, Can\'t edit.';
        }
      }
    }
  }

  addPeriod() {
    if (this.periods.length) {
      this.periods.push({
        startTime: null,
        endTime: null
      });
    } else {
      this.periods.push({
        startTime: this.utilitiesService.convertDateToTimePicker(this.utilitiesService.getDefaultStartTime()),
        endTime: this.utilitiesService.convertDateToTimePicker(this.utilitiesService.getDefaultEndTime())
      });
    }
  }

  removePeriod(index: number) {
    this.periods.splice(index, 1);
  }

  save() {
    if (this.validation()) {
      this.loading = true;
      const request = this.setRequest();
      this.calendarService.edit(request).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.showToast('success', 'Success Message', response.message);
          this.getAvailabelDate();
          this.ref.close(true);
        } else {
          this.showToast('danger', 'Error Message', response.message);
        }
        this.loading = false;
        this.result = true;
      });
    }
  }

  setRequest(): any {
    let availableDates = [];
    this.calendarData.availableDates.forEach(element => {
      if (!isSameDay(element.startDate, this.date)) {
        availableDates.push(element);
      }
    });
    if (this.periods.length) {
      this.periods.forEach(time => {
        availableDates.push({
          startDate: this.utilitiesService.convertTimePickerToDate(time.startTime, this.date),
          endDate: this.utilitiesService.convertTimePickerToDate(time.endTime, this.date)
        })
      });
    }
    const request = {
      availableDates: availableDates
    };
    return request;
  }

  validation(): boolean {
    this.errMsg = '';
    let isValid = true;
    if (!isDate(this.date)) {
      isValid = false;
      this.errMsg = 'Please select Date';
    }
    if (this.periods.length) {
      this.periods.forEach((element, index) => {
        if (!element.startTime || !element.endTime) {
          isValid = false;
          this.errMsg = 'Please input Time';
        } else if (element.startTime.hour === element.endTime.hour) {
          if (element.startTime.minute >= element.endTime.minute) {
            isValid = false;
            this.errMsg = 'Start time of a date cannot be after its end time';
          }
        } else if (element.startTime.hour > element.endTime.hour) {
          isValid = false;
          this.errMsg = 'Start time of a date cannot be after its end time';
        } else if ((element.startTime.minute !== 0 && element.startTime.minute !== 30)
          || (element.endTime.minute !== 0 && element.endTime.minute !== 30)) {
          isValid = false;
          this.errMsg = 'Minute must be equal 0 or 30';
        } else {
          this.periods.forEach((compare, indC) => {
            if (indC !== index) {
              const startDate = this.utilitiesService.convertTimePickerToDate(element.startTime, this.date);
              const endDate = this.utilitiesService.convertTimePickerToDate(element.endTime, this.date);
              const compareStartDate = this.utilitiesService.convertTimePickerToDate(compare.startTime, this.date);
              const compareEndDate = this.utilitiesService.convertTimePickerToDate(compare.endTime, this.date);
              if (areRangesOverlapping(startDate, endDate, compareStartDate, compareEndDate)) {
                isValid = false;
                this.errMsg = 'Time range overlapping with another time range';
                return;
              }
            }
          });
        }
      });
    } else {
      isValid = false;
      this.errMsg = 'Please input Time';
    }
    return isValid;
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
