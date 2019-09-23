import { Component, OnInit } from '@angular/core';
import { PopupCommentService } from './popup-comment.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId } from '../../shared/services/auth.service';
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

  constructor(
    private service: PopupCommentService,
    private ref: NbDialogRef<PopupCommentComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
  ) {
    this.role = getRole();
    this.innerWidth = window.innerWidth * 0.4;
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
              title: this.utilitiesService.convertDateTime(element.date),
              picture: '../../../assets/images/avatar.png',
              message: element.message,
              accent: element.refUser._id === this.role._id ? 'success' : 'default',
              canDelete: element.refUser._id === this.role._id ? true : false,
            })
          });
        }
        this.loading = false;
      }
    });
  }

  comment() {
    this.result = true;
    this.service.create(this.flowId, this.message).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.getList();
        this.message = '';
      }
    });
  }

  delete(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: '40%',
      data: { type: 'D' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.result = true;
        this.service.deleteItem(this.flowId, item._id).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.getList();
          }
        });
      }
    });
  }
}