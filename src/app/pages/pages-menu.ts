import { NbMenuItem } from '@nebular/theme';

export const MENU_HOME: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/employer/home',
    home: true,
    hidden: false,
  }
];

export const MENU_DASHBOARD: NbMenuItem[] = [
  {
    title: 'Dashboard',
    group: true,
    hidden: false,
  },
  {
    title: 'Dashboard',
    icon: 'pie-chart-outline',
    link: '/employer/dashboard',
    home: true,
    hidden: false,
  }
];

export const MENU_MASTER_DATA: NbMenuItem[] = [
  {
    title: 'Master Data',
    group: true,
    hidden: false,
  },
  {
    title: 'Job Description',
    icon: 'list-outline',
    link: '/employer/jd/list',
    hidden: false,
  },
  {
    title: 'Job Request',
    icon: 'done-all-outline',
    link: '/employer/jr/list',
    hidden: false,
  },
];

export const MENU_PROCESS_FLOW: NbMenuItem[] = [
  {
    title: 'Process Flow',
    group: true,
    hidden: false,
  },
  {
    title: 'Talent Pool',
    icon: 'person-done-outline',
    link: '/employer/talent-pool/list',
    hidden: false,
  },
  {
    title: 'Pending Exam',
    icon: 'edit-outline',
    link: '/employer/exam/list',
    hidden: false,
  },
  {
    title: 'Pending Appointment',
    icon: 'clock-outline',
    link: '/employer/appointment/list',
    hidden: false,
  },
  {
    title: 'Pending Interview',
    icon: 'people-outline',
    link: '/employer/interview/list',
    hidden: false,
  },
  {
    title: 'Pending Sign Contract',
    icon: 'person-add-outline',
    link: '/employer/sign-contract/list',
    hidden: false,
  },
  {
    title: 'Onboard',
    icon: 'checkmark-circle-outline',
    link: '/employer/onboard/list',
    hidden: false,
  },
  {
    title: 'Consent Lists',
    icon: 'shopping-bag-outline',
    link: '/employer/consent/list',
    hidden: false,
  },
];

export const MENU_REPORT: NbMenuItem[] = [
  {
    title: 'Reporting',
    group: true,
    hidden: false,
  },
  {
    title: 'Reporting',
    icon: 'grid-outline',
    hidden: false,
    children: [

    ],
  },
];

export const MENU_REPORT_CHILD: NbMenuItem[] = [
  {
    title: 'Candidate Report',
    link: '/employer/report/candidate',
    hidden: false,
  },
  {
    title: 'Feedback Report',
    link: '/employer/report/feedback',
    hidden: false,
  },
  {
    title: 'Detail Report',
    link: '/employer/report/detail',
    hidden: false,
  },
];

export const MENU_SETTING: NbMenuItem[] = [
  {
    title: 'Setting',
    group: true,
    hidden: false,
  },
  {
    title: 'Setting',
    icon: 'settings-2-outline',
    hidden: false,
    children: [

    ],
  },
];

export const MENU_SETTING_CHILD: NbMenuItem[] = [
  {
    title: 'Company Type',
    link: '/employer/setting/company-type',
    hidden: false,
  },
  {
    title: 'Company',
    link: '/employer/setting/company',
    hidden: false,
  },
  {
    title: 'Department',
    link: '/employer/setting/department',
    hidden: false,
  },
  {
    title: 'Division',
    link: '/employer/setting/division',
    hidden: false,
  },
  {
    title: 'Authorize',
    link: '/employer/setting/authorize',
    hidden: false,
  },
  {
    title: 'User',
    link: '/employer/setting/user',
    hidden: false,
  },
  {
    title: 'Job Position',
    link: '/employer/setting/job-position',
    hidden: false,
  },
  {
    title: 'Evaluation Form',
    link: '/employer/setting/evaluation',
    hidden: false,
  },
  {
    title: 'Location',
    link: '/employer/setting/location',
    hidden: false,
  },
  {
    title: 'Mail Template',
    link: '/employer/setting/mail-template',
    hidden: false,
  },
  {
    title: 'Rejection',
    link: '/employer/setting/rejection',
    hidden: false,
  },
  {
    title: 'Reject Stage',
    link: '/employer/setting/reject-stage',
    hidden: false,
  },
  {
    title: 'Dashboard',
    link: '/employer/setting/dashboard',
    hidden: false,
  },
  {
    title: 'Report',
    link: '/employer/setting/report',
    hidden: false,
  },
  {
    title: 'Blacklist',
    link: '/employer/setting/blacklist',
    hidden: false,
  },
  {
    title: 'Online Exam',
    link: '/employer/setting/exam-online',
    hidden: false,
  },
  {
    title: 'Application Form',
    link: '/employer/setting/app-form',
    hidden: false,
  },
  {
    title: 'Blog',
    link: '/blog',
    hidden: false,
  },
];
