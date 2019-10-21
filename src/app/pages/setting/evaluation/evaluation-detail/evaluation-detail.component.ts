import { Component, OnInit, TemplateRef } from '@angular/core';
import { EvaluationService } from '../evaluation.service';
import { ResponseCode, Paging } from '../../../../shared/app.constants';
import { Criteria, Paging as IPaging } from '../../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId } from '../../../../shared/services/auth.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { MESSAGE } from '../../../../shared/constants/message';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'ngx-evaluation-detail',
  templateUrl: './evaluation-detail.component.html',
  styleUrls: ['./evaluation-detail.component.scss']
})
export class EvaluationDetailComponent implements OnInit {
  role: any;
  evaluation: any;
  dialogRef: NbDialogRef<any>;
  fieldName: any;
  createTopic: string;
  sErrorCheck: string;
  _id: any;
  state: any;
  preview: boolean;
  beforeName: string;
  constructor(
    private service: EvaluationService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.initialModel();
    this.preview = false;
    this.sErrorCheck = "";
    this.activatedRoute.params.subscribe(params => {
      console.log(params.id)
      if (params.action === "create") {
        this.state = "create";
      }
      if (params.action === "edit") {
        this._id = params.id;
        this.state = "edit";
        this.getDetail();
      }
      if (params.action === "duplicate") {
        this._id = params.id;
        this.state = "duplicate";
        this.getDetail();
      }
      if (params.action === "preview") {
        this._id = params.id;
        this.preview = true;
        this.getDetail();
      }
    });
  }

  initialModel(): any {
    this.evaluation = {
      refCompany: undefined,
      name: undefined,
      checked: true,
      basicApplications: [
        {
          subject: 'การศึกษา',
          options: [
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
          subject: 'ประสบการณ์',
          options: [
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
          subject: 'ประวัติการเปลี่ยนงาน',
          options: [
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
          subject: 'ที่พัก',
          options: [
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
          subject: 'ประสบการณ์ด้าน ISO',
          options: [
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

      evaCategories: [
        {
          subject: 'ท่าทาง บุคลิกภาพ',
          selected: null
        },
        {
          subject: 'การตรงต่อเวลา',
          selected: null
        },
        {
          subject: 'ความละเอียดรอบคอบ',
          selected: null
        },
        {
          subject: 'ทัศนคติต่อ ตนเอง ผู้อื่น และต่องาน',
          selected: null
        },
        {
          subject: 'การตอบคำถามอย่างมีเหตุผล',
          selected: null
        },
      ],
      rank: {
        options: [
          {
            subject: 'ผ่านการสัมภาษณ์',
            value: 1,
            min: 0,
            max: 25,
          },
          {
            subject: 'รอพิจารณา',
            value: 2,
            min: 0,
            max: 0,
          },
          {
            subject: 'ไม่ผ่านการสัมภาษณ์',
            value: 3,
            min: 0,
            max: 0,
          },
        ],
        selected: null
      }
    }
  }

  getDetail() {
    console.log(this._id)
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.evaluation = response.data;
        this.beforeName = response.data.name;
        console.log(response.data);
      }
    })
  }

  addOption(data: any) {
    data.options.push({
      label: '',
      value: data.options.length + 1,
    })
  }

  deleteOption(basic: any, index: any) {
    basic.options.splice(index, 1);
  }

  deleteTopic(index: any, option: any) {
    switch (option) {
      case 'category':
        this.evaluation.evaCategories.splice(index, 1);
        break;
      case 'basic':
        this.evaluation.basicApplications.splice(index, 1);
        break;
    }
  }

  save() {
    console.log(this.evaluation)
    if (this.validation()) {
      if (this.state === "create" || this.state === "duplicate") {
        this.service.create(this.evaluation).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/setting/evaluation']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        })
      } else {
        this.service.edit(this.evaluation).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/setting/evaluation']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        })
      }
    }
  }

  validation(): boolean {
    let isValid = true;
    if (this.evaluation.name === undefined || this.evaluation.name === "") {
      this.sErrorCheck = MESSAGE[157];
      isValid = false;
    }
    // check basic
    if (this.evaluation.checked) {
      this.evaluation.basicApplications.map((element) => {
        if (element.options.length > 0) {
          element.options.map((option, oindex) => {
            if (option.label === "") {
              this.sErrorCheck = MESSAGE[149];
              isValid = false;
            } else {
              option.value = oindex + 1;
            }
          })
        } else {
          this.sErrorCheck = MESSAGE[149];
          isValid = false;
        }
        if (element.subject === "") {
          this.sErrorCheck = MESSAGE[149];
          isValid = false;
        }
      });
    }
    // check category
    this.evaluation.evaCategories.map(element => {
      if (element.subject === "") {
        isValid = false;
        this.sErrorCheck = MESSAGE[150];
      }
    });
    // check rank
    if (
      this.evaluation.rank.options[0].min - this.evaluation.rank.options[1].max != 1 ||
      this.evaluation.rank.options[1].min - this.evaluation.rank.options[2].max != 1
    ) {
      this.sErrorCheck = MESSAGE[153];
      isValid = false;
    }
    if (this.evaluation.rank.options[0].max === this.evaluation.rank.options[0].min ||
      this.evaluation.rank.options[1].max === this.evaluation.rank.options[1].min ||
      this.evaluation.rank.options[2].max === this.evaluation.rank.options[2].min ||
      this.evaluation.rank.options[1].max === this.evaluation.rank.options[0].min ||
      this.evaluation.rank.options[2].max === this.evaluation.rank.options[1].min ||
      this.evaluation.rank.options[2].max === this.evaluation.rank.options[2].min ||
      this.evaluation.rank.options[1].max === this.evaluation.rank.options[1].min
    ) {
      this.sErrorCheck = MESSAGE[151];
      isValid = false;
    }
    if (this.evaluation.rank.options[0].max < this.evaluation.rank.options[0].min ||
      this.evaluation.rank.options[1].max < this.evaluation.rank.options[1].min ||
      this.evaluation.rank.options[2].max < this.evaluation.rank.options[2].min ||
      this.evaluation.rank.options[1].max > this.evaluation.rank.options[0].min ||
      this.evaluation.rank.options[2].max > this.evaluation.rank.options[1].min
    ) {
      this.sErrorCheck = MESSAGE[152];
      isValid = false;
    }
    if (this.state === "duplicate") {
      if (this.evaluation.name === this.beforeName) {
        this.sErrorCheck = MESSAGE[154];
        isValid = false;
      }
    }
    return isValid;
  }

  addTopic(dialog: TemplateRef<any>, option: any) {
    this.fieldName = "";
    switch (option) {
      case 'category':
        this.createTopic = "category";
        break;
      case 'basic':
        this.createTopic = "basic";
        break;
    }
    this.callDialog(dialog);
  }

  createField() {
    if (this.createTopic === "basic") {
      this.evaluation.basicApplications.push({
        subject: this.fieldName,
        options: [],
        selected: null,
        isDeleted: false
      })
      this.dialogRef.close();
    } else {
      this.evaluation.evaCategories.push({
        subject: this.fieldName,
        selected: null
      })
      this.dialogRef.close();
    }
  }

  sumScore(): number {
    let score = 0;
    score = this.evaluation.evaCategories.length * 5;
    this.evaluation.rank.options[0].max = score;
    return score;
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
