import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { JdListComponent } from './jd/jd-list/jd-list.component';
import { JdDetailComponent } from './jd/jd-detail/jd-detail.component';
import { JrListComponent } from './jr/jr-list/jr-list.component';
import { JrDetailComponent } from './jr/jr-detail/jr-detail.component';
import { TalentPoolListComponent } from './talent-pool/talent-pool-list/talent-pool-list.component';
import { TalentPoolDetailComponent } from './talent-pool/talent-pool-detail/talent-pool-detail.component';
import { ExamListComponent } from './exam/exam-list/exam-list.component';
import { ExamDetailComponent } from './exam/exam-detail/exam-detail.component';
import { AppointmentListComponent } from './appointment/appointment-list/appointment-list.component';
import { AppointmentDetailComponent } from './appointment/appointment-detail/appointment-detail.component';
import { InterviewListComponent } from './interview/interview-list/interview-list.component';
import { InterviewDetailComponent } from './interview/interview-detail/interview-detail.component';
import { SignContractListComponent } from './sign-contract/sign-contract-list/sign-contract-list.component';
import { SignContractDetailComponent } from './sign-contract/sign-contract-detail/sign-contract-detail.component';
import { OnboardListComponent } from './onboard/onboard-list/onboard-list.component';
import { OnboardDetailComponent } from './onboard/onboard-detail/onboard-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module')
          .then(m => m.DashboardModule),
      },
      // JD
      {
        path: 'jd/list',
        component: JdListComponent,
      },
      {
        path: 'jd/detail/:action',//create
        component: JdDetailComponent,
      },
      {
        path: 'jd/detail/:action/:id',//edit + duplicate
        component: JdDetailComponent,
      },
      // JR
      {
        path: 'jr/list',
        component: JrListComponent,
      },
      {
        path: 'jr/detail/:action',
        component: JrDetailComponent,
      },
      {
        path: 'jr/detail/:action/:id',
        component: JrDetailComponent,
      },
      // Talent Pool
      {
        path: 'talent-pool/list',
        component: TalentPoolListComponent,
      },
      {
        path: 'talent-pool/detail/:id',
        component: TalentPoolDetailComponent,
      },
      // Pending Exam
      {
        path: 'exam/list',
        component: ExamListComponent,
      },
      {
        path: 'exam/detail/:id',
        component: ExamDetailComponent,
      },
      // Pending Appointment
      {
        path: 'appointment/list',
        component: AppointmentListComponent,
      },
      {
        path: 'appointment/detail/:id',
        component: AppointmentDetailComponent,
      },
      // Pending Interview
      {
        path: 'interview/list',
        component: InterviewListComponent,
      },
      {
        path: 'interview/detail/:id',
        component: InterviewDetailComponent,
      },
      // Pending Sign Contract
      {
        path: 'sign-contract/list',
        component: SignContractListComponent,
      },
      {
        path: 'sign-contract/detail/:id',
        component: SignContractDetailComponent,
      },
      // Onboard
      {
        path: 'onboard/list',
        component: OnboardListComponent,
      },
      {
        path: 'onboard/detail/:id',
        component: OnboardDetailComponent,
      },
      // Report
      {
        path: 'report',
        loadChildren: () => import('./report/report.module')
          .then(m => m.ReportModule),
      },
      // Setting
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module')
          .then(m => m.SettingModule),
      },
      {
        path: '**',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
