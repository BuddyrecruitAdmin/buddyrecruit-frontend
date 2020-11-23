import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';

@Component({
  selector: 'ngx-popup-sign-contract',
  templateUrl: './popup-sign-contract.component.html',
  styleUrls: ['./popup-sign-contract.component.scss']
})
export class PopupSignContractComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  stageId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  jrName: string;
  remain: number;
  capacity: number;
  substitution: boolean;
  loading: boolean;
  result: any;
  constructor(
    private candidateService: CandidateService,
    public ref: NbDialogRef<PopupSignContractComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    setFlowId();
    setCandidateId();
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerHeight = window.innerHeight * 0.8;
  }

  ngOnInit() {
    this.loading = true;
    this.candidateName = '';
    this.jrName = '';
    this.remain = 0;
    this.capacity = 10;
    this.substitution = false;
    if (this.flowId) {
      this.getDetail();
    } else {
      this.ref.close();
    }
  }

  getDetail() {
    this.candidateService.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.candidateName = this.utilitiesService.setFullname(response.data);
        this.jrName = response.data.candidateFlow.refJR.refJD.position;
        this.stageId = response.data.candidateFlow.refStage._id;
      }
      this.loading = false;
    });
    if (this.remain === 0) {
      this.substitution = true;
    }
  }

  save() {
    this.loading = true;
    const request = this.setRequest();
    this.candidateService.candidateFlowEdit(this.flowId, request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
      this.loading = false;
      this.ref.close(true);
    });
  }

  toSignContract() {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: 'Do you want to Sign Contract?' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        const request = this.setRequest();
        this.candidateService.candidateFlowEdit(this.flowId, request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.candidateService.candidateFlowApprove(this.flowId).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                if (response.code === ResponseCode.Success) {
                  this.showToast('success', 'Success Message', response.message);
                } else {
                  this.showToast('danger', 'Error Message', response.message);
                }
                this.loading = false;
                this.ref.close(true);
              }
            });
          }
        });
      }
    });
  }

  setRequest(): any {
    const data = {
      pendingInterviewInfo: {
        flag: true,
        ranking: 1,
        substitution: this.substitution
      }
    };
    return data;
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
