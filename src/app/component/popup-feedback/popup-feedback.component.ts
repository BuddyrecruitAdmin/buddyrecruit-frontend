import { Component, OnInit } from '@angular/core';
import { PopupFeedbackService } from './popup-feedback.service';
import { ResponseCode } from '../../shared/app.constants';
import { getRole, getBugId, getFieldLabel, getFieldName, getBugCandidateId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';

@Component({
  selector: 'ngx-popup-feedback',
  templateUrl: './popup-feedback.component.html',
  styleUrls: ['./popup-feedback.component.scss']
})
export class PopupFeedbackComponent implements OnInit {
  role: any;
  userKey: any;
  innerWidth: any;
  innerHeight: any;
  TogglePage: string;
  feedbackType: string;
  bugComment: string;
  bugLists: any;
  bugId: any;
  bugCandidateId: any;
  bugName: any;
  bugLabel: any;
  loading: boolean;
  constructor(
    private service: PopupFeedbackService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
  ) {
    this.role = getRole();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.6;
  }

  ngOnInit() {
    this.bugId = getBugId();
    this.bugLabel = getFieldLabel();
    this.bugName = getFieldName();
    this.bugCandidateId = getBugCandidateId();
    this.TogglePage = 'comment';
    this.bugComment = '';
    this.userKey = this.role._id;
    this.feedbackType = 'missing';
    this.loading = false;
    this.getList();
  }

  getList() {
    this.service.getList(this.bugCandidateId, this.bugName, this.bugLabel).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.bugLists = response.data;
        this.bugLists.map(element => {
          if (element.feedbackType === "missing") {
            element.feedbackType = "Missing data";
          }
          if (element.feedbackType === "wrong") {
            element.feedbackType = "Wrong data";
          }
        })
      }
    })
  }

  postBug() {
    this.service.create(this.bugId, this.bugCandidateId, this.bugName, this.bugLabel, this.feedbackType, this.bugComment).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.getList();
        this.TogglePage = 'history';
        this.bugComment = "";
        this.feedbackType = "missing";
      }
    })
  }

  deleteBug(item: any) {
    const dialogRef = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: {
        type: "D"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteItem(item._id)
          .subscribe(res => {
            if (res.code === ResponseCode.Success) {
              this.getList();
            }
          })
      }
    });
  }

}
