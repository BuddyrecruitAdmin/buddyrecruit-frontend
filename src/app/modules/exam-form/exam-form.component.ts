import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ExamFormService, } from './exam-form.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { getRole, setLanguage, getLanguage, setLangPath, getFlagExam, getExamData, setExamData } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { resolve } from 'dns';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { utimes } from 'fs';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { TranslateService } from '../../translate.service';
import * as _ from 'lodash';
import 'style-loader!angular2-toaster/toaster.css';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MESSAGE } from "../../shared/constants/message";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from "@angular/router";
import { isSameDay } from 'date-fns';
@Component({
  selector: 'ngx-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.scss']
})
export class ExamFormComponent implements OnInit {
  _id: any;
  examId: any;
  topicOption: any;
  loading: boolean;
  isUser: boolean;
  actionView: boolean;
  fileText: any;
  imgHeight: number;
  done: any;
  dialogRef: NbDialogRef<any>;
  getOptionImg: any;
  innerHeight: any;
  examName: string;
  // countConfig: CountdownConfig = {
  //   leftTime: 50,
  //   demand: false,
  // };
  checkStart: boolean;
  dateStart: any;
  dateNow: any;
  timeCount: boolean;
  interVal: any;
  miN: any;
  seC: any;
  TotalTime: any;
  flagExam: any;
  examData: any;
  isExpired: any;
  constructor(
    private service: ExamFormService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
    public matDialog: MatDialog,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    this.flagExam = getFlagExam();
    this.examData = getExamData();
    config.backdrop = 'static';
    config.keyboard = false;
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.topicOption = [];
    this.actionView = false;
    this.checkStart = false;
    this.timeCount = false;
    this.loading = true;
    this.TotalTime = 0;
    // this.isUser = false;
    this.activatedRoute.params.subscribe(params => {
      this._id = undefined;
      if (params.id) {
        this._id = params.id;
        this.examId = params.examId;
        console.log(params)
        if (params.action === "view") {
          this.actionView = true;
          // this.isUser = true;
          this.getDetailAnswer();
        } else {
          this.getDetail();
        }
      }
    });
  }

  start() {
    this.getDetail();
  }

  getDetail() {
    this.loading = true;
    this.service.getDetail(this._id, this.examId, this.checkStart).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.examName = response.data.name;
        this.topicOption = response.data.exams;
        this.done = response.done;
        this.isExpired = response.isExpired;
        if (!this.done) {
          if (!response.startAt) {
            this.checkStart = true;
          } else {
            if (this.checkStart) {
              if (response.data.duration) {
                this.timeCount = true;
                let time = 0;
                time = (response.data.duration.hour * 60 * 60) + (response.data.duration.minute * 60);
                this.TotalTime = time;
                this.miN = Math.floor(time / 60);
                this.seC = Math.abs(time - (this.miN * 60))
                this.interVal = setInterval(() => {
                  if (this.seC === 0 && this.miN > 0) {
                    this.miN = this.miN - 1;
                    this.seC = this.seC + 60;
                  }
                  if (this.seC === 0 && this.miN === 0) {
                    clearInterval(this.interVal)
                    this.save();
                  } else {
                    setExamData(this.topicOption);
                    this.TotalTime--;
                    this.seC--;
                  }
                }, 1000)
              }
              this.checkStart = false;
            } else if (response.data.duration) {
              if (this.examData) {
                this.topicOption = this.examData;
              }
              this.timeCount = true;
              let diffMinute = (response.usedTime.hours * 60 * 60) + (response.usedTime.minutes * 60) + response.usedTime.seconds; //second;
              // let diffSec = 0;
              // const date1 = new Date(response.startAt);
              // const date2 = new Date();
              // const diffTime = date2.getTime() - date1.getTime();
              // diffMinute = Math.floor(diffTime / (1000 * 60));//minute
              // diffSec = Math.floor(Math.abs(diffTime / (1000 * 60)) - diffMinute);// เศษ วินาที
              // diffMinute = Math.abs(diffMinute) - 420; //real linut - 7 hours
              // diffMinute = Math.abs(diffMinute * 60) + diffSec; //sec
              let timeTotal = (response.data.duration.hour * 60 * 60) + (response.data.duration.minute * 60); //second
              this.TotalTime = timeTotal;
              if (timeTotal > diffMinute) {
                let timeRemain = timeTotal - diffMinute;
                this.miN = Math.floor(timeRemain / 60);
                this.seC = Math.abs(timeRemain - (this.miN * 60))
                this.interVal = setInterval(() => {
                  if (this.seC === 0 && this.miN > 0) {
                    this.miN = this.miN - 1;
                    this.seC = this.seC + 60;
                  }
                  if (this.seC === 0 && this.miN === 0) {
                    clearInterval(this.interVal)
                    this.save();
                  } else {
                    setExamData(this.topicOption);
                    this.TotalTime--;
                    this.seC--;
                  }
                }, 1000)
              } else {
                this.save();
              }
            }
          }
        }
      }
      this.loading = false;
    })
  }

  // handleEvent(e: CountdownEvent) {
  //   if (e.action === 'done') {
  //     this.save();
  //   }
  // }
  handleEvent() {
    this.save();
  }

  getDetailAnswer() {
    this.loading = true;
    this.service.answerExam(this._id, this.examId, this.flagExam).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.examName = response.data.refExam.name;
        this.topicOption = response.data.exams;
        this.done = response.done;
        if (this.actionView) {
          this.done = false;
        }
      }
      this.loading = false;
    })
  }

  save() {
    this.service.submit(this._id, this.topicOption, this.examId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
        this.getDetail();
      }
    })
  }

  fileChangeEvent(option, files: FileList): void {
    this.fileText = "";
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); // read file as data url
    reader.onload = (e) => {
      var img = new Image;
      const chImg = reader.result;
      img.src = chImg.toString();
      img.onload = (ee) => {
        this.imgHeight = img.height;
      };
      const FileSize = files.item(0).size / 1024 / 1024; // in MB
      if (FileSize > 10) {
        this.showToast('danger', 'Error Message', 'file size more than 10 mb');
      } else {
        option.src = img.src;
        this.fileText = "upload success!"
      }
    };
  }

  open(content, option) {
    this.getOptionImg = option;
    this.modalService.open(content, { size: 'xl', centered: true, scrollable: true });
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
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
