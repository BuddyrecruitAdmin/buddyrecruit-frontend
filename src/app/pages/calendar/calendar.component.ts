import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  addMinutes
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewDay
} from 'angular-calendar';
import { getRole, getDate, setDate } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { CalendarService } from './calendar.service';
import { ResponseCode, Paging } from '../../shared/app.constants';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { PopupAvailableDateComponent } from '../../component/popup-available-date/popup-available-date.component'
import { Router, ActivatedRoute } from "@angular/router";

const colors: any = {
  green: {
    primary: '#35c4b2',
    secondary: '#35c4b2'
  },
  red: {
    primary: '#ed5154',
    secondary: '#ed5154'
  },
  blue: {
    primary: '#1b74b6',
    secondary: '#1b74b6'
  },
  yellow: {
    primary: '#ffc816',
    secondary: '#ffc816'
  }
};

@Component({
  selector: 'ngx-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('dialogInfo', { static: true }) dialogInfo: TemplateRef<any>;

  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[];
  activeDayIsOpen: boolean = false;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil-alt"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  role: any;
  innerHeight: any;
  innerWidth: any;
  byWorkingDays: boolean;
  excludeDays: number[];
  dialogDate: Date;
  showTips: boolean = false;

  calendarData: any;
  workingDays: any;
  candidateFlow: any;
  event: any = {};
  users: any[];
  outlook: {
    token: any,
    loading: boolean,
    signIn: boolean,
    calendars: any
  };
  gmail: {
    loading: boolean,
    signIn: boolean
  };
  minutesRange = 30;

  constructor(
    private service: CalendarService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.role = getRole();
    this.innerHeight = window.innerHeight * 0.8;
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.outlook = {
      token: '',
      loading: true,
      signIn: false,
      calendars: []
    };
    this.gmail = {
      loading: true,
      signIn: false
    };
  }

  ngOnInit() {
    this.byWorkingDays = false;
    this.events = [];
    this.excludeDays = [];
    this.dialogDate = new Date();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.code) {
        this.service.getTokenOutlookCalendar(params.code).subscribe(response => {
          if (response.data.token) {
            this.getCalendar();
          }
          this.outlook.loading = false;
        });
      } else {
        this.getCalendar();
      }
    });
  }

  async getCalendar() {
    // await this.checkTokenOutlookCalendar();
    // await this.getOutlookCalendarList(this.outlook.token);
    await this.getDetail();
  }

  getDetail() {
    return new Promise((resolve) => {
      this.service.getList().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.calendarData = response.data.calendar;
          this.setWorkingDays();
          this.changeCalendarType(this.byWorkingDays);
        } else {
          this.showToast('danger', 'Error Message', response.message || 'No data found');
        }
        resolve();
      });
    });
  }

  changeCalendarType(byWorkingDays: boolean) {
    // this.events = [];
    this.excludeDays = [];
    this.dialogDate = new Date();

    if (this.calendarData.interviewDates) {
      this.calendarData.interviewDates.forEach(element => {
        const startDate = element.refCandidateFlow.pendingInterviewInfo.startDate;
        const endDate = element.refCandidateFlow.pendingInterviewInfo.endDate;
        if (this.utilitiesService.dateIsValid(startDate)
          && this.utilitiesService.dateIsValid(endDate)) {
          this.events.push({
            id: element.refCandidateFlow._id,
            start: new Date(startDate),
            end: new Date(endDate),
            title: this.buildTitle(element),
            color: colors.red,
            meta: {
              type: 'danger'
            }
          });
        }
      });
    }
    if (this.events.length) {
      this.events = this.removeDuplicates(this.events, 'id');
    }

    if (byWorkingDays === true) {
      this.excludeDay();
    } else {
      this.calendarData.availableDates.forEach(element => {
        const days = this.utilitiesService.calculateDuration2Date(element.startDate, element.endDate);
        for (let index = 0; index < days; index++) {
          let start = new Date(element.startDate);
          let end = new Date(element.endDate);
          while (!isSameDay(start, end) || start.getTime() < end.getTime()) {
            const startHour = new Date(start);
            let endHour = new Date(start);
            endHour.setMinutes(endHour.getMinutes() + this.minutesRange);
            if (endHour.getTime() <= end.getTime()) {
              const found = this.events.find(event => {
                return (event.start.getTime() <= startHour.getTime()
                  && event.end.getTime() >= endHour.getTime())
                  && (event.color === colors.red || event.color === colors.yellow);
              });
              if (!found) {
                this.events.push({
                  start: startHour,
                  end: endHour,
                  title: `${this.utilitiesService.convertTime(startHour)} - ${this.utilitiesService.convertTime(endHour)}`,
                  color: colors.green,
                  meta: {
                    type: 'success'
                  }
                });
              }
            }
            start = new Date(endHour);
          }

          // for (let hour = start.getHours(); hour < end.getHours(); hour++) {
          //   const startHour = addHours(addDays(startOfDay(start), index), hour);
          //   const endHour = addHours(addDays(startOfDay(start), index), hour + 1);
          //   const found = this.events.find(event => {
          //     return event.start.getTime() === startHour.getTime()
          //       && event.end.getTime() === endHour.getTime()
          //       && event.color === colors.red;
          //   });
          //   if (found) {
          //     continue;
          //   }
          //   this.events.push({
          //     start: startHour,
          //     end: endHour,
          //     title: `${this.utilitiesService.convertTime(startHour)} - ${this.utilitiesService.convertTime(endHour)}`,
          //     color: colors.green,
          //     meta: {
          //       type: 'success'
          //     }
          //   });
          // }
        }
      });
    }

    if (this.events.length) {
      this.events.sort(function (a, b) {
        const aa = new Date(a.start);
        const bb = new Date(b.start);
        return aa < bb ? -1 : aa > bb ? 1 : 0;
      });
    }
  }

  excludeDay() {
    this.showTips = false;
    this.excludeDays = [];
    if (this.calendarData.workingDays.length) {
      this.excludeDays = this.calendarData.workingDays.filter(element => {
        return !element.isActive;
      }).map(element => {
        return element.dayOfWeek;
      });
    } else {
      this.showTips = true;
    }
  }

  setWorkingDays() {
    this.workingDays = [];
    if (this.calendarData.workingDays.length) {
      this.workingDays = this.calendarData.workingDays;
    } else {
      this.workingDays = this.initialWorkingDays();
    }
    this.workingDays.forEach(working => {
      working.periods.map(period => {
        period.startTime = this.utilitiesService.convertDateToTimePicker(period.startTime);
        period.endTime = this.utilitiesService.convertDateToTimePicker(period.endTime);
      });
    });
  }

  initialWorkingDays(): any {
    const workingDays = [
      {
        dayOfWeek: 0,
        day: 'Sunday',
        isActive: false,
        periods: [{
          startTime: this.utilitiesService.getDefaultStartTime(),
          endTime: this.utilitiesService.getDefaultEndTime()
        }]
      },
      {
        dayOfWeek: 1,
        day: 'Monday',
        isActive: true,
        periods: [{
          startTime: this.utilitiesService.getDefaultStartTime(),
          endTime: this.utilitiesService.getDefaultEndTime()
        }]
      },
      {
        dayOfWeek: 2,
        day: 'Tuesday',
        isActive: true,
        periods: [{
          startTime: this.utilitiesService.getDefaultStartTime(),
          endTime: this.utilitiesService.getDefaultEndTime()
        }]
      },
      {
        dayOfWeek: 3,
        day: 'Wednesday',
        isActive: true,
        periods: [{
          startTime: this.utilitiesService.getDefaultStartTime(),
          endTime: this.utilitiesService.getDefaultEndTime()
        }]
      },
      {
        dayOfWeek: 4,
        day: 'Thursday',
        isActive: true,
        periods: [{
          startTime: this.utilitiesService.getDefaultStartTime(),
          endTime: this.utilitiesService.getDefaultEndTime()
        }]
      },
      {
        dayOfWeek: 5,
        day: 'Firday',
        isActive: true,
        periods: [{
          startTime: this.utilitiesService.getDefaultStartTime(),
          endTime: this.utilitiesService.getDefaultEndTime()
        }]
      },
      {
        dayOfWeek: 6,
        day: 'Saturday',
        isActive: false,
        periods: [{
          startTime: this.utilitiesService.getDefaultStartTime(),
          endTime: this.utilitiesService.getDefaultEndTime()
        }]
      },
    ];
    return workingDays;
  }

  addPeriod(wIndex: number) {
    this.workingDays[wIndex].periods.push({
      startTime: this.utilitiesService.convertDateToTimePicker(this.utilitiesService.getDefaultStartTime()),
      endTime: this.utilitiesService.convertDateToTimePicker(this.utilitiesService.getDefaultEndTime())
    })
  }

  removePeriod(wIndex: number, pIndex: number) {
    this.workingDays[wIndex].periods.splice(pIndex, 1);
  }

  saveWorkingDays() {
    let workingDays = this.workingDays;
    if (workingDays) {
      workingDays.map(working => {
        working.periods.map(period => {
          period.startTime = this.utilitiesService.convertTimePickerToDate(period.startTime);
          period.endTime = this.utilitiesService.convertTimePickerToDate(period.endTime);
        });
      });
    }
    const request = {
      workingDays: workingDays
    };
    this.service.edit(request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
        this.getCalendar();
      } else {
        this.showToast('danger', 'Error Message', response.message || 'Save error!');
      }
    });
  }

  callPopupAvailableDate() {
    setDate(this.dialogDate);
    this.dialogService.open(PopupAvailableDateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      if (result) {
        this.getCalendar();
      }
    });
  }

  openPopupInterviewInfo(flowId: any) {
    const refCandidateFlow = this.calendarData.interviewDates.find(element => {
      return element.refCandidateFlow._id === flowId;
    });
    if (refCandidateFlow.refCandidateFlow) {
      this.candidateFlow = refCandidateFlow.refCandidateFlow;
      this.getInterviewUsers(this.candidateFlow.refJR._id);
      this.dialogService.open(this.dialogInfo, {
        closeOnBackdropClick: true,
        hasScroll: true,
      });
    }
  }

  getInterviewUsers(jrId: any) {
    this.users = [];
    this.service.getListByJR(jrId).subscribe(response => {
      if (response.data && response.data.userInterviews.length) {
        response.data.userInterviews.forEach(user => {
          let active = false;
          user.calendar.availableDates.forEach(element => {
            const startDate = new Date(element.startDate);
            const endDate = new Date(element.endDate);
            if (this.candidateFlow.pendingInterviewInfo) {
              if (new Date(startDate) <= new Date(this.candidateFlow.pendingInterviewInfo.startDate)) {
                if (new Date(this.candidateFlow.pendingInterviewInfo.startDate) <= new Date(endDate)) {
                  active = true;
                  return;
                }
              }
            }
          });
          this.users.push({
            refUser: user.refUser._id,
            name: this.utilitiesService.setFullname(user.refUser),
            active: active
          });
        });
      }
    });
  }

  // CALENDAR LIB

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.dialogDate = date;
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    if (!this.byWorkingDays) {
      body.forEach(cell => {
        const groups: any = {};
        cell.events.forEach((event: CalendarEvent<{ type: string }>) => {
          groups[event.meta.type] = groups[event.meta.type] || [];
          groups[event.meta.type].push(event);
        });
        cell['eventGroups'] = Object.entries(groups);
      });
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.event = event;
    switch (event.color) {
      case colors.green:
        this.callPopupAvailableDate();
        break;
      case colors.red:
        this.openPopupInterviewInfo(event.id);
        break;
      case colors.yellow:
        // on click other meeting
        break;
      default:
        this.callPopupAvailableDate();
        break;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  signInOutlook() {
    this.service.signInOutlookCalendar().subscribe(response => {
      if (response.data.loginUrl) {
        window.open(response.data.loginUrl, '_blank', '');
      }
    });
  }

  checkTokenOutlookCalendar() {
    return new Promise((resolve) => {
      this.service.checkTokenOutlookCalendar(this.role.username).subscribe(response => {
        if (response.data.token) {
          this.outlook.token = response.data.token;
          this.outlook.signIn = true;
        } else {
          this.outlook.signIn = false;
        }
        this.outlook.loading = false;
        resolve();
      });
    });
  }

  getOutlookCalendarList(token: any = '') {
    return new Promise((resolve) => {
      const start = new Date(2019, 11, 1);
      const end = new Date(2020, 0, 31);
      this.service.getOutlookCalendars(token, start, end).subscribe(response => {
        if (response.data) {
          response.data.forEach(element => {
            this.events.push({
              id: element.Id,
              start: new Date(element.Start.DateTime),
              end: new Date(element.End.DateTime),
              title: `${this.utilitiesService.convertTime(element.Start.DateTime)} - ${this.utilitiesService.convertTime(element.End.DateTime)} ${element.Subject}`,
              color: colors.yellow,
              meta: {
                type: 'warning'
              }
            });
          });
        }
        resolve();
      });
    });
  }

  signInGoogle() {

  }

  buildTitle(item: any) {
    let title = '';
    title += this.utilitiesService.convertTime(item.refCandidateFlow.pendingInterviewInfo.startDate);
    title += ' - ';
    title += this.utilitiesService.convertTime(item.refCandidateFlow.pendingInterviewInfo.endDate);
    title += ' : ';
    title += this.utilitiesService.setFullname(item.refCandidateFlow.refCandidate);
    title += ' ';
    title += `(${item.refCandidateFlow.refJR.refJD.position || '-'})`;
    return title;
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
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
