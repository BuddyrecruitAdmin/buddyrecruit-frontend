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

export interface Control {
  visible: boolean;
  editable: boolean;
  active: boolean;
}
export interface Department {
  departmentId: any;
  name: string;
  control: Control;
  divisions: Division[];
}
export interface Division {
  divisionId: any;
  name: string;
  control: Control;
}
export interface Auth {
  _id?: any;
  name: string;
  refHero: any;
  active: boolean;
  isDefault: boolean;
  departments: Department[],
  processFlow: {
    exam: {
      steps: any;
    }
    noExam: {
      steps: any;
    }
  }
  configuration: {
    companyType?: Control;
    company: Control;
    department: Control;
    division: Control;
    authorize: Control;
    user: Control;
    jobPosition: Control;
    evaluation: Control;
    location: Control;
    mailTemplate: Control;
    rejection: Control;
    dashboard: Control;
    report: Control;
    blacklist: Control;
  };
  showDashboard: boolean;
  dashboards: any;
  jd: Control;
  jr: Control;
  showReport: boolean;
  reports: any;
  showOriginalCV: boolean;
  editCandidateInfo: boolean;
  showApplicationForm: boolean;
  showSalary: boolean;
  closeJR: boolean;
  isUsed?: boolean;
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
  authDefault: any;
  authDetail: Auth;
  authDetailTemp: Auth;
  errMsg: ErrMsg;
  loading: boolean;
  roleOptions: DropDownValue[];
  departments: any;
  refHero: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: AuthorizeService,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private toastrService: NbToastrService,
    private matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.loading = true;
    this.authDetail = this.initialModel();
    this.errMsg = this.initialErrMsg();
    this.initialDropdown().then((response) => {
      this.activatedRoute.params.subscribe(params => {
        switch (params.action) {
          case State.Create:
            this.state = State.Create;
            break;
          case State.Edit:
            this.state = State.Edit;
            this.getDetail(params.id);
            break;
          case State.Duplicate:
            this.state = State.Duplicate;
            this.getDuplicate(params.id);
            break;
          default:
            this.router.navigate(['/setting/authorize']);
            break;
        }
        this.loading = false;
      });
    });
  }

  initialModel(): Auth {
    let auth: Auth;
    auth = {
      _id: undefined,
      name: '',
      refHero: '',
      active: true,
      isDefault: false,
      departments: [],
      processFlow: this.role.refAuthorize.processFlow,
      configuration: {
        company: {
          visible: false,
          editable: false,
          active: true
        },
        dashboard: {
          visible: false,
          editable: false,
          active: true
        },
        department: {
          visible: false,
          editable: false,
          active: true
        },
        division: {
          visible: false,
          editable: false,
          active: true
        },
        authorize: {
          visible: false,
          editable: false,
          active: true
        },
        user: {
          visible: false,
          editable: false,
          active: true
        },
        jobPosition: {
          visible: false,
          editable: false,
          active: true
        },
        evaluation: {
          visible: false,
          editable: false,
          active: true
        },
        location: {
          visible: false,
          editable: false,
          active: true
        },
        mailTemplate: {
          visible: false,
          editable: false,
          active: true
        },
        rejection: {
          visible: false,
          editable: false,
          active: true
        },
        report: {
          visible: false,
          editable: false,
          active: true
        },
        blacklist: {
          visible: false,
          editable: false,
          active: true
        },
      },
      showDashboard: false,
      dashboards: [],
      jd: {
        visible: true,
        editable: true,
        active: true
      },
      jr: {
        visible: true,
        editable: true,
        active: true
      },
      showReport: false,
      reports: [],
      showOriginalCV: false,
      editCandidateInfo: false,
      showApplicationForm: false,
      showSalary: false,
      closeJR: false,
    }
    auth.processFlow.exam.steps.forEach(element => {
      element.editable = false;
    });
    auth.processFlow.noExam.steps.forEach(element => {
      element.editable = false;
    });
    return auth;
  }

  initialControl(): Control {
    return {
      visible: false,
      editable: false,
      active: true,
    }
  }

  initialErrMsg(): ErrMsg {
    return {
      name: '',
      refHero: '',
    }
  }

  async initialDropdown() {
    this.getDepartment();
    this.getDefaultList();
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

  getDepartment() {
    return new Promise((resolve) => {
      this.departments = [];
      let divisions: Division[];
      this.departmentService.getList(undefined, this.role.refCompany).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (response.data.length) {
            response.data = response.data.filter(element => {
              return element.active === true && element.isDeleted !== true;
            });
            if (response.data) {
              response.data.forEach(department => {
                divisions = [];
                if (department.hasDivision && department.divisions.length) {
                  department.divisions.forEach(division => {
                    divisions.push({
                      divisionId: division._id,
                      name: division.name,
                      control: this.initialControl()
                    })
                  });
                }
                this.departments.push({
                  refDepartment: department._id,
                  name: department.name,
                  control: this.initialControl(),
                  divisions: divisions
                });

              });
            }
          }
        }
        resolve();
      });
    });
  }

  getDefaultList() {
    return new Promise((resolve) => {
      this.service.getDefaultList(this.role.refCompany).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.authDefault = response.data;
        }
        resolve();
      });
    });
  }

  changeUserRole(refHero: string) {
    if (this.refHero && this.refHero !== refHero) {
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: {
          type: 'C',
          content: 'If you change User role, settings will change.',
          content2: 'Do you want to continue?',
        }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          this.refHero = refHero;
          this.setAuthDefault();
        } else {
          this.authDetail.refHero = this.refHero;
        }
      });
    } else {
      this.refHero = refHero;
      this.setAuthDefault();
    }
  }

  setAuthDefault() {
    if (this.authDefault.length) {
      const name = this.authDetail.name;
      const auth = this.authDefault.find(element => {
        return element.refHero === this.refHero
          && element.isDefault
          && element.processFlow.exam.steps.length
          && element.processFlow.noExam.steps.length;
      });
      if (auth) {
        this.authDetail.name = name;
        this.authDetail.refHero = auth.refHero;
        this.authDetail.processFlow = auth.processFlow;
        this.authDetail.configuration = auth.configuration;
        this.authDetail.showDashboard = auth.showDashboard;
        this.authDetail.dashboards = auth.dashboards;
        this.authDetail.jd = auth.jd;
        this.authDetail.jr = auth.jr;
        this.authDetail.showReport = auth.showReport;
        this.authDetail.reports = auth.reports;
        this.authDetail.showOriginalCV = auth.showOriginalCV;
        this.authDetail.editCandidateInfo = auth.editCandidateInfo;
        this.authDetail.showApplicationForm = auth.showApplicationForm;
        this.authDetail.showSalary = auth.showSalary;
        this.authDetail.closeJR = auth.closeJR;

        this.authDetail.processFlow.exam.steps.map(element => {
          element.disabled = element.editable;
        });
        this.authDetail.processFlow.noExam.steps.map(element => {
          element.disabled = element.editable;
        });
      }
    }
  }

  back() {
    let authDetail: Auth;
    if (this.state === State.Create) {
      authDetail = this.initialModel();
    } else {
      authDetail = _.cloneDeep(this.authDetailTemp);
    }
    if (JSON.stringify(authDetail) === JSON.stringify(this.authDetail)) {
      this.router.navigate(['/setting/authorize']);
    } else {
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'C', content: MESSAGE[31] }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/setting/authorize']);
        }
      });
    }
  }

  save() {
    if (this.validation()) {
      const request = this.setRequest();
      if (this.state === State.Edit) {
        this.service.edit(request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/setting/authorize']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      } else {
        this.service.create(request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/setting/authorize']);
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
    if (!this.authDetail.name) {
      this.errMsg.name = 'Please Input Authorize Name';
      isValid = false;
    }
    if (!this.authDetail.refHero) {
      this.errMsg.refHero = 'Please Select User Role';
      isValid = false;
    }
    return isValid
  }

  setRequest(): Auth {
    const request = _.cloneDeep(this.authDetail);
    request.departments = [];
    let divisions;
    this.departments.forEach(department => {
      if (department.control.visible) {
        divisions = [];
        if (department.divisions && department.divisions.length) {
          department.divisions.forEach(division => {
            if (division.control.visible) {
              divisions.push({
                refDivision: division.divisionId,
                name: division.name,
              });
            }
          });
        }
        request.departments.push({
          refDepartment: department.refDepartment,
          name: department.name,
          divisions: divisions
        });
      }
    });
    return request;
  }

  getDetail(_id: any) {
    this.service.getDetail(_id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.authDetail = _.cloneDeep(response.data);
        this.refHero = this.authDetail.refHero;
        this.setDepartment();
        this.setDisabledProcessFlow();
        this.authDetailTemp = _.cloneDeep(this.authDetail);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    });
  }

  getDuplicate(_id: any) {
    this.service.getDetail(_id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.authDetail = _.cloneDeep(response.data);
        this.authDetail._id = undefined;
        this.authDetail.name = '';
        this.refHero = this.authDetail.refHero;
        this.setDepartment();
        this.setDisabledProcessFlow();
        this.authDetailTemp = _.cloneDeep(this.authDetail);
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    });
  }

  setDepartment() {
    if (this.authDetail.departments.length && this.departments.length) {
      this.authDetail.departments.forEach(department => {
        const indexDepartment = this.departments.findIndex(x => x.refDepartment === department.departmentId);
        if (indexDepartment >= 0) {
          this.departments[indexDepartment].control.visible = true;
          if (this.departments[indexDepartment].divisions.length) {
            department.divisions.forEach(division => {
              const indexDivision
                = this.departments[indexDepartment].divisions.findIndex(x => x.divisionId === division.divisionId);
              if (indexDivision >= 0) {
                this.departments[indexDepartment].divisions[indexDivision].control.visible = true;
              }
            });
          }
        }
      });
    }
  }

  setDisabledProcessFlow() {
    if (this.authDefault.length) {
      const auth = this.authDefault.find(element => {
        return element.refHero === this.refHero
          && element.isDefault
          && element.processFlow.exam.steps.length
          && element.processFlow.noExam.steps.length;
      });
      if (auth) {
        this.authDetail.processFlow.exam.steps.map(step => {
          step.disabled = false;
          const found = auth.processFlow.exam.steps.find(element => {
            return element._id === step._id;
          });
          if (found) {
            step.disabled = found.editable;
          }
        });
        this.authDetail.processFlow.noExam.steps.map(step => {
          step.disabled = false;
          const found = auth.processFlow.noExam.steps.find(element => {
            return element._id === step._id;
          });
          if (found) {
            step.disabled = found.editable;
          }
        });
      }
    }
  }

  onChangeCheckbox(topic, choice) {
    if (!topic || !choice) {
      return;
    }
    switch (topic) {
      case 'JD':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.jd.visible) {
            this.authDetail.jd.editable = false;
          }
        } else {
          if (this.authDetail.jd.editable) {
            this.authDetail.jd.visible = true;
          }
        }
        break;
      case 'JR':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.jr.visible) {
            this.authDetail.jr.editable = false;
          }
        } else {
          if (this.authDetail.jr.editable) {
            this.authDetail.jr.visible = true;
          }
        }
        break;
      case 'COMPANY':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.company.visible) {
            this.authDetail.configuration.company.editable = false;
          }
        } else {
          if (this.authDetail.configuration.company.editable) {
            this.authDetail.configuration.company.visible = true;
          }
        }
        break;
      case 'DEPARTMENT':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.department.visible) {
            this.authDetail.configuration.department.editable = false;
          }
        } else {
          if (this.authDetail.configuration.department.editable) {
            this.authDetail.configuration.department.visible = true;
          }
        }
        break;
      case 'AUTHORIZE':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.authorize.visible) {
            this.authDetail.configuration.authorize.editable = false;
          }
        } else {
          if (this.authDetail.configuration.authorize.editable) {
            this.authDetail.configuration.authorize.visible = true;
          }
        }
        break;
      case 'USER':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.user.visible) {
            this.authDetail.configuration.user.editable = false;
          }
        } else {
          if (this.authDetail.configuration.user.editable) {
            this.authDetail.configuration.user.visible = true;
          }
        }
        break;
      case 'JOBPOSITION':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.jobPosition.visible) {
            this.authDetail.configuration.jobPosition.editable = false;
          }
        } else {
          if (this.authDetail.configuration.jobPosition.editable) {
            this.authDetail.configuration.jobPosition.visible = true;
          }
        }
        break;
      case 'EVALUATION':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.evaluation.visible) {
            this.authDetail.configuration.evaluation.editable = false;
          }
        } else {
          if (this.authDetail.configuration.evaluation.editable) {
            this.authDetail.configuration.evaluation.visible = true;
          }
        }
        break;
      case 'LOCATION':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.location.visible) {
            this.authDetail.configuration.location.editable = false;
          }
        } else {
          if (this.authDetail.configuration.location.editable) {
            this.authDetail.configuration.location.visible = true;
          }
        }
        break;
      case 'MAIL':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.mailTemplate.visible) {
            this.authDetail.configuration.mailTemplate.editable = false;
          }
        } else {
          if (this.authDetail.configuration.mailTemplate.editable) {
            this.authDetail.configuration.mailTemplate.visible = true;
          }
        }
        break;
      case 'REJECTION':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.rejection.visible) {
            this.authDetail.configuration.rejection.editable = false;
          }
        } else {
          if (this.authDetail.configuration.rejection.editable) {
            this.authDetail.configuration.rejection.visible = true;
          }
        }
        break;
      case 'DASHBOARD':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.dashboard.visible) {
            this.authDetail.configuration.dashboard.editable = false;
          }
        } else {
          if (this.authDetail.configuration.rejection.editable) {
            this.authDetail.configuration.rejection.visible = true;
          }
        }
        break;
      case 'REPORT':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.report.visible) {
            this.authDetail.configuration.report.editable = false;
          }
        } else {
          if (this.authDetail.configuration.report.editable) {
            this.authDetail.configuration.report.visible = true;
          }
        }
        break;
      case 'BLACKLIST':
        if (choice === 'VISIBLE') {
          if (!this.authDetail.configuration.blacklist.visible) {
            this.authDetail.configuration.blacklist.editable = false;
          }
        } else {
          if (this.authDetail.configuration.blacklist.editable) {
            this.authDetail.configuration.blacklist.visible = true;
          }
        }
        break;
      default:
        break;
    }

  }

  onSelectChangeDepartment(index: any) {
    if (this.departments[index].divisions.length) {
      this.departments[index].divisions.map(division => {
        division.control.visible = this.departments[index].control.visible;
      });
    }
  }

  onSelectChangeDivision(index: any) {
    let isEmpty: boolean;
    isEmpty = true;
    if (this.departments[index].divisions.length) {
      this.departments[index].divisions.map(division => {
        if (division.control.visible) {
          isEmpty = false;
          return;
        }
      });
    }
    if (isEmpty) {
      this.departments[index].control.visible = false;
    } else {
      this.departments[index].control.visible = true;
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
