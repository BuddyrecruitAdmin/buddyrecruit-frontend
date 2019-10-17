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
  addHours
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

  constructor(
    private service: CalendarService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.innerHeight = window.innerHeight * 0.8;
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
  }

  ngOnInit() {
    this.byWorkingDays = false;
    this.events = [];
    this.excludeDays = [];
    this.dialogDate = new Date();
    this.getCalendarData();
  }

  getCalendarData() {
    this.service.getList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.calendarData = response.data.calendar;
        this.setWorkingDays();
        this.changeCalendarType(this.byWorkingDays);
      } else {
        this.showToast('danger', 'Error Message', response.message || 'No data found');
      }
    });
  }

  changeCalendarType(byWorkingDays: boolean) {
    this.events = [];
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

    if (byWorkingDays === true) {
      this.excludeDay();
    } else {
      this.calendarData.availableDates.forEach(element => {
        const days = this.utilitiesService.calculateDuration2Date(element.startDate, element.endDate);
        for (let index = 0; index < days; index++) {
          const start = new Date(element.startDate);
          const end = new Date(element.endDate);
          for (let hour = start.getHours(); hour < end.getHours(); hour++) {
            const startHour = addHours(addDays(startOfDay(start), index), hour);
            const endHour = addHours(addDays(startOfDay(start), index), hour + 1);
            const found = this.events.find(event => {
              return event.start.getTime() === startHour.getTime()
                && event.end.getTime() === endHour.getTime()
                && event.color === colors.red;
            });
            if (found) {
              continue;
            }
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
        this.getCalendarData();
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
        this.getCalendarData();
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
    if (event.color === colors.red) {
      this.openPopupInterviewInfo(event.id);
    } else {
      this.callPopupAvailableDate();
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  buildTitle(item: any) {
    let title = '';
    title += this.utilitiesService.convertTime(item.startDate);
    title += ' - ';
    title += this.utilitiesService.convertTime(item.endDate);
    title += ' : ';
    title += this.utilitiesService.setFullname(item.refCandidateFlow.refCandidate);
    title += ' ';
    title += `(${item.refCandidateFlow.refJR.refJD.position || '-'})`;
    return title;
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
