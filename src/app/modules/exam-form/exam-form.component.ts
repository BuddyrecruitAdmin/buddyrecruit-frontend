import { Component, OnInit, TemplateRef } from '@angular/core';
import { ExamFormService, } from './exam-form.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { getRole, setLanguage, getLanguage, setLangPath } from '../../shared/services/auth.service';
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
    config.backdrop = 'static';
    config.keyboard = false;
    this.innerHeight = window.innerHeight * 0.9;
  }

  ngOnInit() {
    this.topicOption = [];
    this.actionView = false;
    this.loading = true;
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

  getDetail() {
    this.loading = true;
    this.service.getDetail(this._id, this.examId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.examName = response.data.name;
        this.topicOption = response.data.exams;
        this.done = response.done;
        if (this.actionView) {
          this.done = false;
        }
      }
      this.loading = false;
    })
  }

  getDetailAnswer() {
    this.loading = true;
    this.service.answerExam(this._id, this.examId).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.examName = response.data.name;
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
    console.log(this.topicOption);
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
