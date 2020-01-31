import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, getCandidateId } from '../../shared/services/auth.service';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-print-candidate',
  templateUrl: './print-candidate.component.html',
  styleUrls: ['./print-candidate.component.scss']
})
export class PrintCandidateComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  item: any = {};
  loading: boolean = true;
  interviewScores: any;
  condition: any;
  innerWidth: any;
  innerHeight: any;

  constructor(
    private ref: NbDialogRef<PrintCandidateComponent>,
    private candidateService: CandidateService,
    public utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.flowId = getFlowId();
    this.candidateId = getCandidateId();
    this.innerWidth = window.innerWidth * 0.8;
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    if (this.flowId) {
      this.condition = this.initialModel();
      this.interviewScores = [];
      this.getDetail();
    } else {
      this.ref.close();
    }
  }

  initialModel(): any {
    return {
      block: {
        examDate: false,
        examInfo: false,
        examScore: false,
        interviewDate: false,
        interviewScore: false,
        signContract: false,
        onboard: false,
      },
      icon: {
        examDate: false,
        examInfo: false,
        examScore: false,
        interviewDate: false,
        interviewScore: false,
        signContract: false,
      },
      button: {
        step: {},
        nextStep: false,
        comment: false,
        reject: false,
        revoke: false,
        disabled: false,
        errMsg: ''
      },
      isExpired: false
    };
  }

  getDetail() {
    this.candidateService.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.item = response.data;
        if (this.item.candidateFlow.pendingInterviewScoreInfo.flag) {
          this.interviewScores = [];
          if (this.item.candidateFlow.pendingInterviewScoreInfo.evaluation.length) {
            this.item.candidateFlow.pendingInterviewScoreInfo.evaluation.forEach(element => {
              if (this.item.candidateFlow.refJR.userInterviews || this.item.candidateFlow.refJR.userInterviews.length) {
                const refUser = this.item.candidateFlow.refJR.userInterviews.find(user => {
                  return user.refUser._id === element.createdInfo.refUser._id;
                });
                if (refUser) {
                  const result = element.rank.options.find(rank => {
                    return rank.value === element.rank.selected;
                  });
                  this.interviewScores.push({
                    name: this.utilitiesService.setFullname(refUser.refUser),
                    result: (result && result.subject) || '',
                    remark: ''
                  });
                }
              }
            });
          }
        }
        this.setCondition(this.item);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
      this.loading = false;
    });
  }



  setCondition(item: any) {
    let step: any;
    if (item.candidateFlow.refJR.requiredExam) {
      step = this.role.refAuthorize.processFlow.exam.steps.find(step => {
        return step.refStage._id === item.candidateFlow.refStage._id;
      });
    } else {
      step = this.role.refAuthorize.processFlow.noExam.steps.find(step => {
        return step.refStage._id === item.candidateFlow.refStage._id;
      });
    }
    if (step) {
      this.condition.button.step = step;
      this.condition.button.comment = true;

      // Set display block
      switch (step.refStage.order) {
        case 101:
          break;
        case 102:
          break;
        case 103:
          this.condition.block.examDate = true;
          break;
        case 201:
          this.condition.block.examDate = true;
          this.condition.block.examInfo = true;
          break;
        case 202:
          this.condition.block.examDate = true;
          this.condition.block.examInfo = true;
          this.condition.block.examScore = true;
          break;
        case 301:
          this.condition.block.examDate = true;
          this.condition.block.examInfo = true;
          this.condition.block.examScore = true;
          this.condition.block.interviewDate = true;
          break;
        case 401:
          this.condition.block.examDate = true;
          this.condition.block.examInfo = true;
          this.condition.block.examScore = true;
          this.condition.block.interviewDate = true;
          break;
        case 402:
          this.condition.block.examDate = true;
          this.condition.block.examInfo = true;
          this.condition.block.examScore = true;
          this.condition.block.interviewDate = true;
          this.condition.block.interviewScore = true;
          break;
        case 501:
          this.condition.block.examDate = true;
          this.condition.block.examInfo = true;
          this.condition.block.examScore = true;
          this.condition.block.interviewDate = true;
          this.condition.block.interviewScore = true;
          this.condition.block.signContract = true;
          break;
        case 601:
          this.condition.block.examDate = true;
          this.condition.block.examInfo = true;
          this.condition.block.examScore = true;
          this.condition.block.interviewDate = true;
          this.condition.block.interviewScore = true;
          this.condition.block.signContract = true;
          this.condition.block.onboard = true;
          break;
        default:
          break;
      }

      // Set action
      if (step.editable) {
        if (item.candidateFlow.reject.flag) {
          if (step.refStage.order !== 202 && step.refStage.order !== 402) {
            this.condition.button.revoke = true;
          }
        } else {
          this.condition.button.nextStep = true;
          this.condition.button.reject = true;
          switch (step.refStage.order) {
            case 101:
              break;
            case 102:
              break;
            case 103:
              this.condition.icon.examDate = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.examInfo.date)) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please select exam date';
              }
              break;
            case 201:
              this.condition.icon.examDate = true;
              this.condition.icon.examInfo = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.examInfo.date)) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please select exam date';
              } else if (item.candidateFlow.pendingExamInfo) {
                if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingExamInfo.availableDate)
                  && !item.candidateFlow.pendingExamInfo.afterSignContract) {
                  this.condition.button.disabled = true;
                  this.condition.button.errMsg = 'Please input exam info';
                }
              }
              break;
            case 202:
              this.condition.icon.examInfo = true;
              this.condition.icon.examScore = true;
              if (item.candidateFlow.pendingExamScoreInfo) {
                if (!item.candidateFlow.pendingExamScoreInfo.examScore
                  || !item.candidateFlow.pendingExamScoreInfo.attitudeScore) {
                  this.condition.button.disabled = true;
                  this.condition.button.errMsg = 'Please input exam score';
                }
              }
              break;
            case 301:
              this.condition.icon.interviewDate = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingInterviewInfo.startDate)
                || !item.candidateFlow.pendingInterviewInfo.refLocation) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please input interview date';
              }
              break;
            case 401:
              this.condition.icon.interviewDate = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingInterviewInfo.startDate)
                || !item.candidateFlow.pendingInterviewInfo.refLocation) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please input interview date';
              }
              break;
            case 402:
              this.condition.icon.interviewDate = true;
              if (item.candidateFlow.refJR.userInterviews.length) {
                const found = item.candidateFlow.refJR.userInterviews.find(element => {
                  return element.refUser === this.role._id;
                });
                if (found) {
                  this.condition.icon.interviewScore = true;
                }
              }
              if (!item.candidateFlow.pendingInterviewScoreInfo.evaluation.length) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please input interview score';
              }
              break;
            case 501:
              this.condition.icon.signContract = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingSignContractInfo.sign.date)) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please input sign contract info';
              } else if (this.utilitiesService.isDateGreaterThanToday(item.candidateFlow.pendingSignContractInfo.sign.date)) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Sign contract date is not arrived';
              }
              break;
            case 601:
              this.condition.icon.signContract = true;
              if (this.utilitiesService.isDateGreaterThanToday(item.candidateFlow.pendingSignContractInfo.agreeStartDate)) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Onboard date is not arrived';
              }
              break;
            default:
              break;
          }
        }
      }
      // Set when expired
      if (item.candidateFlow.refJR.refStatus.status !== 'JRS002') {
        this.condition.isExpired = true;
        this.condition.icon.interviewDate = false;
        this.condition.icon.examDate = false;
        this.condition.icon.examInfo = false;
        this.condition.icon.examScore = false;
        this.condition.icon.interviewDate = false;
        this.condition.icon.interviewScore = false;
        this.condition.icon.signContract = false;
        if (step.editable) {
          this.condition.button.comment = true;
          this.condition.button.nextStep = true;
          this.condition.button.reject = true;
          this.condition.button.disabled = true;
          this.condition.button.errMsg = 'This JR is expired';
        } else {
          this.condition.button.comment = false;
          this.condition.button.nextStep = false;
          this.condition.button.reject = false;
          this.condition.button.revoke = false;
        }
      }
    }
  }

  print() {
    // this.ref.close();
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', '');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Buddy Recruit</title>
          <style>
            body {
              font-family: Open Sans, sans-serif;
              line-height: 1.5rem;
            }
            .row {
              display: -webkit-box;
              display: flex;
              flex-wrap: wrap;
            }
            .col-md-6 {
              -webkit-box-flex: 0;
              flex: 0 0 50%;
              max-width: 50%;
            }
            .topic {
              color: #d2d6d9;
              line-height: 2rem;
            }
            .m-l-15 {
              margin-left: 15px;
            }
            .text-group {
              line-height: 1.5rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .text-group label {
              color: #8f9bb3;
              font-family: Open Sans, sans-serif;
              font-size: 0.8rem;
              font-weight: 700;
              line-height: 1rem;
            }
            .text-group label::after {
              content: ' :';
              margin-right: 0.25rem;
            }

          </style>
        </head>
        <body onload="window.print(); window.close()">
          ${printContents}
        </body>
      </html>`
    );
    popupWin.document.close();
  }

  cancel() {
    this.ref.close();
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
