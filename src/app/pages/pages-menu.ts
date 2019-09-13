import { NbMenuItem } from '@nebular/theme';

export const MENU_DASHBOARD: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'pie-chart-outline',
    link: '/dashboard',
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
    link: '/jd/list',
    hidden: false,
  },
  {
    title: 'Job Request',
    icon: 'done-all-outline',
    link: '/jr/list',
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
    icon: 'person-add-outline',
    link: '/talent-pool/list',
    hidden: false,
  },
  {
    title: 'Pending Exam',
    icon: 'person-add-outline',
    link: '/exam/list',
    hidden: false,
  },
  {
    title: 'Pending Appointment',
    icon: 'person-add-outline',
    link: '/appointment/list',
    hidden: false,
  },
  {
    title: 'Pending Interview',
    icon: 'person-add-outline',
    link: '/interview/list',
    hidden: false,
  },
  {
    title: 'Pending Sign Contract',
    icon: 'person-add-outline',
    link: '/sign-contract/list',
    hidden: false,
  },
  {
    title: 'Onboard',
    icon: 'person-add-outline',
    link: '/onboard/list',
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
    link: '/report/candidate',
    hidden: false,
  },
  {
    title: 'Feedback Report',
    link: '/report/feedback',
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
    link: '/setting/company-type',
    hidden: false,
  },
  {
    title: 'Company',
    link: '/setting/company',
    hidden: false,
  },
  {
    title: 'Department',
    link: '/setting/department',
    hidden: false,
  },
  {
    title: 'Division',
    link: '/setting/division',
    hidden: false,
  },
  {
    title: 'Authorize',
    link: '/setting/authorize',
    hidden: false,
  },
  {
    title: 'User',
    link: '/setting/user',
    hidden: false,
  },
  {
    title: 'Job Position',
    link: '/setting/job-position',
    hidden: false,
  },
  {
    title: 'Location',
    link: '/setting/location',
    hidden: false,
  },
  {
    title: 'Mail Template',
    link: '/setting/mail-template',
    hidden: false,
  },
  {
    title: 'Rejection',
    link: '/setting/rejection',
    hidden: false,
  },
  {
    title: 'Reject Stage',
    link: '/setting/reject-stage',
    hidden: false,
  },
  {
    title: 'Dashboard',
    link: '/setting/dashboard',
    hidden: false,
  },
  {
    title: 'Report',
    link: '/setting/report',
    hidden: false,
  },
];
