import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { CandidateService } from '../candidate.service';
import { ResponseCode } from '../../../shared/app.constants';
import { getRole, getFlowId, setUserEmail, setCandidateId, setFlowId, setJdId, setJdName, setJrId, setButtonId, setFieldName, setExamId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService, NbDialogRef } from '@nebular/theme';
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
import { PopupOnboardDateComponent } from '../../../component/popup-onboard-date/popup-onboard-date.component';
import { PrintCandidateComponent } from '../../../component/print-candidate/print-candidate.component';
import { Devices } from '../../../shared/interfaces/common.interface';
import { PopupResendEmailComponent } from '../../../component/popup-resend-email/popup-resend-email.component';
import { PopupTransferComponent } from '../../../component/popup-transfer/popup-transfer.component';
import { DropDownValue } from '../../../shared/interfaces/common.interface';
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
  onMail: boolean = true;
  examUserId: any;
  dialogRef: NbDialogRef<any>;
  listExamDialog: any;
  ExamLists: DropDownValue[];
  filteredListExam: any;
  exanTest: any;
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
    this.exanTest = [];
    this.ExamLists = [];
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        setFlowId(params.id);
        this.router.navigate(['/employer/candidate/detail']);
      } else {
        this.getDetail();
      }
    });
  }

  examShowList() {
    this.service.getListExamOnline(this.item.candidateFlow.refJR._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data.exams) {
          console.log(response.data.exams)
          response.data.exams.map(element => {
            this.ExamLists.push({
              label: element.refExam.name,
              value: element.refExam._id
            });
          });
          this.filteredListExam = this.ExamLists.slice();
          console.log(this.filteredListExam)
          console.log(this.ExamLists)
        }
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
        reject: false,
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
        errMsg: '',
        send: false,
        trans: false
      },
      isExpired: false
    };
  }

  back() {
    if (!this.item.blacklist) {
      this.gotoJR();
    } else {
      this.router.navigate(["/employer/setting/blacklist"]);
    }
  }

  getDetail() {
    this.loading = true;
    this.condition = this.initialModel();
    this.interviewScores = [];
    this.service.getDetail(this.flowId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.item = response.data;
        if (this.item.candidateFlow.refJR._id) {
          this.examShowList();
        }
        if (this.item.candidateFlow.pendingInterviewScoreInfo.flag) {
          if (this.item.candidateFlow.pendingInterviewInfo.userInterviews && this.item.candidateFlow.pendingInterviewInfo.userInterviews.length) {
            this.item.candidateFlow.pendingInterviewInfo.userInterviews.forEach(userInterview => {
              let result: any;
              if (this.item.candidateFlow.pendingInterviewScoreInfo.evaluation.length) {
                const evaluation = this.item.candidateFlow.pendingInterviewScoreInfo.evaluation.find(evaluation => {
                  return evaluation.createdInfo.refUser._id === userInterview.refUser._id
                    || evaluation.createdInfo.refUser._id === userInterview.refUser;
                });
                if (evaluation) {
                  result = evaluation.rank.options.find(option => {
                    return option.value === evaluation.rank.selected;
                  });
                }
              }
              this.interviewScores.push({
                name: this.utilitiesService.setFullname(userInterview.refUser),
                result: (result && result.subject) || '',
                remark: ''
              });
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
        case 202://exam score
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
      if (item.candidateFlow.reject.flag) {
        this.condition.block.reject = true;
      }

      // Set action
      if (step.editable) {
        if (item.candidateFlow.reject.flag || item.blacklist) {
          if (step.refStage.order !== 202 && step.refStage.order !== 402) {
            this.condition.button.revoke = true;
          } else {
            this.condition.button.send = true;
          }
        } else {
          this.condition.button.nextStep = true;
          this.condition.button.reject = true;
          switch (step.refStage.order) {
            case 101:
              this.condition.button.trans = true;
              break;
            case 102:
              this.condition.button.trans = true;
              break;
            case 103:
              this.condition.icon.examDate = true;
              this.condition.button.trans = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.examInfo.date)) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please select exam date';
              }
              break;
            case 104:
              this.condition.button.trans = true;
              break;
            case 201:
              this.condition.icon.examDate = true;
              this.condition.icon.examInfo = true;
              this.condition.button.trans = true;
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
              this.condition.button.trans = true;
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
              this.condition.button.trans = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingInterviewInfo.startDate)
                || !item.candidateFlow.pendingInterviewInfo.refLocation) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please input interview date';
              }
              break;
            case 401:
              this.condition.icon.interviewDate = true;
              this.condition.button.trans = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingInterviewInfo.startDate)
                || !item.candidateFlow.pendingInterviewInfo.refLocation) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please input interview date';
              }
              break;
            case 402:
              // this.condition.icon.interviewDate = true;
              this.condition.button.trans = true;
              if (!item.candidateFlow.pendingInterviewScoreInfo.evaluation.length) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please input interview score';
              }
              if (item.candidateFlow.pendingInterviewInfo.userInterviews.length) {
                const found = item.candidateFlow.pendingInterviewInfo.userInterviews.find(element => {
                  return element.refUser._id === this.role._id || element.refUser === this.role._id;
                });
                if (found) {
                  this.condition.icon.interviewScore = true;
                }
              }
              break;
            case 501:
              this.condition.icon.signContract = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingSignContractInfo.sign.date)
              ) {
                this.condition.button.errMsg = 'Please input sign contract info';
                this.condition.button.disabled = true;
              } else {
                if (!item.email) {
                  this.condition.button.errMsg = " Email not found, Can't send email to candidate.";
                } else if (this.utilitiesService.isDateGreaterThanToday(item.candidateFlow.pendingSignContractInfo.sign.date)) {
                  this.condition.button.disabled = true;
                  this.condition.button.errMsg = 'Sign contract date is not arrived';
                } else if (!item.candidateFlow.pendingSignContractInfo.mail.flag) {
                  this.condition.button.disabled = true;
                  this.condition.button.errMsg = 'Please sent email in sign contract info';
                }
                if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingSignContractInfo.agreeStartDate)) {
                  this.onMail = false;
                }
              }
              break;
            case 601:
              debugger
              this.condition.icon.onboard = true;
              if (!this.utilitiesService.dateIsValid(item.candidateFlow.pendingSignContractInfo.agreeStartDate)) {
                this.condition.button.disabled = true;
                this.condition.button.errMsg = 'Please input onboard date';
              } else {
                if (!item.email) {
                  this.condition.button.errMsg = "Email not found, Can't send email to candidate.";
                }
                if (!item.candidateFlow.onboard.mail.flag) {
                  this.condition.button.disabled = true;
                  this.condition.button.errMsg = ' Plesae send email in onboard info';
                }
                if (this.utilitiesService.isDateGreaterThanToday(item.candidateFlow.pendingSignContractInfo.agreeStartDate)) {
                  this.condition.button.disabled = true;
                  this.condition.button.errMsg = ' date is not arrived';
                }
              }
              break;
            default:
              break;
          }
        }
      } else {
        if (item.candidateFlow.pendingInterviewInfo.userInterviews.length && this.condition.block.interviewScore) {
          const found = item.candidateFlow.pendingInterviewInfo.userInterviews.find(element => {
            return element.refUser._id === this.role._id || element.refUser === this.role._id;
          });
          if (found && step.refStage.order === 402) {
            this.condition.icon.interviewScore = true;
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
    if (this.onMail) {
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
    } else {
      this.nextStep(item, button);
    }
  }

  nextStep(item: any, button: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: `Do you want to pass to onboard?` }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.candidateFlowApprove(item.candidateFlow._id, item.candidateFlow.refStage._id, button._id, item).subscribe(response => {
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
        if (item.candidateFlow.reject.flag) {
          this.service.candidateFlowRevoke(item.candidateFlow._id, item.candidateFlow.refStage._id).subscribe(response => {
            if (response.code === ResponseCode.Success) {
              this.showToast('success', 'Success Message', response.message);
              this.getDetail();
            } else {
              this.showToast('danger', 'Error Message', response.message);
            }
          });
        }
        if (item.blacklist === true) {
          this.service.candidateUnblock(item._id, item.candidateFlow._id).subscribe(response => {
            if (response.code === ResponseCode.Success) {
              this.showToast('success', 'Success Message', response.message);
              this.getDetail();
            } else {
              this.showToast('danger', 'Error Message', response.message);
            }
          });
        }
      }
    });
  }

  openPopupTransfer(item: any) {
    setFlowId(item.candidateFlow._id);
    setFieldName(this.utilitiesService.setFullname(item));
    setJdName(item.candidateFlow.refJR.refJD.position);
    this.dialogService.open(PopupTransferComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      if (result) {
        // this.getDetail();
        this.router.navigate(['/employer/talent-pool/list']);
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

  openPopupOnboardDate(item: any) {
    setFlowId(item.candidateFlow._id);
    setCandidateId(item._id);
    this.dialogService.open(PopupOnboardDateComponent,
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

  sendEmail(item: any) {
    setFlowId(item.candidateFlow._id);
    this.dialogService.open(PopupResendEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      this.getDetail()
      setFlowId();
      setCandidateId();
    });
  }

  openPopupSendExam(dialog: TemplateRef<any>, _id) {
    this.examUserId = _id;
    this.callDialog(dialog);
  }

  sendExam() {
    setExamId(this.exanTest)
    setCandidateId(this.examUserId);
    this.dialogService.open(PopupResendEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setExamId();
      setCandidateId();
      this.getDetail();
    });
    // this.service.semdExam(this.exanTest, this.examUserId).subscribe((response) => {
    //   if (response.code === ResponseCode.Success) {
    //     this.showToast('success', 'Success Message', response.message);
    //     this.getDetail();
    //   } else {
    //     this.showToast('danger', 'Error Message', response.message);
    //   }
    // })
    // this.dialogRef.close();
  }

  checkExam(dialog: TemplateRef<any>, item, _id) {
    this.examUserId = _id;
    this.listExamDialog = item;
    this.callDialog(dialog)
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  }

  showExamCand(examId) {
    const path = '/exam-form/view/' + examId + '/' + this.examUserId;
    this.router.navigate([path]);
    // this.service.answerExam(this.examUserId, examId).subscribe((response) => {
    //   if (response.code === ResponseCode.Success) {

    //   } else {
    //     this.showToast('danger', 'Error Message', response.message);
    //   }
    // })
  }


  downloadFile(data: any) {
    const blob = new Blob([data], { type: "text/pdf" });
    const url = window.URL.createObjectURL(data);
    // window.open(url);
    window.location.assign(url);//open in current tab not new tab
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
