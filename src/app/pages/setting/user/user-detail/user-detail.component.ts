import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { DepartmentService } from '../../department/department.service';
import { CompanyService } from '../../company/company.service';
import { ResponseCode, State, Prefix } from '../../../../shared/app.constants';
import { DropDownValue, DropDownGroup } from '../../../../shared/interfaces/common.interface';
import { MESSAGE } from '../../../../shared/constants/message';
import { getRole, setUrl } from '../../../../shared/services/auth.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../../../component/popup-message/popup-message.component';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

export interface User {
  _id?: any;
  refCompany?: any;
  refDepartment?: any;
  refDivision?: any;
  refHero?: any;
  refAuthorize?: any;
  title: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  notifyEmail: string;
  active?: boolean;
}
export interface ErrMsg {
  refCompany: string;
  refDepartment: string;
  refDivision: string;
  refHero: string;
  refAuthorize: string;
  title: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  notifyEmail: string;
}

@Component({
  selector: 'ngx-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  role: any;
  state: string;
  userDetail: User;
  userDetailTemp: User;
  errMsg: ErrMsg;
  prefixOptions: DropDownValue[];
  departmentOptions: DropDownValue[];
  divisionOptions: DropDownGroup[];
  divisionAll: DropDownGroup[];
  roleOptions: DropDownValue[];
  authOptions: DropDownValue[];
  useSameUsername: boolean = true;
  loading = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: UserService,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private toastrService: NbToastrService,
    public matDialog: MatDialog,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.userDetail = this.initialModel();
    this.errMsg = this.initialErrMsg();
    this.initialDropdown().then((response) => {
      this.activatedRoute.params.subscribe(params => {
        if (params.id) {
          this.state = State.Edit;
          this.getDeatail(params.id);
        } else {
          this.state = State.Create;
        }
      });
      this.loading = false;
    });
  }

  initialModel(): User {
    return {
      _id: undefined,
      refCompany: undefined,
      refDepartment: undefined,
      refDivision: undefined,
      refHero: undefined,
      refAuthorize: undefined,
      title: undefined,
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      notifyEmail: '',
      active: true
    }
  }

  initialErrMsg(): ErrMsg {
    return {
      refCompany: '',
      refDepartment: '',
      refDivision: '',
      refHero: '',
      refAuthorize: '',
      title: '',
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      notifyEmail: '',
    }
  }

  async initialDropdown() {
    this.getPrefixs();
    this.getDepartments();
    this.getAuths();
    await this.getHeros();
  }

  getPrefixs() {
    return new Promise((resolve) => {
      this.prefixOptions = [];
      this.prefixOptions.push({
        label: 'Select Title',
        value: undefined
      });
      for (const item in Prefix) {
        if (isNaN(Number(item))) {
          this.prefixOptions.push({ label: Prefix[item], value: item });
        }
      }
      resolve();
    });
  }

  getDepartments() {
    return new Promise((resolve) => {
      this.departmentOptions = [];
      this.departmentOptions.push({
        label: '- Select Department -',
        value: undefined
      });
      this.divisionAll = [];
      this.divisionOptions = [];
      this.divisionOptions.push({
        label: '- Select Division -',
        value: undefined,
        group: undefined
      });
      this.departmentService.getList(undefined, this.role.refCompany).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data.length) {
            response.data = response.data.filter(element => {
              return element.active === true && element.isDeleted !== true;
            });
            if (response.data) {
              response.data.forEach(department => {
                this.departmentOptions.push({
                  label: department.name,
                  value: department._id
                });
                if (department.hasDivision && department.divisions.length) {
                  department.divisions.forEach(division => {
                    this.divisionAll.push({
                      group: department._id,
                      label: division.name,
                      value: division._id
                    });
                  });
                }
              });
            }
          }
        }
        resolve();
      });
    });
  }

  getHeros() {
    return new Promise((resolve) => {
      this.roleOptions = [];
      this.roleOptions.push({
        label: '- Select User Role -',
        value: undefined
      });
      this.companyService.getDetail(this.role.refCompany._id).subscribe(company => {
        if (company.code === ResponseCode.Success) {
          this.service.getHeroList(undefined, this.role.refCompany._id).subscribe(hero => {
            if (hero.code === ResponseCode.Success) {
              if (company.data && company.data.hero) {
                if (company.data.hero.hr) {
                  const hr = hero.data.find(hr => {
                    return hr.isHR === true;
                  });
                  this.roleOptions.push({
                    label: hr.name,
                    value: hr._id
                  });
                }
                if (company.data.hero.manager) {
                  const manager = hero.data.find(manager => {
                    return manager.isManager === true;
                  });
                  this.roleOptions.push({
                    label: manager.name,
                    value: manager._id
                  });
                }
                if (company.data.hero.payroll) {
                  const payroll = hero.data.find(payroll => {
                    return payroll.isPayroll === true;
                  });
                  this.roleOptions.push({
                    label: payroll.name,
                    value: payroll._id
                  });
                }
              }
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  getAuths() {
    return new Promise((resolve) => {
      this.authOptions = [];
      this.authOptions.push({
        label: '- Select Authorize Role -',
        value: undefined
      });
      this.service.getAuthRoleList(undefined, this.role.refCompany._id).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          response.data.forEach(element => {
            this.authOptions.push({
              label: element.name || element._id,
              value: element._id
            });
          });
        }
        resolve();
      });
    });
  }

  back() {
    let userDetail: User;
    if (this.state === State.Create) {
      userDetail = this.initialModel();
    } else {
      userDetail = _.cloneDeep(this.userDetailTemp);
    }
    if (JSON.stringify(userDetail) === JSON.stringify(this.userDetail)) {
      this.router.navigate(['/setting/user']);
    } else {
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: '40%',
        data: { type: 'C', content: MESSAGE[31] }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/setting/user']);
        }
      });
    }
  }

  save() {
    if (this.validation()) {
      const request = this.setRequest();
      if (this.state === State.Create) {
        this.service.create(request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.getDeatail(request._id);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      } else {
        this.service.edit(request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.getDeatail(request._id);
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

    // if (!this.userDetail.title) {
    //   this.errMsg.title = 'Please Input Title';
    //   isValid = false;
    // }
    if (!this.userDetail.firstname) {
      this.errMsg.firstname = 'Please Input Firstname';
      isValid = false;
    }
    if (!this.userDetail.lastname) {
      this.errMsg.lastname = 'Please Input Lastname';
      isValid = false;
    }
    if (!this.userDetail.username) {
      this.errMsg.username = 'Please Input Username';
      isValid = false;
    }
    if (!this.userDetail.password) {
      this.errMsg.password = 'Please Input Password';
      isValid = false;
    }
    if (!this.useSameUsername && !this.userDetail.notifyEmail) {
      this.errMsg.notifyEmail = 'Please Input Notify Email';
      isValid = false;
    }
    if (!this.userDetail.refDepartment) {
      this.errMsg.refDepartment = 'Please Select Department';
      isValid = false;
    }
    if (this.divisionOptions.length > 1 && !this.userDetail.refDivision) {
      this.errMsg.refDivision = 'Please Select Division';
      isValid = false;
    }
    if (!this.userDetail.refHero) {
      this.errMsg.refHero = 'Please Select User Role';
      isValid = false;
    }
    if (!this.userDetail.refAuthorize) {
      this.errMsg.refAuthorize = 'Please Select Authorize Role';
      isValid = false;
    }

    return isValid
  }

  setRequest(): User {
    const request = _.cloneDeep(this.userDetail);
    request.refCompany = this.role.refCompany._id;
    if (this.useSameUsername) {
      request.notifyEmail = this.userDetail.username;
    }
    return request;
  }

  getDeatail(_id: any) {
    this.service.getDetail(_id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.userDetail = _.cloneDeep(response.data);
        this.userDetailTemp = _.cloneDeep(this.userDetail);
        this.onChangeDepartment(this.userDetail.refDepartment);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    });
  }

  onChangeDepartment(value) {
    this.divisionOptions = [];
    this.divisionOptions.push({
      label: '- Select Division -',
      value: undefined,
      group: undefined
    });
    const division = this.divisionAll.filter(element => {
      return element.group === value;
    });
    if (division.length) {
      division.forEach(element => {
        this.divisionOptions.push(element);
      });
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
