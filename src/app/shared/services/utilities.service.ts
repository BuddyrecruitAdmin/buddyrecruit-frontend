import { Injectable } from '@angular/core';
import { Devices } from '../interfaces/common.interface';
import { InnerWidth } from '../../shared/app.constants';
import { getRole, getToken, getIsGridLayout } from '../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  setFullname(refUser: any): string {
    let fullName = '';
    if (refUser) {
      if (refUser.firstname) {
        fullName = refUser.firstname;
      }
      if (refUser.lastname) {
        fullName = fullName + ' ' + refUser.lastname;
      }
      if (!refUser.firstname && !refUser.lastname) {
        if (refUser.email) {
          fullName = fullName + ' ' + refUser.email;
        } else if (refUser.phone) {
          fullName = fullName + ' ' + refUser.phone;
        }
      }
    }
    fullName = fullName.trim();
    return fullName;
  }

  dateIsValid(date: Date): boolean {
    let isValid = false;
    if (date) {
      date = new Date(date);
      if (date.getUTCFullYear() > 1970) {
        isValid = true;
      }
    }
    return isValid;
  }

  convertDate(date: Date): string {
    if (this.dateIsValid(date)) {
      const dateTime = this.convertDateTime(date);
      return dateTime.split(' ')[0];
    } else {
      return null;
    }
  }

  convertTime(date: Date): string {
    if (this.dateIsValid(date)) {
      const dateTime = this.convertDateTime(date);
      return dateTime.split(' ')[1];
    } else {
      return null;
    }
  }

  convertDateTime(date: Date): string {
    if (this.dateIsValid(date)) {
      let text = '';
      date = new Date(date);
      text += this.fillZero(date.getDate(), 2);
      text += '/';
      text += this.fillZero(date.getMonth() + 1, 2);
      text += '/';
      text += date.getFullYear().toString();
      text += ' ';
      text += this.fillZero(date.getHours(), 2);
      text += ':';
      text += this.fillZero(date.getMinutes(), 2);
      return text;
    } else {
      return null;
    }
  }

  convertDateTimeFromSystem(date: Date): string {
    if (this.dateIsValid(date)) {
      let text = '';
      const dateArray = date.toString().split('T')[0].split('-');
      const TimeArray = date.toString().split('T')[1].split('.')[0].split(':');
      text += dateArray[2];
      text += '/';
      text += dateArray[1];
      text += '/';
      text += dateArray[0];
      text += ' ';
      text += TimeArray[0];
      text += ':';
      text += TimeArray[1];
      return text;
    } else {
      return null;
    }
  }

  getFullYear(date: Date): string {
    if (this.dateIsValid(date)) {
      date = new Date(date);
      let arrayDate = [];
      arrayDate = date
        .toISOString()
        .split('T')[0]
        .split('-');
      return arrayDate[0];
    } else {
      return null;
    }
  }

  fillZero(value: any, digit: number): string {
    let text = '';
    const length = digit - value.toString().length;
    if (length) {
      for (let index = 0; index < length; index++) {
        text += '0';
      }
    }
    text += value;
    return text;
  }

  isDateGreaterThanToday(date: Date): boolean {
    let isValid = false;
    if (this.dateIsValid(date)) {
      if (new Date(date) > new Date()) {
        isValid = true;
      }
    }
    return isValid;
  }

  isDateLowerThanToday(date: Date): boolean {
    let isValid = false;
    if (this.dateIsValid(date)) {
      if (new Date(date) < new Date()) {
        isValid = true;
      }
    }
    return isValid;
  }

  getDevice(): Devices {
    let devices: Devices;
    devices = {
      isMobile: false,
      isTablet: false,
      isNotebook: false,
      isPC: false,
      other: false,
    };

    if (window.innerWidth <= InnerWidth.XS) {
      devices.isMobile = true;
    } else if (window.innerWidth <= InnerWidth.SM) {
      devices.isTablet = true;
    } else if (window.innerWidth <= InnerWidth.MD) {
      devices.isNotebook = true;
    } else if (window.innerWidth <= InnerWidth.LG) {
      devices.isPC = true;
    } else {
      devices.other = true;
    }

    return devices;
  }

  setIsGridLayout(): boolean {
    const devices = this.getDevice();
    let isGridLayout = getIsGridLayout();
    if (isGridLayout === undefined) {
      if (devices.isMobile || devices.isTablet) {
        isGridLayout = true;
      } else {
        isGridLayout = false;
      }
    }
    return isGridLayout;
  }

  calculatePercentage(value1: any, value2: any): string {
    let percent = '0';
    if (value1 && value2) {
      percent = ((value1 / value2) * 100).toFixed(0);
    }
    return percent;
  }

  calculateDuration2Date(beginDate: Date, endDate: Date): number {
    let diffDays = 0;
    const date1 = new Date(beginDate);
    const date2 = new Date(endDate);
    const diffTime = date2.getTime() - date1.getTime();
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  findMainStage(stageId: string): string {
    if (stageId) {
      const role = getRole();
      if (role.refAuthorize
        && role.refAuthorize.processFlow
        && role.refAuthorize.processFlow.exam
        && role.refAuthorize.processFlow.exam.steps.length
      ) {
        const refStage = role.refAuthorize.processFlow.exam.steps.find(element => {
          return element.refStage._id === stageId;
        });
        if (refStage) {
          return refStage.refStage.refMain.name;
        }
      }
    } else {
      return '';
    }
  }

  calculateAgeFromBirthdate(date: Date): number {
    if (this.dateIsValid(date) && this.isDateLowerThanToday(date)) {
      date = new Date(date);
      let ageDifMs = Date.now() - date.getTime();
      let ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } else {
      return undefined;
    }
  }

  convertMonthToYearText(month = 0): string {
    let text = '';
    const nYear = Math.floor((month / 12));
    const nMonth = (month % 12);
    if (nYear) {
      text += `${nYear} year`;
      if (nYear > 1) {
        text.trim();
        text += `s `;
      }
    }
    if (nMonth) {
      text += `${nMonth} month`;
      if (nMonth > 1) {
        text.trim();
        text += `s`;
      }
    }
    text = text.trim();
    if (month === -1) {
      return text = "";
    }
    return text;
  }

  convertWorkExpToText(work: any): string {
    let text = '';
    const startDate = this.getFullYear(work.start);
    const endDate = this.getFullYear(work.end);
    if (startDate && endDate) {
      text += `${startDate} - ${endDate}, `;
    }
    if (work.position) {
      text += `${work.position} `;
    }
    if (work.company) {
      text += `at ${work.company} `;
    }
    text = text.trim();
    return text;
  }

  convertEducationToText(education: any): string {
    let text = '';
    if (education.refDegree && education.refDegree.name) {
      text += `${education.refDegree.name}, `;
    }
    if (education.major) {
      text += `${education.major} `;
    }
    if (education.university) {
      text += `at ${education.university} `;
    }
    if (education.gpa) {
      text += `(${education.gpa})`;
    }
    text = text.trim();
    return text;
  }

  convertStringArrayToLongText(array: any): string {
    let text = '';
    if (array) {
      array.forEach(element => {
        text += `${element}, `;
      });
    }
    text = text.trim();
    text = text.slice(0, -1);
    return text;
  }

  getWidthOfPopupCard(): number {
    let width = window.innerWidth;
    const devices = this.getDevice();
    switch (true) {
      case devices.isMobile:
        width = width * 0.85;
        break;
      case devices.isTablet:
        width = width * 0.7;
        break;
      case devices.isNotebook:
        width = width * 0.6;
        break;
      case devices.isPC:
        width = width * 0.5;
        break;
      case devices.other:
        width = width * 0.4;
        break;
      default:
        width = width * 0.5;
        break;
    }
    return width;
  }

  convertDateToTimePicker(date?: Date): any {
    let time = {
      hour: null,
      minute: null,
      second: null,
    };
    if (this.dateIsValid(date)) {
      date = new Date(date);
      time.hour = date.getHours();
      time.minute = date.getMinutes();
      time.second = date.getSeconds();
    }
    return time;
  }

  convertTimePickerToDate(time: any, date: Date = new Date()) {
    date = new Date(date);
    if (time && time.hour !== undefined && time.minute !== undefined) {
      date.setHours(time.hour);
      date.setMinutes(time.minute);
      date.setSeconds(0);
      date.setMilliseconds(0);
    }
    return date;
  }

  findButtonIdByStage(stageId: any): string {
    let buttonId;
    if (stageId) {
      const role = getRole();
      if (role && role.refAuthorize && role.refAuthorize.processFlow
        && role.refAuthorize.processFlow.exam && role.refAuthorize.processFlow.exam.steps.length) {
        const step = role.refAuthorize.processFlow.exam.steps.find(element => {
          return element.refStage._id === stageId;
        });
        if (step) {
          buttonId = step._id;
        }
      }
    }
    return buttonId;
  }

  getDefaultStartTime(hour: number = 9): Date {
    let date = new Date();
    date.setHours(hour);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  getDefaultEndTime(hour: number = 17): Date {
    let date = new Date();
    date.setHours(hour);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  getJrStatusClass(jrStatus: string): string {
    let statusClass = 'label-gray';
    switch (jrStatus) {
      case 'JRS001': // Waiting for HR Confirm
        statusClass = 'label-warning';
        break;
      case 'JRS002': // Active
        statusClass = 'label-success';
        break;
      case 'JRS003': // Inactive
        statusClass = 'label-gray';
        break;
      case 'JRS004': // Expired
        statusClass = 'label-primary';
        break;
      case 'JRS005': // Rejected
        statusClass = 'label-danger';
        break;
      case 'JRS006': // Closed
        statusClass = 'label-gray';
        break;
    }
    return statusClass;
  }

  getRole(): any {
    return getRole();
  }

  getToken(): any {
    return getToken();
  }

  isValidEmail(email: string): boolean {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email && regex.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  isValidPhoneNumber(phone: string): boolean {
    var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (phone && regex.test(phone)) {
      return true;
    } else {
      return false;
    }
  }

  isValidNumber(number: string, digits: number): boolean {
    var regex = /^\d*$/;
    if (number && number.length <= digits && regex.test(number)) {
      return true;
    } else {
      return false;
    }
  }

}
