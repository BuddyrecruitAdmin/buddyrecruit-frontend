import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { EvaluationService } from '../../pages/setting/evaluation/evaluation.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import * as _ from 'lodash';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Devices } from '../../shared/interfaces/common.interface';

@Component({
  selector: 'ngx-popup-evaluation',
  templateUrl: './popup-evaluation.component.html',
  styleUrls: ['./popup-evaluation.component.scss']
})
export class PopupEvaluationComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  innerWidth: any;
  innerHeight: any;
  loading: boolean;
  result: boolean = false;
  evaluation: any;
  scoring: any;
  editable: boolean;
  state: string;
  devices: Devices;
  constructor(
    private candidateService: CandidateService,
    private evaluationService: EvaluationService,
    public ref: NbDialogRef<PopupEvaluationComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    setFlowId();
    setCandidateId();
    // this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.9;
    this.devices = this.utilitiesService.getDevice();
  }

  ngOnInit() {
    this.scoring = [
      {
        label: 'ดีมาก',
        value: 5
      },
      {
        label: 'ดี',
        value: 4
      },
      {
        label: 'ปานกลาง',
        value: 3
      },
      {
        label: 'พอใช้',
        value: 2
      },
      {
        label: 'ไม่ดี',
        value: 1
      },
    ];
    this.loading = true;
    this.editable = false;
    this.state = "";
    this.evaluation = {};
    if (this.flowId) {
      this.state = "Preview";
      this.getDetailPreview();
    } else if (this.candidateId) {
      this.editable = true;
      this.getDetail();
    } else {
      this.ref.close();
    }
  }

  getDetailPreview() {
    this.evaluationService.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.evaluation = response.data;
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.ref.close();
      }
      this.loading = false;
    });
  }

  getDetail() {
    this.candidateService.evaluationDetail(this.candidateId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        response.data.map(element => {
          if (this.role._id === element.createdInfo.refUser) {
            this.evaluation = element;
          }
        })
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.ref.close();
      }
      this.loading = false;
    });
  }


  sumScore(event, index) {
    let score = 0;
    this.evaluation.evaCategories[index].selected = event;
    this.evaluation.evaCategories.forEach(element => {
      if (element.selected) {
        score += element.selected;
      }
    });
    this.evaluation.point = score;
    this.checkRank();
  }

  checkRank() {
    if (this.evaluation.point <= this.evaluation.rank.options[2].max) {
      this.evaluation.rank.selected = 3;
    } else if (this.evaluation.point <= this.evaluation.rank.options[1].max) {
      this.evaluation.rank.selected = 2;
    } else {
      this.evaluation.rank.selected = 1;
    }
  }

  validation(): boolean {
    let isValid = true;
    let invalid: any;
    invalid = this.evaluation.evaCategories.find(element => {
      if (!element.selected) {
        return element;
      }
    });
    if (invalid) {
      return false;
    }
    if (!this.evaluation.rank.selected) {
      return false;
    }
    return isValid;
  }

  save() {
    this.loading = true;
    const request = this.setRequest();
    if (this.validation()) {
      this.candidateService.evaluationEdit(this.candidateId, request).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.showToast('success', 'Success Message', response.message);
        } else {
          this.showToast('danger', 'Error Message', response.message);
        }
        this.ref.close(true);
      });
    } else {
      this.loading = false;
      this.showToast('danger', 'Error Message', 'Please complete all required fields');
    }
  }

  setRequest(): any {
    const data = _.cloneDeep(this.evaluation);
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
