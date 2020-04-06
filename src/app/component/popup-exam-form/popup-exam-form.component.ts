import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../pages/exam/exam.service';
import { ResponseCode, Paging } from '../../shared/app.constants';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId, setCandidateId, setButtonId, setUserEmail, setFieldName, setJdName, setExamId, setJrId, getExamId, getCandidateId } from '../../shared/services/auth.service';
import { PopupResendEmailComponent } from '../../component/popup-resend-email/popup-resend-email.component';
import { NbDialogService } from '@nebular/theme';
import { NbDialogRef, NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { UtilitiesService } from '../../shared/services/utilities.service';
@Component({
  selector: 'ngx-popup-exam-form',
  templateUrl: './popup-exam-form.component.html',
  styleUrls: ['./popup-exam-form.component.scss']
})
export class PopupExamFormComponent implements OnInit {
  ExamLists: DropDownValue[];
  filteredListExam: any;
  jrId: any;
  exanTest: any;
  examUserId: any;
  constructor(
    private service: ExamService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private utilitiesService: UtilitiesService,
    public ref: NbDialogRef<PopupExamFormComponent>,
  ) {
    this.jrId = getJrId();
    this.examUserId = getCandidateId();
  }

  ngOnInit() {
    this.ExamLists = [];
    if (this.jrId) {
      this.examShowList();
    } else {
      this.ref.close();
    }
  }

  examShowList() {
    this.service.getListExamOnline(this.jrId).subscribe(response => {
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
        }
      }
    });
  }

  sendExam() {
    this.ref.close();
    setExamId(this.exanTest)
    setCandidateId(this.examUserId);
    this.dialogService.open(PopupResendEmailComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      this.ref.close();
      setExamId();
      setCandidateId();
    });
  }


}
