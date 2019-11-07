import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../pages/candidate/candidate.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId, getCandidateId, setCandidateId, setButtonId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { PopupPreviewEmailComponent } from '../../component/popup-preview-email/popup-preview-email.component';
import { LocationService } from '../../pages/setting/location/location.service'
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { PopupResendEmailComponent } from '../../component/popup-resend-email/popup-resend-email.component';
@Component({
  selector: 'ngx-popup-exam-date',
  templateUrl: './popup-exam-date.component.html',
  styleUrls: ['./popup-exam-date.component.scss']
})
export class PopupExamDateComponent implements OnInit {
  role: any;
  flowId: any;
  candidateId: any;
  stageId: any;
  buttonId: any;
  innerWidth: any;
  innerHeight: any;
  candidateName: string;
  jrName: string;
  date: Date;
  time: any;
  location: any;
  locations: DropDownValue[];
  loading: boolean;
  canApprove: boolean;

  constructor(
    private candidateService: CandidateService,
    private ref: NbDialogRef<PopupExamDateComponent>,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private locationService: LocationService,
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
    this.canApprove = false;
    this.candidateName = '';
    this.jrName = '';
    this.date = null;
    this.time = null;
    this.location = null;
    this.locations = [];
    if (this.flowId) {
      this.getLocation();
      this.getDetail();
    } else {
      this.ref.close();
    }
  }

  getLocation() {
    this.locations = [];
    this.locations.push({
      label: '- Select Location -',
      value: null,
    });
    this.locationService.getList().subscribe(response => {
      const locations = response.data.filter(element => {
        return element.active && !element.isDeleted;
      });
      if (locations.length) {
        locations.forEach(element => {
          this.locations.push({
            label: element.name,
            value: element._id,
          })
        });
        const location = locations.find(element => {
          return element.isDefault;
        });
        if (location) {
          this.location = location._id;
        }
      }
    });
  }

  getDetail() {
    this.loading = true;
    this.candidateService.getDetail(this.flowId).subscribe(response => {
      this.loading = false;
      if (response.code === ResponseCode.Success) {
        this.candidateName = this.utilitiesService.setFullname(response.data);
        this.jrName = response.data.candidateFlow.refJR.refJD.position;
        this.stageId = response.data.candidateFlow.refStage._id;
        this.buttonId = this.utilitiesService.findButtonIdByStage(this.stageId);

        if (this.utilitiesService.dateIsValid(response.data.candidateFlow.examInfo.date)) {
          this.location = response.data.candidateFlow.examInfo.refLocation._id || this.location;
          this.date = new Date(response.data.candidateFlow.examInfo.date);
          this.time = this.utilitiesService.convertDateToTimePicker(this.date);
        }
        if (response.data.candidateFlow.refStage.name === 'Appointment for Exam') {
          this.canApprove = true;
        }
      }
    });
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

  passToExam() {
    this.loading = true;
    const request = this.setRequest();
    this.candidateService.candidateFlowEdit(this.flowId, request).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.previewEmail();
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.ref.close();
      }
    });
  }

  previewEmail() {
    setFlowId(this.flowId);
    setCandidateId(this.candidateId);
    setButtonId(this.buttonId);
    this.dialogService.open(PopupPreviewEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      setButtonId();
      if (result) {
        this.ref.close(true);
      }
      this.loading = false;
    });
  }

  sendEmail() {
    setFlowId(this.flowId);
    setCandidateId(this.candidateId);
    this.save();
    this.dialogService.open(PopupResendEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
      this.ref.close(true);
    });
  }

  setRequest(): any {
    let date = new Date(this.date);
    date.setHours(this.time.hour);
    date.setMinutes(this.time.minute);
    const data = {
      examInfo: {
        date: date,
        refLocation: this.location,
        flag: true
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
