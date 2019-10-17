import { Component, OnInit } from '@angular/core';
import { AppFormService } from './app-form.service';
import { ResponseCode } from '../../shared/app.constants';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { getRole, getFlowId, setFlowId } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { PopupMessageComponent } from '../../component/popup-message/popup-message.component';
import { DropDownValue } from '../../shared/interfaces/common.interface';
import { resolve } from 'dns';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { utimes } from 'fs';
import { MatDialog } from '@angular/material';
import { TranslateService } from '../../translate.service';
import * as _ from 'lodash';
import 'style-loader!angular2-toaster/toaster.css';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MESSAGE } from "../../shared/constants/message";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'ngx-app-form',
  templateUrl: './app-form.component.html',
  styleUrls: ['./app-form.component.scss']
})
export class AppFormComponent implements OnInit {
  role: any;
  appforms: any;
  lang = "en";
  touched: boolean;
  applicationForm: FormGroup;
  degreeMaster: DropDownValue[];

  firstname: AbstractControl;
  lastname: AbstractControl;
  nickname: AbstractControl;
  positionApply: AbstractControl;
  salary: AbstractControl;
  presentAddress: AbstractControl;
  moo: AbstractControl;
  road: AbstractControl;
  district: AbstractControl;
  amphur: AbstractControl;
  province: AbstractControl;
  postcode: AbstractControl;
  mobile: AbstractControl;
  email: AbstractControl;
  age: AbstractControl;
  race: AbstractControl;
  nationality: AbstractControl;
  religion: AbstractControl;
  sexGroup: AbstractControl;
  dob: AbstractControl;
  military: AbstractControl;
  fathername: AbstractControl;
  fathersurname: AbstractControl;
  fatheroccupation: AbstractControl;
  mothername: AbstractControl;
  mothersurname: AbstractControl;
  motheroccupation: AbstractControl;
  workCountry: AbstractControl;
  emergencyName: AbstractControl;
  emergencySurname: AbstractControl;
  emergencyRelation: AbstractControl;
  emergencyAddress: AbstractControl;
  emergencyTel: AbstractControl;
  sick: AbstractControl;
  aboutSelf: AbstractControl;
  sErrorFirstName: string;
  sErrorLastName: string;
  sErrorNickName: string;
  sErrorpositionApply: string;
  sErrorSalary: string;
  sErrorAddress: string;
  sErrorMoo: string;
  sErrorRoad: string;
  sErrorDistrict: string;
  sErrorAmphur: string;
  sErrorProvince: string;
  sErrorPostcode: string;
  sErrorMobile: string;
  sErrorEmail: string;
  sErrorAge: string;
  sErrorRace: string;
  sErrorNationality: string;
  sErrorReligion: string;
  sErrorSexGroup: string;
  sErrordob: string;
  sErrorMilitary: string;
  sErrorFatherName: string;
  sErrorFatherLast: string;
  sErrorFatherOccu: string;
  sErrorMotherName: string;
  sErrorMotherLast: string;
  sErrorMotherOccu: string;
  sErrorWorkCountry: string;
  sErrorEmerName: string;
  sErrorEmerSur: string;
  sErrorEmerRelate: string;
  sErrorEmerAddress: string;
  sErrorEmerTel: string;
  sErrorSick: string;
  sErrorAboutSelf: string;
  sErrorAll: string;
  isUser: boolean;
  _id: any;
  innerHeight: any;
  edtiable: boolean;
  isExitst: boolean;
  loading: boolean;
  constructor(
    private service: AppFormService,
    private utilitiesService: UtilitiesService,
    private toastrService: NbToastrService,
    public matDialog: MatDialog,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.initialModel();
    this.loadForm();
    this.getList();
    this.isUser = false;
    this.loading = true;
    this.innerHeight = window.innerHeight
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this._id = params.id;
        if (params.action === "view") {
          this.isUser = true;
          this.setDisabled();
          this.edtiable = false;
          this.getDetail();
        } else {
          this.edtiable = true;
          this.getDetail();
          // this.setDisabled();
        }
      }
    })
    this.setLang(this.lang);
  }

  getDetail() {
    this.service.getDetail(this._id, this.isUser).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.loading = false;
        console.log(response.data);
        if (this.isUser) {
          this.appforms = response.data;
          this.edtiable = false;
        } else {
          this.isExitst = response.data.isExist;
        }
      }
    })
  }

  initialModel(): any {
    this.appforms = {
      firstname: undefined,
      lastname: undefined,
      nickname: undefined,
      salary: undefined,
      refPosition_1: undefined,
      refPosition_2: undefined,
      personalInformation: {
        presentAddr: undefined,
        moo: undefined,
        road: undefined,
        district: undefined,
        amphur: undefined,
        province: undefined,
        postCode: undefined,
        mobile: undefined,
        email: undefined,
        dob: undefined,
        age: undefined,
        race: undefined,
        nationality: undefined,
        religion: undefined,
        sex: undefined,
        militaryStatus: undefined,
        maritalStatus: undefined,
        couple: {
          firstname: undefined,
          lastname: undefined,
          workingPlace: undefined,
          position: undefined
        }
      },
      familyInformation: {
        father: {
          firstname: undefined,
          lastname: undefined,
          age: undefined,
          occupation: undefined,
        },
        mother: {
          firstname: undefined,
          lastname: undefined,
          age: undefined,
          occupation: undefined,
        },
        numberOfChildren: undefined,
        numberOfSibling: undefined,
        numberOfMale: undefined,
        numberOfFemale: undefined,
        rankOfSibling: undefined
      },
      education: [],
      workExperience: [],
      languageAbility: [
        {
          language: "Thai",
          speaking: "",
          writing: "",
          reading: ""
        },
        {
          language: "English",
          speaking: "",
          writing: "",
          reading: ""
        },
      ],
      workUpcountry: {
        answer: undefined,
        remark: undefined,
      },
      contactEmergency: {
        firstname: undefined,
        lastname: undefined,
        relation: undefined,
        address: undefined,
        tel: undefined
      },
      knowCompanyFrom: [
        {
          source: "Facebook",
          isSelected: false,
        },
        {
          source: "JobsDB",
          isSelected: false,
        },
        {
          source: "JobFair",
          isSelected: false,
        },
        {
          source: "FRIEND",
          isSelected: false,
        },
        {
          source: "WEBSITE",
          isSelected: false,
          remark: ""
        },
      ],
      relativeEmployee: {
        firstname: undefined,
        lastname: undefined
      },
      contagiousDisease: {
        answer: undefined,
        remark: undefined
      },
      aboutYourself: undefined
    }
    return this.appforms;
  }

  loadForm() {
    this.applicationForm = this.formBuilder.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      nickname: [null, Validators.required],
      positionApply: [null, Validators.required],
      salary: [null, Validators.required],
      presentAddress: [null, Validators.required],
      moo: [null, Validators.required],
      road: [null, Validators.required],
      district: [null, Validators.required],
      amphur: [null, Validators.required],
      province: [null, Validators.required],
      postcode: [null, Validators.required],
      age: [null, Validators.required],
      dob: [null, Validators.required],
      mobile: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      race: [null, Validators.required],
      nationality: [null, Validators.required],
      religion: [null, Validators.required],
      sexGroup: [null, Validators.required],
      // military: [null, Validators.required],
      fathername: [null, Validators.required],
      fathersurname: [null, Validators.required],
      fatheroccupation: [null, Validators.required],
      mothername: [null, Validators.required],
      mothersurname: [null, Validators.required],
      motheroccupation: [null, Validators.required],
      workCountry: [null, Validators.required],
      emergencyName: [null, Validators.required],
      emergencySurname: [null, Validators.required],
      emergencyRelation: [null, Validators.required],
      emergencyAddress: [null, Validators.required],
      emergencyTel: [null, Validators.required],
      sick: [null, Validators.required],
      aboutSelf: [null, Validators.required],
    })
    console.log(this.applicationForm)
    this.firstname = this.applicationForm.controls["firstname"];
    this.lastname = this.applicationForm.controls["lastname"];
    this.nickname = this.applicationForm.controls["nickname"];
    this.positionApply = this.applicationForm.controls["positionApply"];
    this.salary = this.applicationForm.controls["salary"];
    this.presentAddress = this.applicationForm.controls["presentAddress"];
    this.moo = this.applicationForm.controls["moo"];
    this.road = this.applicationForm.controls["road"];
    this.district = this.applicationForm.controls["district"];
    this.amphur = this.applicationForm.controls["amphur"];
    this.province = this.applicationForm.controls["province"];
    this.postcode = this.applicationForm.controls["postcode"];
    this.age = this.applicationForm.controls["age"];
    this.dob = this.applicationForm.controls["dob"];
    this.mobile = this.applicationForm.controls["mobile"];
    this.email = this.applicationForm.controls["email"];
    this.race = this.applicationForm.controls["race"];
    this.nationality = this.applicationForm.controls["nationality"];
    this.religion = this.applicationForm.controls["religion"];
    this.sexGroup = this.applicationForm.controls["sexGroup"];
    // this.military = this.applicationForm.controls["military"];
    this.fathername = this.applicationForm.controls["fathername"];
    this.fathersurname = this.applicationForm.controls["fathersurname"];
    this.fatheroccupation = this.applicationForm.controls["fatheroccupation"];
    this.mothername = this.applicationForm.controls["mothername"];
    this.mothersurname = this.applicationForm.controls["mothersurname"];
    this.motheroccupation = this.applicationForm.controls["motheroccupation"];
    this.workCountry = this.applicationForm.controls["workCountry"];
    this.emergencyName = this.applicationForm.controls["emergencyName"];
    this.emergencySurname = this.applicationForm.controls["emergencySurname"];
    this.emergencyRelation = this.applicationForm.controls["emergencyRelation"];
    this.emergencyAddress = this.applicationForm.controls["emergencyAddress"];
    this.emergencyTel = this.applicationForm.controls["emergencyTel"];
    this.sick = this.applicationForm.controls["sick"];
    this.aboutSelf = this.applicationForm.controls["aboutSelf"];
    this.sErrorFirstName = MESSAGE[97];
    this.sErrorLastName = MESSAGE[98];
    this.sErrorNickName = MESSAGE[143];
    this.sErrorpositionApply = MESSAGE[137];
    this.sErrorSalary = MESSAGE[144];
    this.sErrorAddress = MESSAGE[4];
    this.sErrorMoo = MESSAGE[4];
    this.sErrorRoad = MESSAGE[4];
    this.sErrorDistrict = MESSAGE[4];
    this.sErrorAmphur = MESSAGE[4];
    this.sErrorProvince = MESSAGE[4];
    this.sErrorPostcode = MESSAGE[4];
    this.sErrorAge = MESSAGE[4];
    this.sErrordob = MESSAGE[4];
    this.sErrorMobile = MESSAGE[4];
    this.sErrorEmail = MESSAGE[4];
    this.sErrorRace = MESSAGE[4];
    this.sErrorNationality = MESSAGE[4];
    this.sErrorReligion = MESSAGE[4];
    this.sErrorSexGroup = MESSAGE[4];
    this.sErrorFatherName = MESSAGE[4];
    this.sErrorFatherLast = MESSAGE[4];
    this.sErrorFatherOccu = MESSAGE[4];
    this.sErrorMotherName = MESSAGE[4];
    this.sErrorMotherLast = MESSAGE[4];
    this.sErrorMotherOccu = MESSAGE[4];
    this.sErrorWorkCountry = MESSAGE[4];
    this.sErrorEmerName = MESSAGE[4];
    this.sErrorEmerSur = MESSAGE[4];
    this.sErrorEmerRelate = MESSAGE[4];
    this.sErrorEmerAddress = MESSAGE[4];
    this.sErrorEmerTel = MESSAGE[4];
    this.sErrorSick = MESSAGE[4];
    this.sErrorAboutSelf = MESSAGE[4];
  }

  setDisabled() {
    this.applicationForm.disable();
  }

  getList() {
    this.degreeMaster = [];
    this.service.getEducationList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.data) {
          console.log(response.data)
          response.data.forEach(element => {
            this.degreeMaster.push({
              label: element.name,
              value: element._id
            })
          });
        }
      }
    })
  }

  add(type: any) {
    switch (type) {
      case 'Education': {
        this.appforms.education.push({
          refDegree: "",
          institution: "",
          major: "",
          from: "",
          to: "",
        });
        break;
      }
      case 'workExp': {
        this.appforms.workExperience.push({
          company: "",
          from: "",
          to: "",
          position: "",
          jobDescription: "",
          salary: "",
          reasonResignation: "",
        });
        break;
      }
      case 'langu': {
        this.appforms.languageAbility.push({
          language: "",
          speaking: "",
          writing: "",
          reading: ""
        })
        break;
      }
      default:
        break;
    }
  }

  remove(option: any, index: any) {
    switch (option) {
      case 'Education': {
        this.appforms.education.splice(index, 1);
        break;
      }
      case 'workExp': {
        this.appforms.workExperience.splice(index, 1);
        break;
      }
      case 'langu': {
        this.appforms.languageAbility.splice(index, 1);
        break;
      }
    }
  }

  save() {
    if (this.validation()) {
      this.service.create(this._id, this.appforms).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.ngOnInit();
        }
      })
    }
  }

  changeText() {
    this.sErrorMilitary = "";
  }

  validation(): boolean {
    let isValid = true;
    this.sErrorAll = "";
    this.touched = true;
    console.log(this.applicationForm)
    if (this.sexGroup.value === "male") {
      if (this.appforms.personalInformation.militaryStatus === undefined
        || this.appforms.personalInformation.militaryStatus === null) {
        this.sErrorMilitary = MESSAGE[4];
        isValid = false;
      }
    }
    if (this.applicationForm.status === "VALID") {
      if (this.appforms.education.length > 0) {
        let i = 0;
        for (i = 0; i < this.appforms.education.length; i++) {
          if (this.appforms.education[i].refDegree === "" ||
            this.appforms.education[i].from === "" ||
            this.appforms.education[i].to === "" ||
            this.appforms.education[i].institution === "" ||
            this.appforms.education[i].major === ""
          ) {
            isValid = false;
            this.sErrorAll = MESSAGE[145];
          }
          var startD = new Date(this.appforms.education[i].from);
          var EndD = new Date(this.appforms.education[i].to);
          if (startD.getTime() == EndD.getTime()) {
            isValid = false;
            this.sErrorAll = MESSAGE[95];
          }
          if (startD.getTime() > EndD.getTime()) {
            isValid = false;
            this.sErrorAll = MESSAGE[95];
          }
        }
      }
      if (this.appforms.workExperience.length > 0) {
        let i = 0;
        for (i = 0; i < this.appforms.workExperience.length; i++) {
          if (this.appforms.workExperience[i].company === "" ||
            this.appforms.workExperience[i].from === "" ||
            this.appforms.workExperience[i].to === "" ||
            this.appforms.workExperience[i].jobDescription === "" ||
            this.appforms.workExperience[i].position === "" ||
            this.appforms.workExperience[i].salary === "" ||
            this.appforms.workExperience[i].reasonResignation === ""
          ) {
            isValid = false;
            this.sErrorAll = MESSAGE[146];
          }
          var startD = new Date(this.appforms.workExperience[i].from);
          var EndD = new Date(this.appforms.workExperience[i].to);
          if (startD.getTime() == EndD.getTime()) {
            isValid = false;
            this.sErrorAll = MESSAGE[95];
          }
          if (startD.getTime() > EndD.getTime()) {
            isValid = false;
            this.sErrorAll = MESSAGE[95];
          }
        }
      }
      let i = 0;
      for (i = 0; i < this.appforms.languageAbility.length; i++) {
        if (this.appforms.languageAbility[i].language === "" ||
          this.appforms.languageAbility[i].reading === "" ||
          this.appforms.languageAbility[i].speaking === "" ||
          this.appforms.languageAbility[i].writing === ""
        ) {
          isValid = false;
          this.sErrorAll = MESSAGE[147];
        }
      }
    } else {
      isValid = false;
      this.sErrorAll = MESSAGE[53];
    }
    return isValid;
  }

  setLang(lang: string) {
    this.translate.use(lang);
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
