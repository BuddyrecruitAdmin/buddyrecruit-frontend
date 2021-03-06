import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { DepartmentService } from '../department.service';
import { ResponseCode, State } from '../../../../shared/app.constants';
import { MESSAGE } from '../../../../shared/constants/message';
import { Address } from '../../../../shared/interfaces/common.interface';
import { getRole } from '../../../../shared/services/auth.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

export interface Division {
  _id?: string;
  name: string;
  useDepartmentAddress: boolean;
  addresses: Address[];
  isUsed: false,
}
export interface Department {
  _id?: string;
  name: string;
  hasDivision: boolean;
  useCompanyAddress: boolean;
  addresses: Address[];
  divisions?: Division[];
  active: boolean;
  isUsed: boolean;
}
export interface ErrMsg {
  name: string;
  address: string;
  province: string;
  postalCode: string;
  divisionAddress: string;
  divisionProvince: string;
  divisionPostalCode: string;
  divisionName: string;
}

@Component({
  selector: 'ngx-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.scss']
})
export class DepartmentDetailComponent implements OnInit {
  role: any;
  state: string;
  departmentDetail: Department;
  departmentDetailTemp: Department;
  errMsg: ErrMsg;
  divisionLocked: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: DepartmentService,
    private toastrService: NbToastrService,
    private matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.departmentDetail = this.initialModel();
    this.errMsg = this.initialErrMsg();
    this.divisionLocked = false;
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.state = State.Edit;
        this.getDetail(params.id);
      } else {
        this.state = State.Create;
      }
    });
  }

  initialModel(): Department {
    return {
      _id: undefined,
      name: '',
      hasDivision: false,
      useCompanyAddress: true,
      addresses: [this.initialAddress()],
      divisions: [],
      active: true,
      isUsed: false,
    }
  }

  initialDivision(): Division {
    return {
      _id: undefined,
      name: '',
      useDepartmentAddress: true,
      addresses: [this.initialAddress()],
      isUsed: false,
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
      name: '',
      address: '',
      province: '',
      postalCode: '',
      divisionName: '',
      divisionAddress: '',
      divisionPostalCode: '',
      divisionProvince: ''
    }
  }

  addDivision() {
    const division = this.initialDivision();
    division.name = 'Division ' + (this.departmentDetail.divisions.length + 1);
    this.departmentDetail.divisions.push(division);
  }

  back() {
    let departmentDetail: Department;
    if (this.state === State.Create) {
      departmentDetail = this.initialModel();
    } else {
      departmentDetail = _.cloneDeep(this.departmentDetailTemp);
    }
    if (JSON.stringify(departmentDetail) === JSON.stringify(this.departmentDetail)) {
      this.router.navigate(['/employer/setting/department']);
    } else {
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'C', content: MESSAGE[31] }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/employer/setting/department']);
        }
      });
    }
  }

  save() {
    if (this.validation()) {
      const request = this.setRequest();
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'C' }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          if (this.state === State.Create) {
            this.service.create(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.router.navigate(['/employer/setting/department']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          } else {
            this.service.edit(request).subscribe(response => {
              if (response.code === ResponseCode.Success) {
                this.showToast('success', 'Success Message', response.message);
                this.getDetail(request._id);
                this.router.navigate(['/employer/setting/department']);
              } else {
                this.showToast('danger', 'Error Message', response.message);
              }
            });
          }
        }
      })
    }
  }

  validation(): boolean {
    let isValid = true;
    this.errMsg = this.initialErrMsg();

    if (!this.departmentDetail.name) {
      this.errMsg.name = 'Please Input Name';
      isValid = false;
    }
    if (!this.departmentDetail.useCompanyAddress) {
      if (!this.departmentDetail.addresses[0].address) {
        this.errMsg.address = 'Please Input Address';
        isValid = false;
      }
      if (!this.departmentDetail.addresses[0].province) {
        this.errMsg.province = 'Please Input Province';
        isValid = false;
      }
      if (!this.departmentDetail.addresses[0].postalCode) {
        this.errMsg.postalCode = 'Please Input Postal Code';
        isValid = false;
      }
    }
    if (this.departmentDetail.divisions.length) {
      this.departmentDetail.divisions.forEach(element => {
        if (!element.name) {
          isValid = false;
          this.errMsg.divisionName = 'Please Input Division Name';
        }
        if (!element.useDepartmentAddress) {
          element.addresses.forEach(ele => {
            if (!ele.address) {
              isValid = false;
              this.errMsg.divisionAddress = 'Please Input Addrees';
            }
            if (!ele.province) {
              isValid = false;
              this.errMsg.divisionProvince = 'Please Input Province';
            }
            if (!ele.postalCode) {
              isValid = false;
              this.errMsg.divisionPostalCode = 'Please Input Postcode';
            }
          })
        }
      });
    }
    return isValid
  }

  setRequest(): Department {
    const request = _.cloneDeep(this.departmentDetail);
    if (request.useCompanyAddress) {
      request.addresses = [];
    }
    if (request.hasDivision) {
      if (request.divisions.length) {
        request.divisions.forEach(element => {
          if (element.useDepartmentAddress) {
            element.addresses = [];
          }
        });
      } else {
        request.hasDivision = false;
      }
    } else {
      request.divisions = [];

    }
    return request;
  }

  getDetail(_id: any) {
    this.service.getDetail(_id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.departmentDetail = _.cloneDeep(response.data);
        if (this.departmentDetail.addresses.length === 0) {
          this.departmentDetail.addresses.push({
            address: '',
            province: '',
            postalCode: null,
            location: '',
          });
        }
        if (this.departmentDetail.divisions) {
          const addresses = this.initialAddress();
          this.departmentDetail.divisions.map(item => {
            item.addresses = item.addresses || [addresses];
          });
          const found = this.departmentDetail.divisions.find(element => {
            return element.isUsed;
          });
          if (found) {
            this.divisionLocked = true;
          }
        }
        this.departmentDetailTemp = _.cloneDeep(this.departmentDetail);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    });
  }

  removeDivision(index: number) {
    this.departmentDetail.divisions.splice(index, 1);
  }

  checkDivisionAddress(index: number) {
    if (!this.departmentDetail.divisions[index].addresses.length) {
      this.departmentDetail.divisions[index].addresses.push(this.initialAddress());
    }
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
