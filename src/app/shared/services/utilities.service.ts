import { Injectable } from '@angular/core';
import { Devices } from '../interfaces/common.interface';
import { InnerWidth } from '../../shared/app.constants';

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
    }
    fullName = fullName.trim();
    return fullName;
  }

  convertDate(date: Date): string {
    date = new Date(date);
    if (date.getUTCFullYear() > 1970) {
      let arrayDate = [];
      arrayDate = date
        .toISOString()
        .split("T")[0]
        .split("-");
      return arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
    } else {
      return null;
    }
  }

  convertDateTime(date: Date): string {
    date = new Date(date);
    if (date.getUTCFullYear() > 1970) {
      let arrayDate = [];
      let arrayTime = [];
      arrayDate = date
        .toISOString()
        .split("T")[0]
        .split("-");
      arrayTime = date
        .toISOString()
        .split("T")[1]
        .split(":");
      return (
        arrayDate[2] +
        "/" +
        arrayDate[1] +
        "/" +
        arrayDate[0] +
        " " +
        arrayTime[0] +
        ":" +
        arrayTime[1] +
        ":" +
        arrayTime[2].slice(0, 2)
      );
    } else {
      return null;
    }
  }

  isDateGreaterThanToday(date): boolean {
    if (new Date(date) > new Date()) {
      return true;
    } else {
      return false;
    }
  }

  isDateLowerThanToday(date): boolean {
    if (new Date(date) < new Date()) {
      return true;
    } else {
      return false;
    }
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

  calculatePercentage(value1: any, value2: any): string {
    let percent = '0';
    if (value1 && value2) {
      percent = ((value1 / value2) * 100).toFixed(0);
    }
    return percent;
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

  getFullYear(date: Date): string {
    if (this.dateIsValid(date)) {
      date = new Date(date);
      let arrayDate = [];
      arrayDate = date
        .toISOString()
        .split("T")[0]
        .split("-");
      return arrayDate[0];
    } else {
      return null;
    }
  }

  dateIsValid(date: Date): boolean {
    let isValid = false;
    if (date) {
      date = new Date(date);
      if (date.getUTCFullYear() > 1900) {
        isValid = true;
      }
    }
    return isValid;
  }

}
