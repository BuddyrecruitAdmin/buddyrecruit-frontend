import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';

import { TranslateService } from '../../translate.service';
import { setLangPath, getAppFormData, getRole, setCompanyName, setFlagConsent, setCompanyId, getLanguage, setLanguage, getUserToken, getFlowId, getAppformIndex, getUserSuccess, getAppformStatus, setAppformStatus, setUserToken, getFlagExam, setFlagExam, getFacebookId, getCompanyId, setAppformIndex, setUserEmail } from '../../shared/services';
import { IApplicationForm, IAttachment } from './application-form.interface';
import { DropDownValue, DropDownLangValue, DropDownGroup } from '../../shared/interfaces';
import { ApplicationFormService } from './application-form.service';
import { JdService } from '../../pages/jd/jd.service';
import { NbToastrService, NbComponentStatus, NbGlobalPhysicalPosition, NbDialogService, NbStepperComponent } from '@nebular/theme';
import { ResponseCode, InputType, State } from '../../shared/app.constants';
import { IAppFormTemplate } from '../../pages/setting/app-form/app-form.interface';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { UtilitiesService } from '../../shared/services/utilities.service';

import { API_ENDPOINT } from '../../shared/constants';
import { environment } from '../../../environments/environment';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload/ng2-file-upload';
const URL = environment.API_URI + "/" + API_ENDPOINT.FILE.FILE_UPLOAD;
import { PopupConsentComponent } from '../../component/popup-consent/popup-consent.component';
import { saveAs } from "file-saver";
@Component({
  selector: 'ngx-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class ApplicationFormComponent implements OnInit {
  InputType = InputType;
  language: string;
  template: IAppFormTemplate;
  role: any;

  appForm: IApplicationForm;
  formGroup: FormGroup;

  degreesEN: DropDownValue[] = [];
  degreesTH: DropDownValue[] = [];
  // jrs: DropDownGroup[] = [];
  jrs: any = [];
  hubs: any[] = [];
  hub: any = {};

  selectedItem = '2';

  hardSkill = {
    keyword: '',
    required: false,
    duplication: false,
  };
  softSkill = {
    keyword: '',
    required: false,
    duplication: false,
  };
  certificate = {
    keyword: '',
    required: false,
    duplication: false,
  };
  jobPosition: any;

  loading = true;
  loadingUpload = false;
  loadingButton = false;
  submitted = false;
  isPreview = false;
  isDisabled = false;
  isDisableJob = false;
  isAgree = true;

  uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'data' });
  stepper: NbStepperComponent;

  refCompany = '';
  refPosition = '';
  image = {
    originalName: '',
    uploadName: '',
    url: '',
    loading: false
  };
  userToken: any;
  flowId: string;
  @ViewChild('stepper', { static: false }) stepperComponent: NbStepperComponent;
  qExpectList: any = [];
  reserve: boolean;
  provinceFlag: boolean = false;
  areaFlag: boolean = false;
  dataIndex: any;
  detailFlag: boolean;
  editFlag: boolean;
  saveFlag: boolean;
  successFlag: boolean;
  uploadOnly: boolean;
  submitFlag: boolean;
  buttonText: string = 'edit';
  titleListTH: DropDownValue[] = [];
  titleListEN: DropDownValue[] = [];
  provinceList: DropDownValue[] = [];
  districtList: DropDownGroup[] = [];
  subDistrictList: DropDownGroup[] = [];
  filteredList: any;
  filteredDistricts: any;
  filteredSubDistricts: any;
  dataStatus: any;
  selectIndex: any;
  isUser: boolean = false;
  previewFlag: boolean = false;
  recruiterAll: boolean = false;
  canAll: any;
  fbId: any;
  companyId: any;
  today: Date;
  @Input() max: any;
  IdError: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private service: ApplicationFormService,
    private jdService: JdService,
    private toastrService: NbToastrService,
    public matDialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>
  ) {
    this.role = getRole();
    setLangPath("RESUME");
    this.language = getLanguage() || 'en';
    this.setLang(this.language);
    this.flowId = getFlowId();
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);
  }

  ngOnInit() {
    this.getDegrees();
    this.initialModel();
    this.initialForm();
    this.detailFlag = false;
    this.editFlag = true;
    this.saveFlag = false;
    this.submitFlag = false;
    this.successFlag = false;
    this.uploadOnly = false;
    this.selectIndex = 0;
    this.fbId = getFacebookId();
    this.activatedRoute.params.subscribe(params => {
      const action = params.action;
      const refCompany = params.id;
      const refTemplate = params.id;
      const refAppform = params.id;

      this.refCompany = refCompany;
      if (action) {
        if (action === State.Preview) {
          this.previewFlag = true;
          if (refTemplate) {
            this.getTemplate(undefined, refTemplate);
          } else {
            this.template = getAppFormData();
            if (this.template) {
              this.appForm.refCompany = this.template.refCompany;
              this.appForm.refTemplate = this.template._id;
              this.appForm.questions = this.template.questions;
              this.initialAnswer();
              this.getJR(this.role && this.role.refCompany ? this.role.refCompany : undefined);
              this.getTitle(this.role && this.role.refCompany ? this.role.refCompany : undefined);
            } else {
              this.onError();
            }
          }
          this.isPreview = true;
        } else if (action === State.Submit && refCompany) {
          this.dataIndex = getAppformIndex();
          this.dataStatus = getAppformStatus();
          setAppformStatus();
          this.submitFlag = true;
          if (this.dataStatus) {
            this.getDetail(this.dataStatus.token, this.dataStatus.appformId)
          } else {
            this.getTemplate(refCompany, undefined);
          }
        } else if (action === State.Detail && refAppform) {
          this.successFlag = true;
          this.isDisabled = true;
          this.detailFlag = true;
          this.editFlag = false;
          this.userToken = getUserToken();
          const role = getRole()
          this.canAll = getFlagExam();
          console.log(this.canAll)
          if (this.canAll === 'true') {
            this.companyId = getCompanyId();
            this.recruiterAll = true;
          }
          if (role) {
            this.isUser = true;
          }
          this.initialForm();
          this.getDetail(this.userToken, refAppform);
        } else if (action === State.Edit && refAppform) {
          this.isDisableJob = true;
          this.successFlag = getUserSuccess();
          this.editFlag = false;
          if (this.successFlag) {
            this.selectIndex = 2;
          }
          // if (this.successFlag) {
          //   this.editFlag = false;
          // }
          this.userToken = getUserToken();
          setUserToken();
          const appformId = getAppFormData();
          this.initialForm();
          this.getDetail(this.userToken, appformId);
        } else {
          this.onError();
        }
      } else {
        this.onError();
      }
    });
  }

  setEdit() {
    if (this.editFlag) {
      this.buttonText = "edit";
      this.saveFlag = false;
      this.formGroup.disable();
    } else {
      this.buttonText = "display";
      this.saveFlag = true;
      this.formGroup.enable();
    }
    this.editFlag = !this.editFlag;
  }

  setLang(lang) {
    this.language = lang;
    this.translate.use(lang);
    this._adapter.setLocale(lang === 'en' ? 'en-GB' : 'th-TH');
    setLanguage(this.language);
    this.getProvince();
  }

  getJR(refCompany: string) {
    this.jrs = [];
    this.service.getJR(refCompany).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          // response.data.forEach(element => {
          //   if (element._id && element.refJD && element.refJD.position) {
          //     this.jrs.push({
          //       label: element.refJD.position,
          //       group: element.refJD.refPosition,
          //       value: element._id
          //     });
          //   }
          // });
          this.jrs = response.data;
          this.jrs.forEach(element => {
            if (element._id && element.refJD && element.refJD.position) {
              element.checked = false;
              if (this.appForm.refJR) {
                if (this.appForm.refJR === element._id) {
                  element.checked = true;
                }
              }
            }
          })
          if (this.appForm.refJR) {
            this.jrs.forEach(element => {
              if (element._id === this.appForm.refJR) {
                this.refPosition = element.refJD.refPosition;
                if (this.recruiterAll) {
                  this.appForm.refPosition = this.refPosition;
                }
              }
            });
          }
        }
      }
      if (this.template.isExpress) {
        this.service.getHub(refCompany).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.hubs = response.data;
            this.hubs.map(hub => {
              hub.checked = false;
              hub.provinces.map(province => {
                province.checked = false;
                province.color = false;
                province.areas.map(area => {
                  area.checked = false;
                  area.color = false;
                  if (this.hub.length > 0) {
                    if (this.hub[0].refProvince._id === province.refProvince) {
                      province.checked = true;
                      hub.checked = true;
                    }
                    if (this.hub[0].area === area._id) {
                      area.checked = true;
                    }
                  }
                })
              })
              // hub.provinces.map(province => {
              //   province.checked = false;
              //   province.districts.map(district => {
              //     district.checked = false;
              //     district.subDistricts.map(subDistrict => {
              //       subDistrict.checked = false;
              //     });
              //   });
              // });
            });
          }
          // if (this.isDisableJob) {
          //   this.onChangeJR(this.appForm.refJR);
          // }
          this.loading = false;
        });
      }
      this.loading = false;
    });
  }

  getTitle(refCompany: string) {
    this.titleListTH = [];
    this.titleListEN = [];
    this.service.getTitle(refCompany).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          response.data.map(element => {
            this.titleListTH.push({
              label: element.name.th,
              value: element._id
            })
            this.titleListEN.push({
              label: element.name.en,
              value: element._id
            })
          })
        }
      }
    })
    this.getProvince();
  }

  getProvince() {
    this.provinceList = [];
    this.service.getProvince().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        response.data.forEach(item => {
          if (this.language === 'th') {
            this.provinceList.push({
              label: item.name.th,
              value: item._id
            });
          } else {
            this.provinceList.push({
              label: item.name.en,
              value: item._id
            });
          }
        });
        this.filteredList = this.provinceList.slice();
      }
    });
  }

  getDistrict(value) {
    this.districtList = [];
    this.service.getDistrict(value).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        response.data.forEach((item, index) => {
          this.districtList.push({
            label: item.name.th,
            value: item._id,
            group: index
          });
        });
        this.filteredDistricts = this.districtList.slice();
      }
    })
  }

  getSubDistrict(value) {
    this.subDistrictList = [];
    this.service.getSubDistrict(value).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        response.data.forEach((item, index) => {
          this.subDistrictList.push({
            label: item.name.th,
            value: item._id,
            group: index
          });
        });
        this.filteredSubDistricts = this.subDistrictList.slice();
      }
    })
  }

  getDegrees() {
    this.degreesEN = [];
    this.degreesTH = [];
    this.jdService.getEducationList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          response.data.forEach(element => {
            this.degreesEN.push({
              label: element.name,
              value: element._id
            });
            this.degreesTH.push({
              label: element.nameTH || element.name,
              value: element._id
            });
          });
        }
      }
    });
  }

  initialModel() {
    this.appForm = {
      refCompany: undefined,
      refTemplate: undefined,
      refJR: undefined,
      hubs: [],
      otherJob: '',
      idCard: '',
      title: '',
      fbId: '',
      channel: '',
      firstnameEN: '',
      lastnameEN: '',
      firstname: '',
      lastname: '',
      birth: null,
      age: null,
      phone: '',
      reservePhone: '',
      email: '',
      address: '',
      addressNo: '',
      road: '',
      refDistrict: '',
      refSubDistrict: '',
      refProvince: '',
      postcode: '',
      gender: '',
      expectedSalary: '',
      isReserve: false,
      workExperience: {
        totalExpMonth: 0,
        work: []
      },
      education: [],
      hardSkill: [],
      softSkill: [],
      certificate: [],
      attachment: this.initialAttahment(),
      questions: [],
      refPosition: '',
      jobSelected: '',
      jobChildSelected: '',
      jobMultiChild: new FormControl(),
      isUser: false
    };
  }

  initialForm() {
    this.formGroup = this.formBuilder.group({
      email: [{ value: '', disabled: this.isDisabled }, [Validators.email, Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')]],
      // phone: [{ value: '', disabled: this.isDisabled }, [Validators.pattern('^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]*$')]],
      phone: [{ value: '', disabled: this.isDisabled }, [Validators.pattern('^[0-9]{10}$')]],
      reservePhone: [{ value: '', disabled: this.isDisabled }, [Validators.pattern('^[0-9]{10}$')]],
      postcode: [{ value: '', disabled: this.isDisabled }, [Validators.pattern('^[0-9]{5}$')]],
      gpa: [{ value: '', disabled: this.isDisabled }, [Validators.maxLength(4)]],
      fIdCard: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.minLength(13)]]
    });
    if (this.successFlag && !this.editFlag) {
      this.formGroup.disable();
    }
  }

  get f() { return this.formGroup.controls; }

  initialAttahment(): IAttachment {
    return {
      uploadName: '',
      originalName: '',
      type: '',
      size: 0,
      imgaeURL: ''
    };
  }

  getTemplate(refCompany: string, refTemplate: string, refPosition = undefined) {
    if ((!this.isDisabled && !this.successFlag && refPosition !== this.appForm.refPosition) || (this.recruiterAll && (refPosition !== this.appForm.refPosition))) {
      if (this.recruiterAll) {
        refCompany = this.companyId;
      }
      this.service.getTemplate(refCompany, refTemplate, refPosition).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          if (this.submitFlag && this.appForm.refJR) {
            const header = document.getElementById("headerForm");
            header.scrollIntoView();
          }
          if (response.data) {
            if (this.fbId) {
              this.appForm.fbId = this.fbId.id;
              this.appForm.channel = this.fbId.channel;
            }
            this.template = response.data;
            this.appForm.refCompany = this.template.refCompany;
            this.appForm.refTemplate = this.template._id;
            this.appForm.refPosition = this.refPosition;
            this.refCompany = this.appForm.refCompany;
            if (this.previewFlag || this.submitFlag || this.recruiterAll) {
              this.appForm.questions = this.template.questions
            }
            // if (this.submitFlag) {
            //   this.appForm.questions = this.template.questions;
            // }
            // if (this.recruiterAll) {
            //   this.appForm.questions = this.template.questions;
            // }
            this.initialAnswer();
          }
          if (this.dataIndex) {
            this.appForm.phone = this.dataIndex.phone || this.appForm.phone;
            this.appForm.reservePhone = this.dataIndex.reservePhone || this.appForm.reservePhone;
            this.appForm.idCard = this.dataIndex.idCard || this.appForm.idCard;
          }
          if (!refPosition) {
            this.getJR(this.template.refCompany);
            this.getTitle(this.template.refCompany);
          }
          this.uploader = new FileUploader({
            url: URL,
            itemAlias: 'data',
            headers: [
              {
                name: 'refCompany',
                value: this.appForm.refCompany
              },
              {
                name: 'isCV',
                value: false
              },
              {
                name: 'isExpress',
                value: this.template.isExpress
              },
            ],
          });
        } else if (response.code === ResponseCode.NoContent) {
          let message = 'Sorry! At this time, there is no recruitment.';
          if (this.language === 'th') {
            message = 'ขออภัย ขณะนี้ยังไม่มีการรับสมัครพนักงาน';
          }
          const confirm = this.matDialog.open(PopupMessageComponent, {
            width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
            data: { type: 'I', content: message }
          });
          confirm.afterClosed().subscribe(result => {
            if (result) {
              window.close();
            }
          });
        } else {
          this.onError();
        }
      });
    }
  }

  getDetail(refAppform: string, appFormId: string = undefined) {
    this.service.getDetail(refAppform, appFormId, this.flowId, this.isUser).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          this.appForm = response.data;
          this.appForm.title = response.data.refTitle;
          this.template = response.data.refTemplate;
          // this.hub.provinces = this.appForm.hubs || [];
          // if (this.hub.provinces && this.hub.provinces.length) {
          //   this.hub.provinces.map(province => {
          //     province.checked = true;
          //     if (province.districts && province.districts.length) {
          //       province.districts.map(district => {
          //         district.checked = true;
          //         if (district.subDistricts && district.subDistricts.length) {
          //           district.subDistricts.map(subDistrict => {
          //             subDistrict.checked = true;
          //           });
          //         }
          //       });
          //     }
          //   });
          // }

          this.hub = this.appForm.hubs || [];

          if (this.dataStatus) {
            this.appForm.refJR = '';
            this.appForm.hubs = [];
            // this.appForm.questions = [];
            // this.appForm.refPosition = '';
            this.hub = [];
            this.appForm._id = null;
          }

          this.getJR(this.appForm.refCompany);
          this.getTitle(this.appForm.refCompany);
          if (this.appForm.refProvince) {
            this.getDistrict(this.appForm.refProvince);
            if (this.appForm.refDistrict) {
              this.getSubDistrict(this.appForm.refDistrict);
            }
          }
          if (response.data.hubs) {
            response.data.hubs.forEach(element => {
              if (element.refProvince) {
                if (element.refProvince._id) {
                  this.provinceFlag = true;
                }
              }
              if (element.area) {
                this.areaFlag = true;
              }
            });
          }
          if (this.utilitiesService.dateIsValid(this.appForm.birth)) {
            this.appForm.birth = new Date(this.appForm.birth);
          } else {
            this.appForm.birth = null;
          }
          if (this.appForm.workExperience.work && this.appForm.workExperience.work.length) {
            this.appForm.workExperience.work.map(element => {
              element.start = new Date(element.start);
              if (!element.isPresent) {
                element.end = new Date(element.end);
              } else {
                element.end = null;
              }
            });
          }
          const jobMultiChild = this.appForm.jobMultiChild || [];
          this.appForm.jobMultiChild = new FormControl();
          this.appForm.jobMultiChild.value = jobMultiChild;

          this.appForm.questions.forEach(question => {
            if (question.type === InputType.ParentChild) {
              const multiChilds = question.multiChilds || [];
              question.multiChilds = new FormControl();
              question.multiChilds.value = multiChilds;
            }
            if (question.answer.attachment.originalName) {
              this.fileDownload(undefined, question.answer.attachment)
            }
          });
          if (this.successFlag) {
            this.uploader = new FileUploader({
              url: URL,
              itemAlias: 'data',
              headers: [
                {
                  name: 'refCompany',
                  value: this.appForm.refCompany
                },
                {
                  name: 'isCV',
                  value: false
                },
                {
                  name: 'isExpress',
                  value: this.template.isExpress
                },
              ],
            });
          }
        }
      }
    });
  }

  initialAnswer() {
    if (this.appForm.questions) {
      this.appForm.questions.map(question => {
        question.isLoading = false;
        switch (question.type) {
          case InputType.RadioGrid:
            question.answer.gridRadio = [];
            question.grid.rows.forEach(row => {
              question.answer.gridRadio.push({
                rowName: row.label,
                value: '',
              });
            });
            break;

          case InputType.ChcekBoxGrid:
            question.answer.gridCheckbox = [];
            let columns = [];
            question.grid.columns.forEach(col => {
              columns.push({
                colName: col.label,
                maxScore: col.maxScore,
                checked: false,
              })
            });
            question.grid.rows.forEach(row => {
              question.answer.gridCheckbox.push({
                rowName: row.label,
                columns: JSON.parse(JSON.stringify(columns)),
              });
            });
            break;

          case InputType.ParentChild:
            question.multiChilds = new FormControl();

          default:
            break;
        }
      });
    }
  }

  // onChangeJR(refJR: string) {
  //   const refPosition = this.jrs.find(jr => {
  //     return jr.value === refJR;
  //   });
  //   if (refPosition) {
  //     this.hub = this.hubs.find(element => {
  //       return element.refPosition._id === refPosition.group;
  //     });
  //   }
  //   this.refPosition = refPosition.group;
  // }

  onChangeHub(checked, _id) {
    this.provinceFlag = false;
    if (checked) {
      this.hubs.forEach(hub => {
        if (hub._id !== _id) {
          hub.checked = false;
        }
        hub.provinces.forEach(province => {
          province.checked = false;
          province.areas.forEach(area => {
            area.checked = false;
          });
        });
      });
    }
    // this.hub.provinces.forEach(province => {
    //   if (!province.checked) {
    //     province.districts.map(district => {
    //       district.checked = false;
    //       district.subDistricts.forEach(subDistrict => {
    //         subDistrict.checked = false;
    //       });
    //     });
    //   }
    // });
  }

  onChangeProvince(checked, _id) {
    this.provinceFlag = false;
    this.areaFlag = false;
    if (checked) {
      this.provinceFlag = true;
      this.hubs.forEach(hub => {
        hub.provinces.forEach(province => {
          province.color = false;
          if (province.refProvince !== _id) {
            province.checked = false;
          }
          province.areas.forEach(area => {
            area.checked = false;
          });
        });
      });
    }
  }

  onSelectPosition(checked, option) {
    if (checked) {
      this.jrs.forEach(opt => {
        if (opt._id !== option.refJD.refPosition) {
          opt.checked = false
        }
      });
      // if (this.appForm.refJR !== option._id) {
      //   const topHeader = document.getElementById("resume");
      //   topHeader.scrollIntoView();
      // }
      this.appForm.refJR = option._id;
      this.refPosition = option.refJD.refPosition;
      this.getTemplate(this.refCompany, undefined, this.refPosition);
    } else {
      this.appForm.refJR = '';
    }
  }

  onChangeArea(checked, _id) {
    this.areaFlag = false;
    if (checked) {
      this.areaFlag = true;
      this.hubs.forEach(hub => {
        hub.provinces.forEach(province => {
          province.areas.forEach(area => {
            area.color = false;
            if (area._id !== _id) {
              area.checked = false;
            }
          });
        })
      });
    }
  }

  // onChangeDistrict() {
  //   this.hub.provinces.forEach(province => {
  //     province.districts.map(district => {
  //       if (!district.checked) {
  //         district.subDistricts.forEach(subDistrict => {
  //           subDistrict.checked = false;
  //         });
  //       }
  //     });
  //   });
  // }

  onChangeBirthday(value: any) {
    const birthDay = new Date(value);
    const ageDifMs = Date.now() - birthDay.getTime();
    const ageDate = new Date(ageDifMs);
    this.appForm.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  addWorkExperience() {
    this.appForm.workExperience.work.push({
      position: '',
      company: '',
      start: null,
      end: null,
      isPresent: false,
      duty: '',
      expMonth: 0,
      deletion: false
    });
  }

  removeWorkExperience(index: number) {
    if (index >= 0) {
      this.appForm.workExperience.work.splice(index, 1);
    }
  }

  addEducation() {
    this.appForm.education.push({
      refDegree: undefined,
      gpa: '',
      university: '',
      major: '',
      deletion: false
    });
  }

  removeEducation(index: number) {
    if (index >= 0) {
      this.appForm.education.splice(index, 1);
    }
  }

  addHardSkill() {
    this.hardSkill.required = false;
    this.hardSkill.duplication = false;

    if (this.hardSkill.keyword) {
      if (this.appForm.hardSkill.indexOf(this.hardSkill.keyword) === -1) {
        this.appForm.hardSkill.push(this.hardSkill.keyword);
        this.hardSkill.keyword = '';
      } else {
        this.hardSkill.duplication = true;
      }
    } else {
      this.hardSkill.required = true;
    }
  }

  removeHardSkill(index: number) {
    this.appForm.hardSkill.splice(index, 1);
  }

  addSoftSkill() {
    this.softSkill.required = false;
    this.softSkill.duplication = false;

    if (this.softSkill.keyword) {
      if (this.appForm.softSkill.indexOf(this.softSkill.keyword) === -1) {
        this.appForm.softSkill.push(this.softSkill.keyword);
        this.softSkill.keyword = '';
      } else {
        this.softSkill.duplication = true;
      }
    } else {
      this.softSkill.required = true;
    }
  }

  removeSoftSkill(index: number) {
    this.appForm.softSkill.splice(index, 1);
  }

  addCertificate() {
    this.certificate.required = false;
    this.certificate.duplication = false;

    if (this.certificate.keyword) {
      if (this.appForm.certificate.indexOf(this.certificate.keyword) === -1) {
        this.appForm.certificate.push(this.certificate.keyword);
        this.certificate.keyword = '';
      } else {
        this.certificate.duplication = true;
      }
    } else {
      this.certificate.required = true;
    }
  }

  removeCertificate(index: number) {
    this.appForm.certificate.splice(index, 1);
  }

  onError() {
    let message = 'Something went wrong. Please try again.';
    if (this.language === 'th') {
      message = 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่ (หน้าต่างจะปิดตัวลง)';
    }
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'I', content: message }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        window.close();
      }
    });
  }

  noExpect(qExpect) {
    let message = 'Your qualifications do not match';
    let btnText = 'Accept'
    let btnText2 = 'Exit'
    if (this.language === 'th') {
      message = 'คุณสมบัติของท่านไม่ตรงตามที่กำหนด ดังนี้';
      btnText = 'ยืนยัน';
      btnText2 = 'ออกจากหน้านี้'
    }
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'E', content: message, contents: qExpect, btnText: btnText, btnText2: btnText2 }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.stepperComponent.previous();
        this.stepperComponent.previous();
      }
      else {
        this.stepperComponent.next();
      }
    });
  }

  closeWindow() {
    let message = 'Are you sure you want to close this window?';
    if (this.language === 'th') {
      message = 'คุณต้องการจะปิดหน้าต่างนี้หรือไม่ ?';
    }
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'C', content: message }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        window.close();
      }
    });
  }

  save() {
    if (this.validation()) {
      let content;
      if (this.language === 'th') {
        content = 'คุณต้องการยืนยันการสมัครงานหรือไม่?';
        if (this.detailFlag || this.successFlag) {
          content = 'คุณต้องการบันทึกหรือไม่?';
        }
      } else {
        if (this.detailFlag || this.successFlag) {
          content = 'Do you want to save?';
        }
      }
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'C', content: content }
      });
      confirm.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          const request = this.setRequest();
          this.service.create(request).subscribe(response => {
            if (response.code === ResponseCode.Success) {
              this.submitted = true;
            } else if (response.code === ResponseCode.Duplicate) {
              let message = 'You have applied for this job position.';
              if (this.language === 'th') {
                message = 'คุณได้สมัครตำแหน่งงานนี้ไปแล้ว';
              }
              this.showToast('danger', message);
            } else {
              this.showToast('danger', response.message || 'Error!', '');
            }
            this.loading = false;
          });
        }
      });
    }
  }

  getQuestionElementError(): any {
    let isQuestionValid = true;
    let qElement: any;
    this.qExpectList = [];
    if (document.getElementById('question' + 0)) {
      this.reserve = false;
    }
    this.appForm.questions.forEach((question, index) => {

      const element = document.getElementById('question' + index);
      if (element) {
        element.classList.remove("has-error");
        if (question.required) {
          switch (question.type) {
            case this.InputType.Input:
              if (!question.answer.input) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
              break;
            case this.InputType.TextArea:
              if (!question.answer.textArea) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
              break;
            case this.InputType.Radio:
              if (question.answer.selected === null) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
              break;
            case this.InputType.ChcekBox:
              const found = question.answer.options.find(element => {
                return element.checked;
              });
              if (!found && !question.answer.otherChecked) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
              break;
            case this.InputType.Dropdown:
              if (question.answer.selected === null) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
              break;
            case this.InputType.Upload:
              if (!question.answer.attachment.uploadName) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
              break;
            case this.InputType.Linear:
              if (!(question.answer.linearValue >= 0)) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
              break;
            case this.InputType.RadioGrid:
              question.answer.gridRadio.forEach(gridRadio => {
                if (!gridRadio.value) {
                  isQuestionValid = false;
                  element.classList.add("has-error");
                }
              });
              break;
            case this.InputType.ChcekBoxGrid:
              question.answer.gridCheckbox.forEach(gridCheckbox => {
                const found = gridCheckbox.columns.find(column => {
                  return column.checked;
                });
                if (!found) {
                  isQuestionValid = false;
                  element.classList.add("has-error");
                }
              });
              break;
            case this.InputType.Date:
              if (!question.answer.date) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
              break;
            case this.InputType.Time:
              if (!question.answer.time) {
                isQuestionValid = false;
                element.classList.add("has-error");
              }
              break;
          }

          if (!isQuestionValid && !qElement) {
            qElement = element;
          }
        }
        if (question.answer.expected >= 0 && (question.type === this.InputType.Radio) && question.answer.expected !== null) {
          if (question.answer.expected !== question.answer.selected) {
            this.reserve = true;
            this.qExpectList.push(question.title)

          }
        }
      }
    });

    return qElement;
  }

  validation(): boolean {
    let isValid = true;
    const elements = document.getElementsByClassName('mat-input-element ng-invalid');
    if (elements.length > 0) {
      isValid = false;
      const id = elements.item(0).getAttribute('id');
      if (id) {
        document.getElementById(id).focus();
      }
    }
    // idCard
    if (this.appForm.idCard.length === 12 || this.appForm.idCard.toString().substring(0, 1) === '0') {
      isValid = false;
      this.IdError = 'เลขบัตรประชาชนไม่ถูกต้อง';
      this.formGroup.controls.fIdCard.setErrors({})
    }

    const qElement = this.getQuestionElementError();
    if (isValid && qElement) {
      isValid = false;
      qElement.scrollIntoView();
    } else if (this.qExpectList.length > 0 && !this.detailFlag) {
      isValid = false;
      this.noExpect(this.qExpectList);
    }
    if (isValid) {
      const header = document.getElementById("headerForm");
      header.scrollIntoView();
    }
    return isValid;
  }

  setRequest(): IApplicationForm {
    const request = this.appForm;
    request.hubs = [];
    // if (this.hub && this.hub.provinces && this.hub.provinces.length) {
    if (this.hubs && this.hubs.length) {
      this.hubs.forEach(hub => {
        if (hub.checked) {
          hub.provinces.forEach(province => {
            if (province.checked) {
              province.areas.forEach(area => {
                if (area.checked) {
                  request.hubs.push({
                    refProvince: province.refProvince,
                    area: area._id,
                    refSector: hub._id
                  })
                }
              });
            }
          });
        }
      })
      // this.hub.provinces.forEach(province => {
      //   let districts = [];
      //   if (province.checked) {
      //     province.districts.forEach(district => {
      //       let subDistricts = [];
      //       if (district.checked) {
      //         district.subDistricts.forEach(subDistrict => {
      //           if (subDistrict.checked) {
      //             subDistricts.push({
      //               refSubDistrict: subDistrict.refSubDistrict._id
      //             });
      //           }
      //         });
      //         districts.push({
      //           refDistrict: district.refDistrict._id,
      //           subDistricts: subDistricts,
      //         });
      //       }
      //     });
      //     request.hubs.push({
      //       refProvince: province.refProvince._id,
      //       districts: districts
      //     });
      //   }
      // });
    }
    request.isUser = this.isUser
    request.isReserve = this.reserve || this.appForm.isReserve;
    request.birth = new Date(request.birth);
    request.address = request.addressNo + ' '
    request.road + ' '
    request.refDistrict + ' '
    request.refSubDistrict + ' '
    request.refProvince + ' '
    request.postcode;
    if (request.workExperience.work && request.workExperience.work.length) {
      request.workExperience.work.map(element => {
        element.start = new Date(element.start);
        if (!element.isPresent) {
          element.end = new Date(element.end);
        } else {
          element.end = new Date();
        }
        request.workExperience.totalExpMonth += this.utilitiesService.getNumberOfMonth(element.start, element.end);
      });
    }
    if (request.jobMultiChild && request.jobMultiChild.value) {
      request.jobMultiChild = request.jobMultiChild.value;
    } else {
      request.jobMultiChild = [];
    }

    // Question
    if (request.questions && request.questions.length) {
      request.questions.map(question => {
        if (question.answer.attachment.imgaeURL) {
          question.answer.attachment.imgaeURL = '';
        }
        if (question.type === InputType.ParentChild) {
          if (question.multiChilds && question.multiChilds.value) {
            question.multiChilds = question.multiChilds.value;
          } else {
            question.multiChilds = [];
          }
        }

        // Calculate score
        if (question.score.isScore) {
          switch (question.type) {

            case InputType.Input:
              if (question.score.keywords && question.score.keywords.length) {
                question.score.keywords.forEach(keyword => {
                  const index = question.answer.input.indexOf(keyword);
                  if (index >= 0) {
                    question.score.submitScore = question.score.maxScore;
                  }
                });
              }
              break;

            case InputType.TextArea:
              if (question.score.keywords && question.score.keywords.length) {
                question.score.keywords.forEach(keyword => {
                  const index = question.answer.textArea.indexOf(keyword);
                  if (index >= 0) {
                    question.score.submitScore = question.score.maxScore;
                  }
                });
              }
              break;

            case InputType.Radio:
              if (question.answer.selected >= 0) {
                const option = question.answer.options[question.answer.selected];
                if (option) {
                  question.score.submitScore = option.maxScore;
                } else {
                  question.score.submitScore = question.answer.otherScore;
                }
              }
              break;

            case InputType.ChcekBox:
              question.answer.options.forEach(option => {
                if (option.checked) {
                  question.score.submitScore += option.maxScore;
                }
              });
              if (question.answer.otherChecked) {
                question.score.submitScore += question.answer.otherScore;
              }
              break;

            case InputType.Dropdown:
              if (question.answer.selected >= 0) {
                const option = question.answer.options[question.answer.selected];
                if (option) {
                  question.score.submitScore = option.maxScore;
                } else {
                  question.score.submitScore = question.answer.otherScore;
                }
              }
              break;

            case InputType.ParentChild:
              if (question.parentSelected >= 0) {
                const parent = question.parentChild[question.parentSelected];
                if (parent) {
                  question.score.submitScore = parent.maxScore;
                }
              }
              break;

            case InputType.Upload:
              if (question.answer.attachment && question.answer.attachment.uploadName) {
                question.score.submitScore = question.score.maxScore;
              } else {
                question.score.submitScore = 0;
              }
              break;

            case InputType.Linear:
              const option = question.answer.linearOptions.find(option => {
                return option.label === question.answer.linearValue;
              });
              if (option) {
                question.score.submitScore = option.maxScore;
              }
              break;

            case InputType.RadioGrid:
              if (question.answer.gridRadio && question.answer.gridRadio.length) {
                question.answer.gridRadio.forEach(gridRadio => {
                  const column = question.grid.columns.find(column => {
                    return column.label === gridRadio.value;
                  });
                  if (column) {
                    question.score.submitScore += column.maxScore;
                  }
                });
              }
              break;

            case InputType.ChcekBoxGrid:
              if (question.answer.gridCheckbox && question.answer.gridCheckbox.length) {
                question.answer.gridCheckbox.forEach(gridCheckbox => {
                  gridCheckbox.columns.forEach(column => {
                    if (column.checked) {
                      question.score.submitScore += column.maxScore;
                    }
                  });
                });
              }
              break;
          }
        }
      });
    }
    return request;
  }

  uploadFile(target, files: FileList, isCV = false, question = undefined): void {
    const FileSize = files[0].size / 1024 / 1024; // MB
    if (FileSize > 15) {
      this.showToast('danger', 'File size more than 15MB');
      target.uploadName = '';
      target.originalName = '';
      target.type = '';
      target.size = 0;
    } else {
      target.originalName = files[0].name;
      const queue = this.uploader.queue.find(element => {
        return element.file.name === files[0].name
          && element.file.type === files[0].type
          && element.file.size === files[0].size;
      });
      if (queue) {
        this.uploader.options.headers.map(element => {
          if (element.name === 'isCV') {
            element.value = isCV.toString();
          }
        });
        this.loadingUpload = true;
        if (question) {
          question.isLoading = true;
          // this.appForm.questions.forEach(ques => {
          //   ques.isLoading = true;
          // })
        }
        this.uploader.uploadItem(queue);
        this.uploader.onSuccessItem = (item, response, status, headers) => {
          const responseData = JSON.parse(response);
          if (question) {
            this.appForm.questions.forEach(ques => {
              if (ques.answer.attachment.originalName === responseData.originalName) {
                ques.answer.attachment.uploadName = responseData.uploadName;
                ques.answer.attachment.originalName = responseData.originalName;
                ques.answer.attachment.type = files[0].type;
                ques.answer.attachment.size = files[0].size;
                this.loadingUpload = false;
                // set pic preview
                let reader = new FileReader();
                reader.readAsDataURL(item._file);
                reader.onload = (e) => {
                  let imgage = new Image;
                  const chImg = reader.result;
                  imgage.src = chImg.toString();
                  imgage.onload = (ee) => {
                  };
                  ques.answer.attachment.imgaeURL = imgage.src;
                };
                if (question) {
                  ques.isLoading = false;
                  // this.appForm.questions.forEach(ques => {
                  //   ques.isLoading = false;
                  // })
                }
              }
            })
          }
        };
      }
    }
  }

  clearFile(target): void {
    const queue = this.uploader.queue.find(element => {
      return element.file.name === target.originalName
        && element.file.type === target.type
        && element.file.size === target.size;
    });
    if (queue) {
      this.uploader.cancelItem(queue);
      this.uploader.removeFromQueue(queue);
    }
    target.uploadName = '';
    target.originalName = '';
    target.type = '';
    target.size = 0;
    target.imgaeURL = '';
  }

  fileDownload(dialog: TemplateRef<any>, attachment: any): void {
    this.image = {
      originalName: '',
      uploadName: '',
      url: '',
      loading: true
    };
    if (dialog) {
      this.dialogService.open(dialog);
    }
    this.service.fileDownload(this.appForm.refCompany, attachment.uploadName).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.image.originalName = attachment.originalName;
        this.image.uploadName = attachment.uploadName;
        this.image.url = response.data.url;
        this.image.loading = false;
        if (!dialog) {
          attachment.imgaeURL = response.data.url;
        }
      }
    });
  }

  downloadPress(file: any) {
    this.service
      .fileDownload(this.appForm.refCompany, file.uploadName)
      .subscribe(data => this.downloadFile(data, file.originalName), function (error) {
        this.alertType = "danger";
        this.alertMessage = error;
      });
  }

  downloadFile(data: any, name: string) {
    let url = data.data.url;
    saveAs(url, name);
  }
  // onChangeJobPosition(value: string) {
  //   this.appForm.jobChildSelected = '';
  //   this.appForm.jobMultiChild = new FormControl();
  //   this.jobPosition = this.template.jobPositions.find(element => {
  //     return element.refPosition === value;
  //   });
  // }

  getChild(question): any {
    let child;
    if (question.parentChild.length && question.parentSelected >= 0) {
      child = question.parentChild[question.parentSelected];
    }
    return child;
  }

  gotoStatus() {
    this.router.navigate(['/application-form/status']);
  }

  validJob(refCompany: string, refTemplate: string, refPosition = undefined) {
    let valid = true;
    let message = '';
    if (this.template.isExpress) {
      if (!this.provinceFlag) {
        valid = false;
        message = message || 'โปรดเลือกจังหวัด';
        if (this.hubs.length > 0) {
          this.hubs.forEach(hub => {
            if (hub.checked) {
              hub.provinces.forEach(province => {
                province.color = true;
              });
            }
          })
        }
      }
      if (!this.areaFlag) {
        valid = false;
        message = message || 'โปรดเลือกพื้นที่ในจังหวัด';
        if (this.hubs.length > 0) {
          this.hubs.forEach(hub => {
            if (hub.checked) {
              hub.provinces.forEach(province => {
                if (province.checked) {
                  province.areas.forEach(area => {
                    area.color = true;
                  });
                }
              });
            }
          })
        }
      }
    }
    if (!valid) {
      const confirm = this.matDialog.open(PopupMessageComponent, {
        width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
        data: { type: 'I', content: message }
      });
      confirm.afterClosed().subscribe(result => {
        // if (result) {
        //   window.close();
        // }
      });
    } else {
      this.stepperComponent.next();
      this.getTemplate(refCompany, refTemplate, refPosition);
    }
  }

  openPopupConsent() {
    setCompanyName(this.template.companyName || '');
    setCompanyId(this.template.refCompany);
    setFlagConsent(this.isAgree)
    this.dialogService.open(PopupConsentComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      this.isAgree = result;
    });
  }

  showToast(type: NbComponentStatus, title: string, body: string = '') {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 5000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
      preventDuplicates: false,
    };
    this.toastrService.show(body, title, config);
  }

}
