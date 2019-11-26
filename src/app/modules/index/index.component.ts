import { Component, OnInit } from '@angular/core';
import { Devices } from '../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../shared/services/utilities.service';
import * as _ from 'lodash';
import { IndexService } from './index.service';
import { ResponseCode } from '../../shared/app.constants';
import { Router, ActivatedRoute } from "@angular/router";

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
  planToUse: string;
}
export interface ErrMsg {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  numberEmployees: string;
  userRole: string;
  planToUse: string;
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
  showNavigationArrows: boolean;
  isSubmitted: boolean = false;
  expanded: boolean = false;

  images = [
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

  planOptions = [
    {
      label: 'As soon as possible',
      value: 'As soon as possible'
    },
    {
      label: 'Dec 2019',
      value: 'Dec 2019'
    },
    {
      label: 'Jan 2020',
      value: 'Jan 2020'
    },
    {
      label: 'Feb 2020',
      value: 'Feb 2020'
    },
    {
      label: 'After Feb 2020',
      value: 'After Feb 2020'
    },
  ];
  news = [
    {
      title: 'CEBIT ASEAN Thailand 2019',
      remark: 'พบกับ Buddy Recruit ได้ในงาน "CEBIT ASEAN Thailand 2019" ระหว่างวันที่ 27-29 พฤศจิกายน 2562 ณ บูท C25 อาคาร 7 อิมแพ็ค เมืองทองธานี',
      img: '../../../assets/images/news/news1.jpg',
      link: 'https://cebitasean.com'
    },
    {
      title: 'Thailand HR TECH Conferenc',
      remark: 'Thailand HR TECH Conference & Exposition 2019 ขึ้น ในวันที่ 28–29 พฤษภาคม 2562',
      img: '../../../assets/images/news/news4.jpg',
      link: 'http://hrtech.pmat.or.th/app/netattm/attendee/page/88567'
    },
    {
      title: 'ZyGen ครบรอบ 20 ปี',
      remark: 'ZyGen ครบรอบ 20 ปี จัดงาน Practical Innovations For Business Opportunities & Profits',
      img: '../../../assets/images/news/news3.jpg',
      link: 'https://www.techtalkthai.com/zygen-20-anniversary-event-practical-innovation-for-business-opportunities-and-profit'
    },
  ];

  constructor(
    private utilitiesService: UtilitiesService,
    private service: IndexService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.innerHeight = window.innerHeight * 0.75;
    this.innerWidth = window.innerWidth * 0.8;
    this.devices = this.utilitiesService.getDevice();
    if (this.devices.isMobile || this.devices.isTablet) {
      this.showNavigationArrows = false;
      this.size = 'small';
    } else {
      this.showNavigationArrows = true;
      this.size = 'small';
    }
  }

  ngOnInit() {
    this.contactUs = this.initialModel();
    this.errMsg = this.initialErrMsg();
    // this.activatedRoute.fragment.subscribe((fragment: string) => {
    //   window.location.hash = fragment;
    // });
  }

  initialModel(): ContactUs {
    return {
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      numberEmployees: null,
      userRole: null,
      remark: '',
      hero: {
        hr: false,
        payroll: false,
        manager: false,
      },
      planToUse: 'As soon as possible'
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
      planToUse: ''
    };
  }

  toggleRegister() {
    this.expanded = !this.expanded;
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
      this.errMsg.firstName = 'Please enter first name.';
      isValid = false;
    }
    if (!this.contactUs.lastName) {
      this.errMsg.lastName = 'Please enter last name.';
      isValid = false;
    }
    if (!this.contactUs.email) {
      this.errMsg.email = 'Please enter work email.';
      isValid = false;
    } else if (!this.utilitiesService.isValidEmail(this.contactUs.email)) {
      this.errMsg.email = 'Incorrect email format. Please specify correct format.';
      isValid = false;
    }
    if (!this.contactUs.phone) {
      this.errMsg.phone = 'Please enter phone number.';
      isValid = false;
    } else if (!this.utilitiesService.isValidPhoneNumber(this.contactUs.phone)) {
      this.errMsg.phone = 'Incorrect phone number format. Please specify correct format.';
      isValid = false;
    }
    if (!this.contactUs.companyName) {
      this.errMsg.companyName = 'Please enter company name.';
      isValid = false;
    }
    if (!this.contactUs.numberEmployees) {
      this.errMsg.numberEmployees = 'Please enter number of empolyees.';
      isValid = false;
    } else if (!this.utilitiesService.isValidNumber(this.contactUs.numberEmployees.toString(), 7)) {
      this.errMsg.numberEmployees = 'Please specify correct format.';
      isValid = false;
    }
    if (!this.contactUs.planToUse) {
      this.errMsg.planToUse = 'Please select plan to use.';
      isValid = false;
    }
    // if (!this.contactUs.userRole) {
    //   this.errMsg.userRole = 'Please select role in the recruitment process.';
    //   isValid = false;
    // }
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
