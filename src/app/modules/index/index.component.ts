import { Component, OnInit } from '@angular/core';
import { Devices } from '../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../shared/services/utilities.service';
import * as _ from 'lodash';
import { IndexService } from './index.service';
import { ResponseCode } from '../../shared/app.constants';

export interface ContactUs {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  numberEmployees: number;
  userRole: number;
  remark: string;
  hero: {
    hr: boolean;
    payroll: boolean;
    manager: boolean;
  },
}
export interface ErrMsg {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  numberEmployees: string;
  userRole: string;
}

@Component({
  selector: 'ngx-index',
  templateUrl: './index.component.html',
  styleUrls: [
    './index.component.scss',
    '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
  ]
})
export class IndexComponent implements OnInit {
  innerHeight: any;
  innerWidth: any;
  devices: Devices;
  size: string;
  contactUs: ContactUs;
  errMsg: ErrMsg;

  images: any;
  showNavigationArrows: boolean;
  roleOptions = [
    {
      label: 'HR only',
      value: 1
    },
    {
      label: 'HR, Manager',
      value: 2
    },
    {
      label: 'HR, Payroll',
      value: 3
    },
    {
      label: 'HR, Manager, Payroll',
      value: 4
    }
  ];
  isSubmitted = false;

  constructor(
    private utilitiesService: UtilitiesService,
    private service: IndexService,
  ) {
    this.innerHeight = window.innerHeight * 0.8;
    this.innerWidth = window.innerWidth * 0.8;
    this.devices = this.utilitiesService.getDevice();
    if (this.devices.isMobile || this.devices.isTablet) {
      this.showNavigationArrows = false;
      this.size = "small";
    } else {
      this.showNavigationArrows = true;
      this.size = "medium";
    }
  }

  ngOnInit() {
    this.images = [
      {
        img: '../../../assets/images/sec_2_03.jpg',
        title: 'Organize : Easy Application Tracking & effective onboarding',
        remark: 'A modern , Intelligent & friendly applicant tracking system',
      },
      {
        img: '../../../assets/images/sec_3_03.jpg',
        title: 'Big Data : The hardest part of recruitment is screening & evaluating candidate from a large application pool',
        remark: 'Candidate screening is a BIG CHALLENGE. Inability in using data effectively',
      },
      {
        img: '../../../assets/images/sec_4_03.jpg',
        title: 'Let "BUDDY RECRUIT" help you!',
        remark: 'Your Buddy for Successful Recruitment',
      },
      {
        img: '../../../assets/images/sec_1_03.jpg',
        title: 'Match : Get qualified candidates & Collaborate effectively',
        remark: 'Lack of understanding between the recruiters and hiring manager?',
      },
    ];
    this.contactUs = this.initialModel();
    this.errMsg = this.initialErrMsg();
  }

  initialModel(): ContactUs {
    return {
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      numberEmployees: null,
      userRole: 1,
      remark: '',
      hero: {
        hr: false,
        payroll: false,
        manager: false,
      },
    };
  }

  initialErrMsg(): ErrMsg {
    return {
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      numberEmployees: '',
      userRole: '',
    };
  }

  submit() {
    if (this.validation()) {
      const request = this.setRequest();
      this.service.create(request).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.isSubmitted = true;
        }
      });
    }
  }

  validation(): boolean {
    let isValid = true;
    this.errMsg = this.initialErrMsg();
    if (!this.contactUs.firstName) {
      this.errMsg.firstName = 'Please enter first name';
      isValid = false;
    }
    if (!this.contactUs.lastName) {
      this.errMsg.lastName = 'Please enter last name';
      isValid = false;
    }
    if (!this.contactUs.email) {
      this.errMsg.email = 'Please enter work email';
      isValid = false;
    }
    if (!this.contactUs.phone) {
      this.errMsg.phone = 'Please enter phone number';
      isValid = false;
    }
    if (!this.contactUs.companyName) {
      this.errMsg.companyName = 'Please enter company name';
      isValid = false;
    }
    if (!this.contactUs.numberEmployees) {
      this.errMsg.numberEmployees = 'Please enter number of empolyees';
      isValid = false;
    }
    if (!this.contactUs.userRole) {
      this.errMsg.userRole = 'Please select role in the recruitment process';
      isValid = false;
    }
    return isValid;
  }

  setRequest(): ContactUs {
    const request = _.cloneDeep(this.contactUs);
    request.hero.hr = false;
    request.hero.manager = false;
    request.hero.payroll = false;
    switch (request.userRole) {
      case 1:
        request.hero.hr = true;
        break;
      case 2:
        request.hero.hr = true;
        request.hero.manager = true;
        break;
      case 3:
        request.hero.hr = true;
        request.hero.payroll = true;
        break;
      case 4:
        request.hero.hr = true;
        request.hero.manager = true;
        request.hero.payroll = true;
        break;
      default:
        break;
    }
    return request;
  }

}
