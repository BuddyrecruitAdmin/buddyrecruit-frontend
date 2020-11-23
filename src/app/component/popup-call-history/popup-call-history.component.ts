import { Component, OnInit } from '@angular/core';
import { getFlagCall, getFlagEdit, getHistoryData, getRole, setFlagCall, setHistoryData } from '../../shared/services/auth.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService, NbDialogRef } from '@nebular/theme';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'ngx-popup-call-history',
  templateUrl: './popup-call-history.component.html',
  styleUrls: ['./popup-call-history.component.scss']
})
export class PopupCallHistoryComponent implements OnInit {
  itemCall: any = [];
  message: string = '';
  date: Date;
  innerWidth: any;
  innerHeight: any;
  _id: any;
  sErrorDate: string;
  loading: boolean = false;
  flagEdit: boolean = true;
  changeCall: any;
  data: any;
  hasEdit: boolean = false;
  role: any;
  missCall: boolean = false;
  constructor(
    public ref: NbDialogRef<PopupCallHistoryComponent>,
    private utilitiesService: UtilitiesService,
    public candidateService: CandidateService,
    private toastrService: NbToastrService,
    public matDialog: MatDialog,
  ) {
    this._id = getHistoryData();
    this.role = getRole();
    this.innerHeight = window.innerHeight * 0.9;
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard()
    this.flagEdit = getFlagEdit();
    this.changeCall = getFlagCall();
  }

  ngOnInit() {
    this.loading = true;
    this.getList();
  }

  getList() {
    this.candidateService.getListHistory(this._id.refCandidate._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.itemCall = response.data;
        this.itemCall.forEach(element => {
          element.canDelete = element.refUser._id === this.role._id ? true : false
        });
        setHistoryData(this.itemCall[this.itemCall.length - 1]);
      }
      this.loading = false;
    })
  }

  comment() {
    this.loading = true;
    this.data = {
      comment: this.message || '',
      callbackDate: this.date || null,
      flag: true,
      missCall: this.missCall
    }
    // if (this.changeCall) {
    //   this.data = {
    //     comment: this.message || '',
    //     callbackDate: this.date || null,
    //     flag: true,
    //     missCall: this.missCall
    //   }
    // } else {
    //   this.data = {
    //     comment: this.message || '',
    //     callbackDate: this.date || null,
    //     missCall: this.missCall
    //   }
    // }
    this.candidateService.candidateFlowEdit(this._id._id, { called: this.data }).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
        this.message = '';
        this.date = null;
        this.hasEdit = true;
        this.missCall = false;
        // if (this.changeCall) {
        //   this.hasEdit = true;
        // }
        // setHistoryData(this.data)
        this.getList();
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.loading = false;
      }
    })
  }

  close() {
    if (this.changeCall && !this.hasEdit) {
      setFlagCall();
    }
    this.ref.close(true)
  }

  delete(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'D' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.candidateService.deleteItemCall(item.refCandidateFlow, item._id).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.getList();
          }
        });
      }
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
