import { Component, OnInit } from '@angular/core';
import { JobBoardService } from '../job-board.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { MESSAGE } from '../../../../shared/constants/message';
import { Router, ActivatedRoute } from "@angular/router";
import { ResponseCode, Paging, State } from '../../../../shared/app.constants';
import * as _ from 'lodash';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'ngx-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class JobBoardDetailComponent implements OnInit {
  item: any;
  sErrorEmail: string;
  nameFlag: boolean = false;
  state: any;
  _id: any;
  preview: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(
    private service: JobBoardService,
    private utilitiesService: UtilitiesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,

  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
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
    this.item = {
      emailSender: [],
      name: '',
      id: undefined
    };
  }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.item = response.data;
      } else {
        this.showToast('danger', 'Error Message', response.message);
        this.back();
      }
    })
  }

  save() {
    if (this.validation()) {
      const request = this.setRequest();
      if (this.state === 'create' || this.state === 'preview') {
        this.service.create(this.item).subscribe(response => {
          this.responseShow(response);
        })
      } else {
        this.service.edit(this.item).subscribe(response => {
          this.responseShow(response);
        })
      }
    }
  }

  responseShow(response) {
    if (response.code === ResponseCode.Success) {
      this.showToast('success', 'Success Message', response.message);
      this.back();
    } else {
      this.showToast('danger', 'Error Message', response.message);
    }
  }

  validation(): boolean {
    let isValid = true;
    this.nameFlag = false;
    this.sErrorEmail = "";
    if (!this.item.name) {
      this.nameFlag = true;
    }
    if (this.item.emailSender.length > 0) {
      this.item.emailSender.forEach(element => {
        if (!this.utilitiesService.isValidEmail(element.value || element)) {
          this.sErrorEmail = MESSAGE[9];
          isValid = false;
        } 
      });
    } else {
      this.sErrorEmail = "Please enter email.";
      isValid = false;
    }
    return isValid
  }

  setRequest(): any {
    this.item.emailSender = this.item.emailSender.map(gobj => {  //array.object to array
      if (gobj.value) {
        gobj = gobj.value;
        return gobj;
      }
      return gobj;
    })
    if (this.state === State.Duplicate) {
      this.item._id = undefined;
    }
    const request = _.cloneDeep(this.item);
    return request;
  }

  onAdd() {
    this.sErrorEmail = "";
    this.item.emailSender.forEach(element => {
      if (!this.utilitiesService.isValidEmail(element)) {
        this.sErrorEmail = MESSAGE[9];
      }
    });
  }

  addKeyword(keywords, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    if (value) {
      if (keywords.indexOf(value) === -1) {
        keywords.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
    this.onAdd()
  }

  removeKeyword(keywords, index): void {
    keywords.splice(index, 1);
    this.onAdd();
  }


  back() {
    this.router.navigate(["/employer/setting/job-board"]);
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
