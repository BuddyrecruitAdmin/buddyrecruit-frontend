import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { setUserCandidate, getUserCandidate } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import * as _ from 'lodash';
@Component({
  selector: 'ngx-popup-interview-result',
  templateUrl: './popup-interview-result.component.html',
  styleUrls: ['./popup-interview-result.component.scss']
})
export class PopupInterviewResultComponent implements OnInit {
  item: any;
  role: any;
  innerWidth: any;
  innerHeight: any;
  pass: any;
  notPass: any;
  compare: any;
  passCount: any;
  comCount: any;
  notCount: any;
  constructor(
    private ref: NbDialogRef<PopupInterviewResultComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
  ) {
    this.item = getUserCandidate();
    setUserCandidate();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.8;
  }

  ngOnInit() {
    this.initialModel()
  }

  initialModel() {
    this.pass = [];
    this.notPass = [];
    this.compare = [];
    this.passCount = 0;
    this.comCount = 0;
    this.notCount = 0;
    this.item.pendingInterviewScoreInfo.evaluation.map(element => {
      if (element.rank.selected === 1) {
        this.passCount += 1;
        this.pass.push({
          name: this.utilitiesService.setFullname(element.createdInfo.refUser),
          time: this.utilitiesService.convertDateTimeFromSystem(element.createdInfo.date),
          picture: element.createdInfo.refUser.imageData,
          comment: element.additionalComment,
        })
      }
      if (element.rank.selected === 2) {
        this.comCount += 1;
        this.compare.push({
          name: this.utilitiesService.setFullname(element.createdInfo.refUser),
          time: this.utilitiesService.convertDateTimeFromSystem(element.createdInfo.date),
          picture: element.createdInfo.refUser.imageData,
          comment: element.additionalComment,
        })
      }
      if (element.rank.selected === 3) {
        this.notCount += 1;
        this.notPass.push({
          name: this.utilitiesService.setFullname(element.createdInfo.refUser),
          time: this.utilitiesService.convertDateTimeFromSystem(element.createdInfo.date),
          picture: element.createdInfo.refUser.imageData,
          comment: element.additionalComment,
        })
      }
    });
  }

}
