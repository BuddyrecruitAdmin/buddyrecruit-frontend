import { Component, OnInit, Inject } from '@angular/core';
import { PopupFeedbackService } from './popup-feedback.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { resolve } from 'dns';
import { Router, ActivatedRoute } from "@angular/router";
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

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
  textareaHeight: any;
  TogglePage: string;
  feedbackType: string;
  bugComment: string;
  bugLists: any;
  constructor(
    private service: PopupFeedbackService,
    private ref: MatDialogRef<PopupFeedbackComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {
      _id: string,
      fieldLabel: string,
      fieldName: string,
    }
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.textareaHeight = "34";
    console.log(this.data)
    this.TogglePage = 'comment';
    this.feedbackType = '';
    this.bugComment = '';
    this.userKey = this.role._id;
    this.feedbackType = 'missing';
    this.getList();
  }

  getList() {
    this.service.getList(this.data._id, this.data.fieldName, this.data.fieldLabel).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        console.log(response.data);
        this.bugLists = response.data;
      }
    })
  }

  postBug() {
    this.service.create(this.data._id, this.data.fieldName, this.data.fieldLabel, this.feedbackType, this.bugComment).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.getList();
        this.TogglePage = 'history';
      }
    })
  }

  deleteBug(item: any) {
    console.log(item)
    const dialogRef = this.matDialog.open(PopupMessageComponent, {
      width: '35%',
      data: {
        type: "D"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteItem(item._id)
          .subscribe(res => {
            if(res.code === ResponseCode.Success){
              this.getList();
            }
          })
      }
    });
  }

}
