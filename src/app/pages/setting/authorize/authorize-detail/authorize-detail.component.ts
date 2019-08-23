import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorizeService } from '../authorize.service';
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

export interface Auth {
  _id?: any;
  name: string;
  refHero: any;
  active: boolean;
  showDashboard: boolean;
  jd: {
    visible: boolean;
    editable: boolean;
  },
  jr: {
    visible: boolean;
    editable: boolean;
  }
}
export interface ErrMsg {
  name: string;
  refHero: string;
}

@Component({
  selector: 'ngx-authorize-detail',
  templateUrl: './authorize-detail.component.html',
  styleUrls: ['./authorize-detail.component.scss']
})
export class AuthorizeDetailComponent implements OnInit {
  role: any;
  state: string;
  authDetail: Auth;
  authDetailTemp: Auth;
  errMsg: ErrMsg;
  loading = true;
  roleOptions: DropDownValue[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: AuthorizeService,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private toastrService: NbToastrService,
    public matDialog: MatDialog,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.authDetail = this.initialModel();
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

  initialModel(): Auth {
    return {
      _id: undefined,
      name: '',
      refHero: '',
      active: true,
      showDashboard: false,
      jd: {
        visible: true,
        editable: true,
      },
      jr: {
        visible: true,
        editable: true,
      }
    }
  }

  initialErrMsg(): ErrMsg {
    return {
      name: '',
      refHero: '',
    }
  }

  async initialDropdown() {
    await this.getHeros();
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
                const admin = hero.data.find(admin => {
                  return admin.isAdmin === true;
                });
                this.roleOptions.push({
                  label: admin.name,
                  value: admin._id
                });
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

  back() {
    let authDetail: Auth;
    if (this.state === State.Create) {
      authDetail = this.initialModel();
    } else {
      authDetail = _.cloneDeep(this.authDetailTemp);
    }
    if (JSON.stringify(authDetail) === JSON.stringify(this.authDetail)) {
      this.router.navigate(['/setting/auth']);
    } else {
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: '40%',
        data: { type: 'C', content: MESSAGE[31] }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/setting/auth']);
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
    const isValid = true;
    this.errMsg = this.initialErrMsg();

    return isValid
  }

  setRequest(): Auth {
    const request = _.cloneDeep(this.authDetail);

    return request;
  }

  getDeatail(_id: any) {
    this.service.getDetail(_id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.authDetail = _.cloneDeep(response.data);
        this.authDetailTemp = _.cloneDeep(this.authDetail);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    });
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
