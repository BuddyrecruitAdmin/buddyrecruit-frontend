import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CompanyService } from '../company.service';
import { CompanyTypeService } from '../../company-type/company-type.service';
import { ResponseCode, Paging, State } from '../../../../shared/app.constants';
import { MESSAGE } from '../../../../shared/constants/message';
import { DropDownValue, Address } from '../../../../shared/interfaces/common.interface';
import { getRole, getContactId, setContactId } from '../../../../shared/services/auth.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ContactUsService } from '../../contact-us/contact-us.service';

export interface CompanyDetail {
  refCompanyType: any;
  name: string;
  startDate: Date;
  expiryDate: Date;
  companySize: number;
  adminEmail: string;
  adminPassword: string;
  activeJobsDB: boolean;
  activeExam: boolean;
  transferable: boolean;
  isSubCompany: boolean;
  refParent: any;
  hero: {
    hr: boolean;
    payroll: boolean;
    manager: boolean;
  },
  isTrial: boolean;
  maxJR: number;
  maxUser: number;
  smtpHost: string;
  smtpPort: string;
  imapHost: string;
  imapPort: string;
  intEmailUser: string;
  intEmailPass: string;
  extEmailUser: string;
  extEmailPass: string;
  incomingEmailUser: string;
  incomingEmailPass: string;
  addresses: Address[];
  startByHR: boolean;
  lineInfo: {
    active: boolean;
    lineId: string;
    imageUrl: string;
  },
}

