import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../translate.service';
import { IResume, IWorkExperience, IWork } from './resume.interface';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { API_ENDPOINT } from '../../shared/constants';
import { setLangPath } from '../../shared/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResumeService } from './resume.service';
import { ResponseCode } from '../../shared/app.constants';

const URL = environment.API_URI + "/" + API_ENDPOINT.FILE.UPLOAD;

@Component({
  selector: 'ngx-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  language: string;
  resume: IResume;

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

  formGroup: FormGroup;
  submitted = false;
  loading = true;

  fileToUpload: File;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'resume' });

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private service: ResumeService,
  ) {
    setLangPath("RESUME");
    this.language = 'en';
    this.setLang(this.language);
  }

  ngOnInit() {
    this.initialForm();
    this.initialModel();
    this.loading = false;
  }

  initialForm() {
    this.formGroup = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      birth: [null, Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    });
  }
  get f() { return this.formGroup.controls; }

  initialModel() {
    this.resume = {
      firstname: '',
      lastname: '',
      birth: null,
      age: null,
      phone: '',
      email: '',
      address: '',
      gender: '',
      expectedSalary: '',
      workExperience: {
        totalExpMonth: 0,
        work: []
      },
      education: [],
      hardSkill: [],
      softSkill: [],
      certificate: [],
      attachment: {
        originalname: '',
        uploadName: '',
      }
    };
  }

  setLang(lang) {
    this.language = lang;
    this.translate.use(lang);
  }

  onChangeBirthday(value: any) {
    const birthDay = new Date(value);
    const ageDifMs = Date.now() - birthDay.getTime();
    const ageDate = new Date(ageDifMs);
    this.resume.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  addWorkExperience() {
    this.resume.workExperience.work.push({
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
      this.resume.workExperience.work.splice(index, 1);
    }
  }

  addEducation() {
    this.resume.education.push({
      refDegree: '',
      gpa: '',
      university: '',
      major: '',
      deletion: false
    });
  }

  removeEducation(index: number) {
    if (index >= 0) {
      this.resume.education.splice(index, 1);
    }
  }

  addHardSkill() {
    this.hardSkill.required = false;
    this.hardSkill.duplication = false;

    if (this.hardSkill.keyword) {
      if (this.resume.hardSkill.indexOf(this.hardSkill.keyword) === -1) {
        this.resume.hardSkill.push(this.hardSkill.keyword);
        this.hardSkill.keyword = '';
      } else {
        this.hardSkill.duplication = true;
      }
    } else {
      this.hardSkill.required = true;
    }
  }

  removeHardSkill(index: number) {
    this.resume.hardSkill.splice(index, 1);
  }

  addSoftSkill() {
    this.softSkill.required = false;
    this.softSkill.duplication = false;

    if (this.softSkill.keyword) {
      if (this.resume.softSkill.indexOf(this.softSkill.keyword) === -1) {
        this.resume.softSkill.push(this.softSkill.keyword);
        this.softSkill.keyword = '';
      } else {
        this.softSkill.duplication = true;
      }
    } else {
      this.softSkill.required = true;
    }
  }

  removeSoftSkill(index: number) {
    this.resume.softSkill.splice(index, 1);
  }

  addCertificate() {
    this.certificate.required = false;
    this.certificate.duplication = false;

    if (this.certificate.keyword) {
      if (this.resume.certificate.indexOf(this.certificate.keyword) === -1) {
        this.resume.certificate.push(this.certificate.keyword);
        this.certificate.keyword = '';
      } else {
        this.certificate.duplication = true;
      }
    } else {
      this.certificate.required = true;
    }
  }

  removeCertificate(index: number) {
    this.resume.certificate.splice(index, 1);
  }

  handleFileInput(files: FileList) {
    const FileSize = files.item(0).size / 1024 / 1024; // in MB
    if (FileSize > 2) {
      this.clearAttachFile();
      return;
    } else {
      this.resume.attachment.originalname = files.item(0).name;
      this.resume.attachment.uploadName = "";
      this.fileToUpload = files.item(0);
    }
  }

  clearAttachFile() {
    this.resume.attachment.originalname = "";
    this.resume.attachment.uploadName = "";
    this.fileToUpload = null;
  }

  save() {
    this.submitted = true;
    if (this.validation()) {
      const request = this.setRequest();
      this.loading = true;
      this.service.create(request).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.loading = false;
        }
      });
    }
  }

  validation(): boolean {
    let isValid = true;
    let isPersonalValid = true;
    let isWorkExpValid = true;
    let isEducationValid = true;

    if (this.formGroup.invalid) {
      isPersonalValid = false;
      if (this.f.firstname.invalid) {
        document.getElementById('firstname').focus();
      } else if (this.f.lastname.invalid) {
        document.getElementById('lastname').focus();
      } else if (this.f.birth.invalid) {
        document.getElementById('birth').focus();
      } else if (this.f.phone.invalid) {
        document.getElementById('phone').focus();
      } else if (this.f.email.invalid) {
        document.getElementById('email').focus();
      }
    }
    if (isPersonalValid) {
      if (this.resume.workExperience.work && this.resume.workExperience.work.length) {
        this.resume.workExperience.work.forEach((element, index) => {
          if (isWorkExpValid) {
            if (!element.position) {
              isWorkExpValid = false;
              document.getElementById('position' + index).focus();
            } else if (!element.company) {
              isWorkExpValid = false;
              document.getElementById('company' + index).focus();
            } else if (!element.start) {
              isWorkExpValid = false;
              document.getElementById('start' + index).focus();
            } else if (!element.isPresent && !element.end) {
              isWorkExpValid = false;
              document.getElementById('end' + index).focus();
            } else if (!element.duty) {
              isWorkExpValid = false;
              document.getElementById('duty' + index).focus();
            }
          }
        });
      }
    }

    if (isPersonalValid && isWorkExpValid) {
      if (this.resume.education && this.resume.education.length) {
        this.resume.education.forEach((element, index) => {
          if (isEducationValid) {
            if (!element.refDegree) {
              isEducationValid = false;
              document.getElementById('refDegree' + index).focus();
            } else if (!element.university) {
              isEducationValid = false;
              document.getElementById('company' + index).focus();
            } else if (!element.major) {
              isEducationValid = false;
              document.getElementById('major' + index).focus();
            }
          }
        });
      }
    }

    if (!isPersonalValid || !isWorkExpValid || !isEducationValid) {
      isValid = false;
    }

    return isValid;
  }

  setRequest(): IResume {
    const request = JSON.parse(JSON.stringify(this.resume));
    request.birth = new Date(request.birth);
    if (request.workExperience.work && request.workExperience.work.length){
      request.workExperience.work.map(element => {
        element.start = new Date(element.start);
        if (!element.isPresent) {
          element.end = new Date(element.end);
        } else {
          element.end = null;
        }
      });
    }
    return request;
  }

}
