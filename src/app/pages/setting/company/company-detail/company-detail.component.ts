import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CompanyService } from '../company.service';
import { CompanyTypeService } from '../../company-type/company-type.service';
import { ResponseCode, Paging, State } from '../../../../shared/app.constants';
import { DropDownValue } from '../../../../shared/interfaces/common.interface';
import { getRole } from '../../../../shared/services/auth.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

export interface CompanyDetail {
  refCompanyType: any;
  name: string;
  startDate: Date;
  expiryDate: Date;
  companySize: number;
  adminEmail: string;
  activeJobsDB: boolean;
  activeExam: boolean;
  transferable: boolean;
  isSubCompany: boolean;
  refParent: any;
  hero: {
    hr: boolean;
    payroll: boolean;
    manager: boolean;
  }
}

export interface ErrMsg {
  refCompanyType: string;
  name: string;
  startDate: string;
  expiryDate: string;
  companySize: string;
  adminEmail: string;
  refParent: string;
}

@Component({
  selector: 'ngx-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  refHero: any;
  state: string;
  companyDetail: CompanyDetail;
  typeOptions: DropDownValue[];
  companyOptions: DropDownValue[];
  roleSelected: string;
  errMsg: ErrMsg;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: CompanyService,
    private companyTypeService: CompanyTypeService,
    private toastrService: NbToastrService
  ) {
  }

  ngOnInit() {
    this.roleSelected = '4';
    this.initialDropdown();
    this.companyDetail = this.initialModel();
    this.errMsg = this.initialErrMsg();

    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.state = State.Edit;
      } else {
        this.state = State.Create;
      }
    });
  }

  initialModel(): CompanyDetail {
    return {
      refCompanyType: undefined,
      name: '',
      startDate: null,
      expiryDate: null,
      companySize: null,
      adminEmail: '',
      activeJobsDB: false,
      activeExam: true,
      transferable: false,
      isSubCompany: false,
      refParent: undefined,
      hero: {
        hr: false,
        payroll: false,
        manager: false,
      }
    }
  }

  initialErrMsg(): ErrMsg {
    return {
      refCompanyType: '',
      name: '',
      startDate: '',
      expiryDate: '',
      companySize: '',
      adminEmail: '',
      refParent: ''
    }
  }

  initialDropdown() {
    this.typeOptions = [];
    this.typeOptions.push({
      label: "- Select Company Type -",
      value: undefined
    });
    this.companyTypeService.getList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          response.data.forEach(element => {
            this.typeOptions.push({
              label: element.name,
              value: element._id
            });
          });
        }
      }
    });

    this.companyOptions = [];
    this.companyOptions.push({
      label: "- Select Parent Company -",
      value: undefined
    });
    this.service.getList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          response.data.forEach(element => {
            this.companyOptions.push({
              label: element.name,
              value: element._id
            });
          });
        }
      }
    });
  }

  save() {
    if (this.validation()) {
      const request = this.setRequest();
      this.service.create(request).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.showToast('success', 'Success Message', response.message);
        } else {
          this.showToast('danger', 'Error Message', response.message);
        }
      });
    }
  }

  validation(): boolean {
    let isValid = true;
    this.errMsg = this.initialErrMsg();

    if (!this.companyDetail.refCompanyType) {
      this.errMsg.refCompanyType = 'Please Input Company Type';
      isValid = false;
    }
    if (!this.companyDetail.name) {
      this.errMsg.name = 'Please Input Name';
      isValid = false;
    }
    if (!this.companyDetail.startDate) {
      this.errMsg.startDate = 'Please Input Start Date';
      isValid = false;
    }
    if (!this.companyDetail.expiryDate) {
      this.errMsg.expiryDate = 'Please Input Expiry Date';
      isValid = false;
    }
    if (!this.companyDetail.companySize) {
      this.errMsg.companySize = 'Please Input Company Size';
      isValid = false;
    }
    if (!this.companyDetail.adminEmail) {
      this.errMsg.adminEmail = 'Please Input Admin Email';
      isValid = false;
    }
    if (this.companyDetail.isSubCompany && !this.companyDetail.refParent) {
      this.errMsg.refParent = 'Please Input Parent Company';
      isValid = false;
    }
    return isValid;
  }

  setRequest(): CompanyDetail {
    const request = _.cloneDeep(this.companyDetail);
    switch (this.roleSelected) {
      case '1':
        request.hero.hr = true;
        request.hero.payroll = false;
        request.hero.manager = false;
        break;
      case '2':
        request.hero.hr = true;
        request.hero.payroll = false;
        request.hero.manager = true;
        break;
      case '3':
        request.hero.hr = true;
        request.hero.payroll = true;
        request.hero.manager = false;
        break;
      case '4':
        request.hero.hr = true;
        request.hero.payroll = true;
        request.hero.manager = true;
        break;
      default:
        break;
    }
    request.startDate.setTime( request.startDate.getTime() + Math.abs(request.startDate.getTimezoneOffset()*60*1000 ));
    request.expiryDate.setTime( request.expiryDate.getTime() + Math.abs(request.expiryDate.getTimezoneOffset()*60*1000 ));

    return request;
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
