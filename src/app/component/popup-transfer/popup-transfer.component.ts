import { Component, OnInit, TemplateRef } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { getJdName, getFlowId, setFlowId, getCandidateId, setCandidateId, setButtonId, getFieldName, setIconId, getIconId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService, NbDialogRef, NbDialogService } from '@nebular/theme';
import { PopupTransferService } from './popup-transfer.service';
import { validateEvents } from 'angular-calendar/modules/common/util';
import { DropDownValue, DropDownGroup } from '../../shared/interfaces/common.interface';
import { resolve } from 'url';

@Component({
  selector: 'ngx-popup-transfer',
  templateUrl: './popup-transfer.component.html',
  styleUrls: ['./popup-transfer.component.scss']
})
export class PopupTransferComponent implements OnInit {
  flowId: any;
  candidateName: any;
  user: any;
  jrName: string;
  items: any;
  transList: any;
  innerHeight: any;
  innerCardHeight: any;
  innerCardBodyHeight: any;
  innerWidth: any;
  term: any;
  transShow: any;
  constructor(
    private service: PopupTransferService,
    public ref: NbDialogRef<PopupTransferComponent>,
    private toastrService: NbToastrService,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService
  ) {
    this.candidateName = getFieldName();
    this.jrName = getJdName();
    this.flowId = getFlowId();
    this.innerCardBodyHeight = window.innerHeight * 0.55;
    this.innerCardHeight = window.innerHeight * 0.95;
    this.innerHeight = window.innerHeight * 0.9;
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
  }

  ngOnInit() {
    this.items = [];
    this.transList = [];
    this.transShow = [];
    this.service.geListJR(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
      }
    })
    // this.service.getListDepartment(this.flowId).subscribe(response => {
    //   if (response.code === ResponseCode.Success) {
    //     response.data.forEach(element => {
    //       this.departments.push({
    //         label: element.name,
    //         value: element._id,
    //         group: element.hasDivision
    //       })
    //     });
    //   }
    // })
  }

  transferList(item) {
    this.transList.push({
      candidateFlowId: this.flowId,
      jrId: item._id
    });
    this.transShow.push(item)
  }
  // onChangeDepartment(value) {
  //   this.divisions = [];
  //   this.divisions.push({
  //     label: 'select division',
  //     value: undefined
  //   })
  //   this.service.geListDivision(value).subscribe(response => {
  //     if (response.code === ResponseCode.Success) {
  //       if (response.data.length) {
  //         response.data.forEach(element => {
  //           this.divisions.push({
  //             label: element.name,
  //             value: element._id
  //           })
  //         });
  //         this.hasDivision = true;
  //         this.showJR = false;
  //         this.user.jr = null;
  //       } else {
  //         this.hasDivision = false;
  //         this.showJR = true;
  //         this.user.divisionId = null;
  //         this.onChangeDivision(null);
  //       }
  //     }
  //   })
  // }

  // onChangeDivision(value) {
  //   this.JRs = [];
  //   this.JRs.push({
  //     label: 'select jr',
  //     value: undefined
  //   })
  //   this.service.geListJR(this.flowId, this.user.departmentId, value).subscribe(response => {
  //     if (response.code === ResponseCode.Success) {
  //       response.data.forEach(element => {
  //         this.JRs.push({
  //           label: element.refJD.position,
  //           value: element._id
  //         })
  //       });
  //       this.showJR = true;
  //     }
  //   })
  // }

  save(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog).onClose.subscribe(res => {
      if (res === true) {
        this.service.edit(this.transList).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.ref.close()
          }
        })
      }
    })
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
