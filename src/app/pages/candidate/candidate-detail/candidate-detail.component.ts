import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { CandidateService } from '../candidate.service';
import { ResponseCode } from '../../../shared/app.constants';
import { getRole, getFlowId, setUserEmail, setCandidateId, setFlowId, setJdId, setJdName, setJrId, setButtonId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { PopupCommentComponent } from '../../../component/popup-comment/popup-comment.component';
import { PopupRejectComponent } from '../../../component/popup-reject/popup-reject.component';
import { MESSAGE } from "../../../shared/constants/message";
import { MENU_PROCESS_FLOW } from "../../pages-menu";
import { JdService } from '../../../pages/jd/jd.service';
import { PopupPreviewEmailComponent } from '../../../component/popup-preview-email/popup-preview-email.component';
import { PopupExamDateComponent } from '../../../component/popup-exam-date/popup-exam-date.component';
import { PopupExamInfoComponent } from '../../../component/popup-exam-info/popup-exam-info.component';
import { PopupExamScoreComponent } from '../../../component/popup-exam-score/popup-exam-score.component';
import { PopupInterviewDateComponent } from '../../../component/popup-interview-date/popup-interview-date.component';
import { PopupEvaluationComponent } from '../../../component/popup-evaluation/popup-evaluation.component';
import { PopupSignDateComponent } from '../../../component/popup-sign-date/popup-sign-date.component';
import { PrintCandidateComponent } from '../../../component/print-candidate/print-candidate.component';
import { Devices } from '../../../shared/interfaces/common.interface';

@Component({
  selector: 'ngx-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {
  role: any;
  steps: any;
  flowId: any;
  item: any = {};
  loading: boolean;
  interviewScores: any;
  condition: any;
  devices: Devices;
  constructor(
    private router: Router,
    private location: Location,
    private service: CandidateService,
    public utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private jdService: JdService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.role = getRole();
    this.flowId = getFlowId() || '';
    this.steps = this.role.refAuthorize.processFlow.exam.steps;
    this.devices = this.utilitiesService.getDevice();
  }

  ngOnInit() {
    this.condition = this.initialModel();
    this.interviewScores = [];
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        setFlowId(params.id);
        this.router.navigate(['/employer/candidate/detail']);
      } else {
        this.getDetail();
      }
    });
  }

  initialModel(): any {
    return {
      // step: {
      //   talentPool: false,
      //   pendingExam: false,
      //   pendingAppointment: false,
      //   pendingInterview: false,
      //   pendingSignContract: false,
      //   onboard: false,
      // },
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

  back() {
    setFlowId();
    setCandidateId();
    this.location.back();
  }

  getDetail() {
    this.loading = true;
    this.condition = this.initialModel();
    this.interviewScores = [];
    this.service.getDetail(this.flowId).subscribe(response => {
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
        const confirm = this.matDialog.open(PopupMessageComponent, {
          width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
          data: { type: 'I', content: 'No data found!' }
        });
        confirm.afterClosed().subscribe(result => {
          this.router.navigate(['/employer/candidate/list']);
        });
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

          if (item.candidateFlow.refJR.userInterviews.length) {
            const found = item.candidateFlow.refJR.userInterviews.find(element => {
              return element.refUser._id === this.role._id;
            });
            if (found) {
              this.condition.icon.interviewScore = true;
            }
          }
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
              // this.condition.icon.interviewDate = true;
              if (item.candidateFlow.refJR.userInterviews.length) {
                const found = item.candidateFlow.refJR.userInterviews.find(element => {
                  return element.refUser._id === this.role._id;
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
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingSignContractInfo.agreeStartDate)) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please input agree start date';
              } else if (this.utilitiesService.isDateGreaterThanToday(item.candidateFlow.pendingSignContractInfo.agreeStartDate)) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Agree start date is not arrived';
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

  gotoStage() {
    const menu = MENU_PROCESS_FLOW.find(element => {
      return element.title === this.item.candidateFlow.refStage.refMain.name;
    });
    menu.link = menu.link.replace('detail', 'list');
    if (menu) {
      this.router.navigate([menu.link]);
    } else {
      this.router.navigate(['/employer/home']);
    }
  }

  gotoJR() {
    let menu = MENU_PROCESS_FLOW.find(element => {
      return element.title === this.item.candidateFlow.refStage.refMain.name;
    });
    menu.link = menu.link.replace('list', 'detail');
    if (menu) {
      setJdId(this.item.candidateFlow.refJR.refJD._id);
      setJdName(this.item.candidateFlow.refJR.refJD.position);
      setJrId(this.item.candidateFlow.refJR._id);
      this.router.navigate([menu.link]);
    } else {
      this.router.navigate(['/employer/home']);
    }
  }

  approve(item: any, button: any) {
    if (item.email) {
      setUserEmail(item.email);
    }
    setFlowId(item.candidateFlow._id);
    setCandidateId(item._id);
    setButtonId(button._id);
    this.dialogService.open(PopupPreviewEmailComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      setButtonId();
      if (result) {
        this.getDetail();
      }
    });
  }

  reject(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(item._id);
    this.dialogService.open(PopupRejectComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.getDetail();
      }
    });
  }

  revoke(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: MESSAGE[44] }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.candidateFlowRevoke(item.candidateFlow._id, item.candidateFlow.refStage._id).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.getDetail();
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    });
  }

  openPopupComment(item: any) {
    setFlowId(item.candidateFlow._id);
    this.dialogService.open(PopupCommentComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      if (result) {
        this.getDetail();
      }
    });
  }

  openPopupExamDate(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(item._id);
    this.dialogService.open(PopupExamDateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.getDetail();
      }
    });
  }

  openPopupExamInfo(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(item._id);
    this.dialogService.open(PopupExamInfoComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.getDetail();
      }
    });
  }

  openPopupExamScore(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(item._id);
    this.dialogService.open(PopupExamScoreComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.getDetail();
      }
    });
  }

  openPopupInterviewDate(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(item._id);
    setJrId(item.candidateFlow.refJR._id);
    this.dialogService.open(PopupInterviewDateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      setJrId();
      if (result) {
        this.getDetail();
      }
    });
  }

  openPopupInterviewScore(item: any) {
    // setFlowId(item.candidateFlow._id);
    setFlowId();
    setCandidateId(item.candidateFlow._id);
    this.dialogService.open(PopupEvaluationComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.getDetail();
      }
    });
  }

  openPopupSignContractDate(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(item._id);
    this.dialogService.open(PopupSignDateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      if (result) {
        this.getDetail();
      }
    });
  }

  openPrintCandidate(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(item._id);
    this.dialogService.open(PrintCandidateComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
    });
  }

  checkCV(id) {
    this.jdService.originalCV(id, this.role._id)
      .subscribe(data => this.downloadFile(data), function (error) {
        //that.setAlertMessage("E", error.statusText);
      });
  }

  downloadFile(data: any) {
    const blob = new Blob([data], { type: "text/pdf" });
    const url = window.URL.createObjectURL(data);
    window.open(url);
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
