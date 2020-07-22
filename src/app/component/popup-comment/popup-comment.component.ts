import { Component, OnInit } from '@angular/core';
import { PopupCommentService } from './popup-comment.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, setHistoryData, setFlagEdit } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';

@Component({
  selector: 'ngx-popup-comment',
  templateUrl: './popup-comment.component.html',
  styleUrls: ['./popup-comment.component.scss']
})
export class PopupCommentComponent implements OnInit {
  role: any;
  innerWidth: any;
  innerHeight: any;
  flowId: any;
  items: any;
  candidateName: string;
  jrName: string;
  message: string;
  loading: boolean;
  result: boolean = false;
  checkChange: boolean = false;
  constructor(
    private service: PopupCommentService,
    public ref: NbDialogRef<PopupCommentComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
  ) {
    this.role = getRole();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.8;
  }

  ngOnInit() {
    this.flowId = getFlowId();
    setFlowId();
    this.loading = true;
    this.items = [];
    this.candidateName = '';
    this.jrName = '';
    if (this.flowId) {
      this.getList();
    } else {
      this.ref.close();
    }
  }

  getList() {
    this.loading = true;
    this.items = [];
    this.service.getList(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.candidateName = this.utilitiesService.setFullname(response.data.refCandidate);
        this.jrName = response.data.refJR.refJD.position;
        if (response.data.comments.length) {
          response.data.comments.forEach(element => {
            this.items.push({
              _id: element._id,
              name: this.utilitiesService.setFullname(element.refUser),
              title: this.utilitiesService.convertDateTimeFromSystem(element.date),
              picture: element.refUser.imageData,
              message: element.message,
              accent: element.refUser._id === this.role._id ? 'success' : 'default',
              canDelete: element.refUser._id === this.role._id ? true : false,
              fromTransfer: element.fromTransfer,
              editFlag: false
            })
          });
        }
        if (this.checkChange) {
          this.checkChange = false;
          setHistoryData(response.data.comments);
          setFlagEdit('true')
        }
        this.loading = false;
      }
    });
  }

  comment() {
    this.result = true;
    this.service.create(this.flowId, this.message).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.checkChange = true;
        this.getList();
        this.message = '';
      }
    });
  }

  delete(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'D' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.result = true;
        this.service.deleteItem(this.flowId, item._id).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.checkChange = true;
            this.getList();
          }
        });
      }
    });
  }

  editComment(item: any) {
    item.editFlag = true;
    this.items.map(element => {
      if (element._id !== item._id) {
        element.editFlag = false;
      }
    })
  }

  edit(item: any) {
    this.service.edit(item._id, item.message, this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        item.editFlag = false;
      }
    })
  }

  escEdit(item: any) {
    item.editFlag = false;
  }
}
