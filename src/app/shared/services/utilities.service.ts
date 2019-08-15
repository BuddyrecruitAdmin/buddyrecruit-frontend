import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  convertDate(date: Date): string {
    date = new Date(date);
    if (date.getUTCFullYear() > 1900) {
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
    if (date.getUTCFullYear() > 1900) {
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
}