export interface ErrMsg {
  refCompanyType: string;
  name: string;
  startDate: string;
  expiryDate: string;
  companySize: string;
  adminEmail: string;
  refParent: string;
  maxJR: string;
  maxUser: string;
  smtpHost: string;
  smtpPort: string;
  imapHost: string;
  imapPort: string;
  intEmailUser: string;
  intEmailPass: string;
  extEmailUser: string;
  extEmailPass: string;
  address: string;
  province: string;
  postalCode: string;
  incomingEmailUser: string;
  incomingEmailPass: string;
  lineInfo: string;
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
  companyDetailTemp: CompanyDetail;
  typeOptions: DropDownValue[];
  companyOptions: DropDownValue[];
  roleSelected: string;
  errMsg: ErrMsg;
  _id: string;
  role: any;
  contactId: any;
  loading: boolean;
  buttonLoading: boolean;
  editabled: boolean;
  bigAdmin: DropDownValue[];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: CompanyService,
    private companyTypeService: CompanyTypeService,
    private toastrService: NbToastrService,
    public matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private contactUsService: ContactUsService,
  ) {
    this.role = getRole();
    this.contactId = getContactId();
    setContactId();
  }

  ngOnInit() {
    this.roleSelected = '';
    this.loading = true;
    this.buttonLoading = false;
    this.editabled = true;
    this.companyDetail = this.initialModel();
    this.errMsg = this.initialErrMsg();
    this.initialDropdown().then((response) => {
      this.activatedRoute.params.subscribe(params => {
        if (params.id) {
          this.editabled = false;
          this.state = State.Edit;
          this._id = params.id;
          this.getDetail();
        } else {
          this.state = State.Create;
          this._id = undefined;
          if (this.contactId) {
            this.contactUsService.getDetail(this.contactId).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                if (response.data) {
                  this.companyDetail.name = response.data.companyName;
                  this.companyDetail.companySize = response.data.numberEmployees;
                  // this.companyDetail.adminEmail = response.data.email;
                  this.companyDetail.hero = response.data.hero;
                  this.roleSelected = response.data.userRole.toString();
                }
              }
            });
          } else {
            this.roleSelected = '4';
          }
          this.loading = false;
        }
      });
    });
  }

  initialModel(): CompanyDetail {
    return {
      refCompanyType: undefined,
      name: '',
      startDate: new Date(),
      expiryDate: null,
      companySize: null,
      adminEmail: '',
      adminPassword: 'Reset@123',
      activeJobsDB: false,
      activeExam: true,
      transferable: false,
      isSubCompany: false,
      refParent: undefined,
      hero: {
        hr: false,
        payroll: false,
        manager: false,
      },
      isTrial: false,
      maxJR: 0,
      maxUser: 0,
      smtpHost: '',
      smtpPort: '',
      imapHost: '',
      imapPort: '',
      intEmailUser: '',
      intEmailPass: '',
      extEmailUser: '',
      extEmailPass: '',
      incomingEmailUser: '',
      incomingEmailPass: '',
      addresses: [this.initialAddress()],
      startByHR: false,
      lineInfo: {
        active: false,
        lineId: '',
        imageUrl: '',
      },
    }
  }

  initialAddress(): Address {
    return {
      address: '',
      province: '',
      postalCode: null,
      location: '',
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
      refParent: '',
      maxJR: '',
      maxUser: '',
      smtpHost: '',
      smtpPort: '',
      imapHost: '',
      imapPort: '',
      intEmailUser: '',
      intEmailPass: '',
      extEmailUser: '',
      extEmailPass: '',
      incomingEmailUser: '',
      incomingEmailPass: '',
      address: '',
      province: '',
      postalCode: '',
      lineInfo: '',
    }
  }

  async initialDropdown() {
    await this.getCompanyType();
    await this.getParentCompany();
  }

  getCompanyType() {
    return new Promise((resolve) => {
      this.typeOptions = [];
      this.typeOptions.push({
        label: "- Select Company Type -",
        value: undefined
      });
      this.companyTypeService.getList().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            const companyType = response.data.filter(element => {
              return element.active;
            });
            if (companyType) {
              companyType.forEach(element => {
                this.typeOptions.push({
                  label: element.name,
                  value: element._id
                });
              });
            }
          }
        }
        resolve();
      });
    });
  }

  getParentCompany() {
    return new Promise((resolve) => {
      this.companyOptions = [];
      this.companyOptions.push({
        label: "- Select Parent Company -",
        value: undefined
      });
      this.service.getList().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data) {
            const company = response.data.filter(element => {
              return element.active;
            });
            if (company) {
              company.forEach(element => {
                this.companyOptions.push({
                  label: element.name,
                  value: element._id
                });
              });
            }
          }
        }
        resolve();
      });
    });
  }

  getDetail() {
    this.bigAdmin = [];
    this.bigAdmin.push({
      label: "- Select Admin -",
      value: undefined
    });
    this.loading = true;
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.companyDetail = response.data;
          if (this.companyDetail.hero.payroll && this.companyDetail.hero.manager) {
            this.roleSelected = '4';
          } else if (this.companyDetail.hero.payroll) {
            this.roleSelected = '3';
          } else if (this.companyDetail.hero.manager) {
            this.roleSelected = '2';
          } else {
            this.roleSelected = '1';
          }
          if (!this.companyDetail.addresses.length) {
            this.companyDetail.addresses = [this.initialAddress()]
          }
          if (this.utilitiesService.dateIsValid(response.data.startDate)) {
            this.companyDetail.startDate = new Date(response.data.startDate);
          }
          if (this.utilitiesService.dateIsValid(response.data.expiryDate)) {
            this.companyDetail.expiryDate = new Date(response.data.expiryDate);
          }
          this.companyDetailTemp = _.cloneDeep(this.companyDetail);
        }
      }
      this.loading = false;
    });
    this.service.getListAdmin(this._id).subscribe(res => {
      if (res.code === ResponseCode.Success) {
        res.data.forEach(element => {
          if (this.role.refHero.isSuperAdmin) {
            this.bigAdmin.push({
              label: element.username,
              value: element._id
            })
          } else {
            this.bigAdmin.push({
              label: this.utilitiesService.setFullname(element),
              value: element._id
            })
          }
          if (element.refAuthorize.isDefault) {
            this.companyDetail.adminEmail = element._id;
          }
        });
      }
    })
  }

  back() {
    let companyDetail: CompanyDetail;
    if (this.state === State.Create) {
      companyDetail = this.initialModel();
    } else {
      companyDetail = _.cloneDeep(this.companyDetailTemp);
    }
    if (JSON.stringify(companyDetail) === JSON.stringify(this.companyDetail)) {
      this.router.navigate(['/employer/setting/company']);
    } else {
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'C', content: MESSAGE[31] }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/employer/setting/company']);
        }
      });
    }
  }

  save() {
    if (this.validation()) {
      this.buttonLoading = true;
      const request = this.setRequest();
      if (this.state === State.Create) {
        this.service.create(request).subscribe(response => {
          this.buttonLoading = false;
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            if (this.contactId) {
              this.contactUsService.isCreated(this.contactId).subscribe(response => {
              });
            }
            this.router.navigate(['/employer/setting/company']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      } else if (this.state === State.Edit) {
        this.service.update(request).subscribe(response => {
          this.buttonLoading = false;
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/employer/setting/company']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    }
  }

  validation(): boolean {
    let isValid = true;
    this.errMsg = this.initialErrMsg();

    if (this.role.refHero.isSuperAdmin) {
      if (!this.companyDetail.refCompanyType) {
        this.errMsg.refCompanyType = 'Please select company type';
        isValid = false;
      }
      if (!this.companyDetail.name) {
        this.errMsg.name = 'Please enter name';
        isValid = false;
      }
      if (!this.companyDetail.startDate) {
        this.errMsg.startDate = 'Please select start date';
        isValid = false;
      }
      if (!this.companyDetail.expiryDate) {
        this.errMsg.expiryDate = 'Please select expiry date';
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
      if (!this.companyDetail.maxJR) {
        this.errMsg.maxJR = 'Please Input Number of JR';
        isValid = false;
      }
      if (!this.companyDetail.maxUser) {
        this.errMsg.maxUser = 'Please Input Number of User';
        isValid = false;
      }
      if (this.companyDetail.lineInfo.active) {
        if (!this.companyDetail.lineInfo.lineId && !this.companyDetail.lineInfo.imageUrl) {
          this.errMsg.lineInfo = 'Please Input Line ID. or Line QR Code url';
          isValid = false;
        }
      }
    } else {
      if (!this.companyDetail.name) {
        this.errMsg.name = 'Please Input Name';
        isValid = false;
      }
      if (!this.companyDetail.smtpHost) {
        this.errMsg.smtpHost = 'Please Input SMTP Server';
        isValid = false;
      }
      if (!this.companyDetail.smtpPort) {
        this.errMsg.smtpPort = 'Please Input SMTP Port';
        isValid = false;
      }
      if (!this.companyDetail.imapHost) {
        this.errMsg.imapHost = 'Please Input IMAP Host';
        isValid = false;
      }
      if (!this.companyDetail.imapPort) {
        this.errMsg.imapPort = 'Please Input IMAP Port';
        isValid = false;
      }
      if (!this.companyDetail.intEmailUser) {
        this.errMsg.intEmailUser = 'Please Input Internal Email';
        isValid = false;
      }
      if (!this.companyDetail.intEmailPass) {
        this.errMsg.intEmailPass = 'Please Input Internal Password';
        isValid = false;
      }
      if (!this.companyDetail.extEmailUser) {
        this.errMsg.extEmailUser = 'Please Input External Email';
        isValid = false;
      }
      if (!this.companyDetail.extEmailPass) {
        this.errMsg.extEmailPass = 'Please Input External Password';
        isValid = false;
      }
      if (!this.companyDetail.incomingEmailUser) {
        this.errMsg.incomingEmailUser = 'Please Input Incoming Email User';
        isValid = false;
      }
      if (!this.companyDetail.incomingEmailPass) {
        this.errMsg.incomingEmailPass = 'Please Input Incoming Email Password';
        isValid = false;
      }
      if (!this.companyDetail.addresses[0].address) {
        this.errMsg.address = 'Please Input Address';
        isValid = false;
      }
      if (!this.companyDetail.addresses[0].province) {
        this.errMsg.province = 'Please Input Province';
        isValid = false;
      }
      if (!this.companyDetail.addresses[0].postalCode) {
        this.errMsg.postalCode = 'Please Input Postal Code';
        isValid = false;
      }
      if (!this.companyDetail.adminEmail) {
        this.errMsg.adminEmail = 'Please Input Admin Email';
        isValid = false;
      }
    }
    return isValid;
  }

  setRequest(): CompanyDetail {
    const request = _.cloneDeep(this.companyDetail);
    request.startDate = new Date(request.startDate);
    request.expiryDate = new Date(request.expiryDate);
    switch (this.roleSelected) {
      case '1':
        request.hero.hr = true;
        request.hero.payroll = false;
        request.hero.manager = false;
        request.startByHR = false;
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
        request.startByHR = false;
        break;
      case '4':
        request.hero.hr = true;
        request.hero.payroll = true;
        request.hero.manager = true;
        request.startByHR = false;
        break;
      default:
        break;
    }
    if (!request.isSubCompany) {
      request.refParent = undefined;
    }
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
