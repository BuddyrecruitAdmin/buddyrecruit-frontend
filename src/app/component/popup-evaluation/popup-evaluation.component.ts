import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-popup-evaluation',
  templateUrl: './popup-evaluation.component.html',
  styleUrls: ['./popup-evaluation.component.scss']
})
export class PopupEvaluationComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  stageId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  jrName: string;
  loading: boolean;
  result: boolean = false;
  evaluation: any;

  constructor(
    private candidateService: CandidateService,
    private ref: NbDialogRef<PopupEvaluationComponent>,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    setFlowId();
    setCandidateId();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.evaluation = {
      basicApplicants: [
        {
          topic: 'การศึกษา',
          choices: [
            {
              label: 'ตรงตามสายงาน',
              value: 1
            },
            {
              label: 'ไม่ตรงตามสายงาน',
              value: 2
            }
          ],
          selected: null,
          isDeleted: false
        },
        {
          topic: 'ประสบการณ์',
          choices: [
            {
              label: 'ตรงตามสายงาน',
              value: 1
            },
            {
              label: 'ไม่ตรงตามสายงาน',
              value: 2
            }
          ],
          selected: null,
          isDeleted: false
        },
        {
          topic: 'ประวัติการเปลี่ยนงาน',
          choices: [
            {
              label: 'ไม่ค่อยเปลี่ยนงาน',
              value: 1
            },
            {
              label: 'เปลี่ยนงานบ่อย',
              value: 2
            }
          ],
          selected: null,
          isDeleted: false
        },
        {
          topic: 'ที่พัก',
          choices: [
            {
              label: 'ใกล้บริษัท',
              value: 1
            },
            {
              label: 'ไกลบริษัท',
              value: 2
            }
          ],
          selected: null,
          isDeleted: false
        },
        {
          topic: 'ประสบการณ์ด้าน ISO',
          choices: [
            {
              label: 'ดี',
              value: 1
            },
            {
              label: 'พอใช้',
              value: 2
            },
            {
              label: 'ไม่ดี',
              value: 3
            }
          ],
          selected: null,
          isDeleted: false
        }
      ],
      categories: [
        {
          topic: 'ท่าทาง บุคลิกภาพ',
          selected: null
        },
        {
          topic: 'การตรงต่อเวลา',
          selected: null
        },
        {
          topic: 'ความละเอียดรอบคอบ',
          selected: null
        },
        {
          topic: 'ทัศนคติต่อ ตนเอง ผู้อื่น และต่องาน',
          selected: null
        },
        {
          topic: 'การตอบคำถามอย่างมีเหตุผล',
          selected: null
        },
      ],
      rank: {
        choices: [
          {
            label: 'ผ่าน และทาการนัดต้นสังกัดสัมภาษณ์',
            value: 1,
            minScore: 30,
            maxScore: 50,
          },
          {
            label: 'รอเปรียบเทียบผู้สมัครคนอื่นๆ',
            value: 2,
            minScore: 26,
            maxScore: 29,
          },
          {
            label: 'ไม่ผ่านการสัมภาษณ์',
            value: 3,
            minScore: 0,
            maxScore: 25,
          }
        ],
        selected: null
      },
      scoring: [
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
      ],
      remark: '',
      score: null
    };

    this.loading = true;
    this.candidateName = '';
    this.jrName = '';
    if (this.flowId) {
      this.getDetail();
    } else {
      this.ref.close();
    }
  }

  getDetail() {
    this.candidateService.getDetail(this.candidateId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.candidateName = this.utilitiesService.setFullname(response.data);
        this.jrName = response.data.candidateFlow.refJR.refJD.position;
        this.stageId = response.data.candidateFlow.refStage._id;
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.ref.close();
      }
      this.loading = false;
    });
  }

  sumScore(): number {
    let score = 0;
    this.evaluation.categories.forEach(element => {
      if (element.selected) {
        score += element.selected;
      }
    });
    this.evaluation.score = score;
    return score;
  }

  validation(): boolean {
    let isValid = true;
    let invalid: any;
    invalid = this.evaluation.basicApplicants.find(element => {
      if (!element.selected) {
        return element;
      }
    });
    if (invalid) {
      return false;
    }
    invalid = this.evaluation.categories.find(element => {
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

  setRequest(): any {
    const data = {

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
